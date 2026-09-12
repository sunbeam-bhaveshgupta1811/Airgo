package com.airline.reservation.security;

import com.airline.reservation.repository.UserRepository;
import com.airline.reservation.entity.Role;
import com.airline.reservation.entity.User;
import com.airline.reservation.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

/**
 * Single place where "may the current caller touch this resource?" is decided.
 *
 * Before this existed, ownership checks were copy-pasted `if` statements spread across
 * services, and several endpoints simply forgot them. Route every authorization decision
 * through here so a missing check is visible by its absence rather than hidden in a diff.
 *
 * All denials throw Spring Security's {@link AccessDeniedException}, which
 * GlobalExceptionHandler maps to HTTP 403 — not the 400 the old checks produced.
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class AccessGuard {

    private final UserRepository userRepository;

    /** The authenticated caller. Throws 403 rather than NPE when there is no authentication. */
    public User currentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated() || "anonymousUser".equals(auth.getPrincipal())) {
            throw new AccessDeniedException("Authentication required");
        }
        return userRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    public boolean isAdmin() {
        return currentUser().getRole() == Role.ADMIN;
    }

    /**
     * Caller must be the owner of the resource, or an ADMIN.
     * Pass the resource's owning {@link User}.
     */
    public void requireOwnerOrAdmin(User owner, String resourceDescription) {
        User caller = currentUser();
        if (caller.getRole() == Role.ADMIN) {
            return;
        }
        if (owner == null || !owner.getId().equals(caller.getId())) {
            log.warn("Access denied: user {} attempted to access {} owned by {}",
                    caller.getEmail(), resourceDescription,
                    owner != null ? owner.getEmail() : "unknown");
            throw new AccessDeniedException("You are not authorized to access this " + resourceDescription);
        }
    }

    /**
     * Strict ownership — ADMIN does NOT bypass. Use for actions that are personal even for
     * admins (e.g. acting on your own notifications).
     */
    public void requireOwner(User owner, String resourceDescription) {
        User caller = currentUser();
        if (owner == null || !owner.getId().equals(caller.getId())) {
            log.warn("Access denied: user {} attempted to access {} they do not own",
                    caller.getEmail(), resourceDescription);
            throw new AccessDeniedException("You are not authorized to access this " + resourceDescription);
        }
    }

    /**
     * The airport an AIRPORT_MANAGER is assigned to, read from the database so it reflects
     * admin reassignment immediately rather than whatever was baked into their JWT.
     * Returns null when the caller has no airport (unassigned manager, or a USER).
     */
    public Long currentAirportId() {
        User caller = currentUser();
        return caller.getAirport() != null ? caller.getAirport().getId() : null;
    }

    /** Same as {@link #currentAirportId()} but rejects unassigned managers, for write paths. */
    public Long requireCurrentAirportId() {
        Long airportId = currentAirportId();
        if (airportId == null) {
            throw new AccessDeniedException(
                    "No airport is assigned to your account. Contact the administrator.");
        }
        return airportId;
    }

    /**
     * Caller must be an ADMIN, or an AIRPORT_MANAGER assigned to {@code targetAirportId}.
     *
     * This is the check that was entirely missing from the terminal and gate services,
     * which let any manager read and modify any airport's infrastructure.
     */
    public void requireAirportScope(Long targetAirportId, String resourceDescription) {
        User caller = currentUser();
        if (caller.getRole() == Role.ADMIN) {
            return;
        }
        Long callerAirportId = caller.getAirport() != null ? caller.getAirport().getId() : null;
        if (callerAirportId == null || !callerAirportId.equals(targetAirportId)) {
            log.warn("Access denied: manager {} (airport {}) attempted to access {} at airport {}",
                    caller.getEmail(), callerAirportId, resourceDescription, targetAirportId);
            throw new AccessDeniedException(
                    "You can only manage " + resourceDescription + " at your own airport");
        }
    }

    /**
     * A flight belongs to a manager's scope if it departs from or arrives at their airport.
     * Both airport ids of the *target entity* must be supplied by the caller — never values
     * taken from a request body, which the caller controls.
     */
    public void requireFlightScope(Long originAirportId, Long destinationAirportId, String action) {
        User caller = currentUser();
        if (caller.getRole() == Role.ADMIN) {
            return;
        }
        Long callerAirportId = caller.getAirport() != null ? caller.getAirport().getId() : null;
        if (callerAirportId == null
                || (!callerAirportId.equals(originAirportId) && !callerAirportId.equals(destinationAirportId))) {
            log.warn("Access denied: manager {} (airport {}) attempted to {} a flight on route {} -> {}",
                    caller.getEmail(), callerAirportId, action, originAirportId, destinationAirportId);
            throw new AccessDeniedException(
                    "You can only " + action + " flights that depart from or arrive at your airport");
        }
    }
}
