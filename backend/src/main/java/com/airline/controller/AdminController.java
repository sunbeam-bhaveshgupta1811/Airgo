package com.airline.controller;

import com.airline.dao.AirlineDao;
import com.airline.dao.BookingDao;
import com.airline.dao.FlightDao;
import com.airline.dto.ApiResponse;
import com.airline.entity.AirlineStatus;
import com.airline.response.UserProfileResponseDto;
import com.airline.service.UserService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.airline.entity.User;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/admin")
@PreAuthorize("hasRole('ADMIN')")
@SecurityRequirement(name = "bearerAuth")
@RequiredArgsConstructor
public class AdminController {

    private final UserService userService;
    private final com.airline.dao.UserDao userDao;
    private final AirlineDao airlineDao;
    private final FlightDao flightDao;
    private final BookingDao bookingDao;
    private final com.airline.dao.AirportDao airportDao;
    private final com.airline.dao.FlightScheduleDao scheduleDao;

    @GetMapping("/users")
    public ResponseEntity<ApiResponse<List<UserProfileResponseDto>>> getAllUsers() {
        return ResponseEntity.ok(
                ApiResponse.success("Users fetched successfully"
                        , userService.getAllUsers())
        );
    }

    @GetMapping("/users/{id}")
    public ResponseEntity<ApiResponse<UserProfileResponseDto>> getUserById(@PathVariable Long id) {
        return ResponseEntity.ok(
                ApiResponse.success("User fetched successfully", userService.getUserById(id))
        );
    }

    @GetMapping("/dashboard")
    public ResponseEntity<ApiResponse<String>> dashboard() {
        return ResponseEntity.ok(
                ApiResponse.success("Welcome to Admin Dashboard", "Analytics coming soon")
        );
    }

    @GetMapping("/dashboard/revenue-by-airline")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getRevenueByAirline() {
        List<Object[]> rawData = bookingDao.getRevenueByAirline();
        List<Map<String, Object>> result = new java.util.ArrayList<>();
        for (Object[] row : rawData) {
            Map<String, Object> entry = new LinkedHashMap<>();
            entry.put("airline", row[0]);
            entry.put("revenue", row[1]);
            result.add(entry);
        }
        return ResponseEntity.ok(ApiResponse.success("Revenue by airline fetched", result));
    }

    @GetMapping("/dashboard/stats")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getDashboardStats() {
        Map<String, Object> stats = new LinkedHashMap<>();
        stats.put("airlineCount", airlineDao.findByStatus(AirlineStatus.ACTIVE).size());
        stats.put("flightCount", flightDao.count());
        stats.put("bookingCount", bookingDao.count());
        stats.put("totalRevenue", bookingDao.getTotalRevenue());
        return ResponseEntity.ok(ApiResponse.success("Dashboard stats fetched", stats));
    }

//	@GetMapping("/airlines/count")
//	public ResponseEntity<Long> countTotalAirline(){
//		return ResponseEntity.ok(adminService.getTotalAirlinesCount());
//	}
//
//	@GetMapping("/airlines/flightcount")
//	public ResponseEntity<Long> countTotalFlight(){
//		return ResponseEntity.ok(adminService.getTotalFlightsCount());
//	}
//
//	@GetMapping("/airlines/bookingcount")
//	public ResponseEntity<Long> countTotalBooking(){
//		return ResponseEntity.ok(adminService.getTotalBooking());
//	}
//
//	@GetMapping("/airlines/totalAmountBooking")
//	public ResponseEntity<Double> countTotalAmountBooking(){
//		return ResponseEntity.ok(adminService.getTotalAmountBooking());
//	}
//
//	@GetMapping("/airlineManagement")
//    public ResponseEntity<List<AirlineResponseDto>> getAllAirlines() {
//        List<AirlineResponseDto> airlines = adminService.getAllAirlines();
//        return ResponseEntity.ok(airlines);
//    }
//
//	@GetMapping("/feedback")
//	public ResponseEntity<ApiResponse<List<FeedbackDto>>> getAllFeedback(){
//		ApiResponse<List<FeedbackDto>> feedback = adminService.getAllFeedback();
//		return ResponseEntity.ok(feedback);
//	}
//
//	@DeleteMapping("/deleteairline/{id}")
//    public ResponseEntity<ApiResponse<?>> deleteAirline(@PathVariable Long id) {
//		flightServiceImpl.deleteAirlineManagement(id);
//        return ResponseEntity.ok(new ApiResponse<>(true,"Delete Success..",id));
//    }
//
//
//

    @GetMapping("/managers")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getAllManagers() {
        List<User> managers = userDao.findByRole(com.airline.entity.Role.AIRPORT_MANAGER);
        List<Map<String, Object>> result = managers.stream().map(m -> {
            Map<String, Object> map = new LinkedHashMap<>();
            map.put("id", m.getId());
            map.put("firstName", m.getFirstName());
            map.put("lastName", m.getLastName());
            map.put("email", m.getEmail());
            map.put("phone", m.getPhone());
            map.put("approvalStatus", m.getApprovalStatus() != null ? m.getApprovalStatus().name() : "PENDING");
            map.put("enabled", m.isEnabled());
            map.put("emailVerified", m.isEmailVerified());
            map.put("airportId", m.getAirport() != null ? m.getAirport().getId() : null);
            map.put("airportName", m.getAirport() != null ? m.getAirport().getName() : null);
            map.put("createdAt", m.getCreatedAt());
            return map;
        }).toList();
        return ResponseEntity.ok(ApiResponse.success("Managers fetched", result));
    }

    @PatchMapping("/managers/{id}/approve")
    public ResponseEntity<ApiResponse<Void>> approveManager(@PathVariable Long id) {
        User manager = userDao.findById(id)
                .orElseThrow(() -> new com.airline.exception.ResourceNotFoundException("Manager not found"));
        if (manager.getRole() != com.airline.entity.Role.AIRPORT_MANAGER) {
            throw new com.airline.exception.BadRequestException("User is not an Airport Manager");
        }
        manager.setApprovalStatus(com.airline.entity.ApprovalStatus.APPROVED);
        manager.setEnabled(true);
        userDao.save(manager);
        return ResponseEntity.ok(ApiResponse.success("Manager approved successfully", null));
    }

    @PatchMapping("/managers/{id}/reject")
    public ResponseEntity<ApiResponse<Void>> rejectManager(@PathVariable Long id) {
        User manager = userDao.findById(id)
                .orElseThrow(() -> new com.airline.exception.ResourceNotFoundException("Manager not found"));
        if (manager.getRole() != com.airline.entity.Role.AIRPORT_MANAGER) {
            throw new com.airline.exception.BadRequestException("User is not an Airport Manager");
        }
        manager.setApprovalStatus(com.airline.entity.ApprovalStatus.REJECTED);
        manager.setEnabled(false);
        userDao.save(manager);
        return ResponseEntity.ok(ApiResponse.success("Manager rejected", null));
    }

    @DeleteMapping("/managers/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteManager(@PathVariable Long id) {
        User manager = userDao.findById(id)
                .orElseThrow(() -> new com.airline.exception.ResourceNotFoundException("Manager not found"));
        if (manager.getRole() != com.airline.entity.Role.AIRPORT_MANAGER) {
            throw new com.airline.exception.BadRequestException("User is not an Airport Manager");
        }
        userDao.delete(manager);
        return ResponseEntity.ok(ApiResponse.success("Manager deleted", null));
    }

    @PatchMapping("/airports/{airportId}/assign-manager/{managerId}")
    public ResponseEntity<ApiResponse<Void>> assignManagerToAirport(
            @PathVariable Long airportId, @PathVariable Long managerId) {
        com.airline.entity.Airport airport = airportDao.findById(airportId)
                .orElseThrow(() -> new com.airline.exception.ResourceNotFoundException("Airport not found"));
        User manager = userDao.findById(managerId)
                .orElseThrow(() -> new com.airline.exception.ResourceNotFoundException("Manager not found"));

        if (manager.getRole() != com.airline.entity.Role.AIRPORT_MANAGER) {
            throw new com.airline.exception.BadRequestException("User is not an Airport Manager");
        }
        if (manager.getApprovalStatus() != com.airline.entity.ApprovalStatus.APPROVED) {
            throw new com.airline.exception.BadRequestException("Manager must be approved before assignment");
        }

        // Check if airport already has a manager
        userDao.findByAirportId(airportId).ifPresent(existing -> {
            if (!existing.getId().equals(managerId)) {
                existing.setAirport(null);
                userDao.save(existing);
            }
        });

        // Check if manager already assigned to another airport
        if (manager.getAirport() != null && !manager.getAirport().getId().equals(airportId)) {
            throw new com.airline.exception.BadRequestException(
                    "Manager is already assigned to " + manager.getAirport().getName() + ". Unassign first.");
        }

        manager.setAirport(airport);
        userDao.save(manager);
        return ResponseEntity.ok(ApiResponse.success(
                "Manager " + manager.getFirstName() + " assigned to " + airport.getName(), null));
    }

    @PatchMapping("/airports/{airportId}/unassign-manager")
    public ResponseEntity<ApiResponse<Void>> unassignManagerFromAirport(@PathVariable Long airportId) {
        userDao.findByAirportId(airportId).ifPresent(manager -> {
            manager.setAirport(null);
            userDao.save(manager);
        });
        return ResponseEntity.ok(ApiResponse.success("Manager unassigned from airport", null));
    }

    @GetMapping("/airports/{id}/history")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getAirportHistory(@PathVariable Long id) {
        com.airline.entity.Airport airport = airportDao.findById(id)
                .orElseThrow(() -> new com.airline.exception.ResourceNotFoundException("Airport not found"));

        Map<String, Object> history = new LinkedHashMap<>();
        history.put("airport", com.airline.response.AirportResponseDto.builder()
                .id(airport.getId()).code(airport.getCode()).name(airport.getName())
                .city(airport.getCity()).country(airport.getCountry()).timezone(airport.getTimezone())
                .active(airport.isActive()).build());

        // Assigned manager
        userDao.findByAirportId(id).ifPresentOrElse(
                m -> {
                    Map<String, Object> mgr = new LinkedHashMap<>();
                    mgr.put("id", m.getId());
                    mgr.put("name", m.getFirstName() + " " + m.getLastName());
                    mgr.put("email", m.getEmail());
                    history.put("manager", mgr);
                },
                () -> history.put("manager", null)
        );

        // Flights at this airport
        List<com.airline.entity.Flight> flights = flightDao.findByAirportId(id);
        history.put("totalFlights", flights.size());
        history.put("flights", flights.stream().map(f -> {
            Map<String, Object> fm = new LinkedHashMap<>();
            fm.put("id", f.getId());
            fm.put("flightNumber", f.getFlightNumber());
            fm.put("airline", f.getAirline().getName());
            fm.put("origin", f.getOriginAirport().getCode());
            fm.put("destination", f.getDestinationAirport().getCode());
            fm.put("status", f.getStatus().name());
            return fm;
        }).toList());

        // Bookings at this airport
        List<com.airline.entity.Booking> bookings = bookingDao.findByAirportIdWithDetails(id);
        history.put("totalBookings", bookings.size());
        java.math.BigDecimal totalRevenue = bookings.stream()
                .filter(b -> b.getStatus() == com.airline.entity.BookingStatus.CONFIRMED)
                .map(com.airline.entity.Booking::getTotalAmount)
                .reduce(java.math.BigDecimal.ZERO, java.math.BigDecimal::add);
        history.put("totalRevenue", totalRevenue);

        // Recent bookings (last 20)
        history.put("recentBookings", bookings.stream().limit(20).map(b -> {
            Map<String, Object> bm = new LinkedHashMap<>();
            bm.put("id", b.getId());
            bm.put("reference", b.getBookingReference());
            bm.put("passenger", b.getUser().getFirstName() + " " + b.getUser().getLastName());
            bm.put("flight", b.getFlightSchedule().getFlight().getFlightNumber());
            bm.put("date", b.getFlightSchedule().getJourneyDate());
            bm.put("amount", b.getTotalAmount());
            bm.put("status", b.getStatus().name());
            bm.put("createdAt", b.getCreatedAt());
            return bm;
        }).toList());

        return ResponseEntity.ok(ApiResponse.success("Airport history fetched", history));
    }

}
