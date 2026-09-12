package com.airline.reservation.service;

import com.airline.reservation.repository.*;
import com.airline.reservation.entity.*;
import com.airline.reservation.exception.*;
import com.airline.reservation.dto.request.*;
import com.airline.reservation.dto.response.IssueTicketResponseByAdminDto;
import com.airline.reservation.dto.response.IssueTicketResponseDto;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class IssueTicketServiceImpl implements IssueTicketService {

    private final IssueTicketRepository ticketRepository;
    private final UserRepository userRepository;
    private final BookingRepository bookingRepository;

    @Override
    public IssueTicketResponseDto createTicket(IssueTicketRequestDto request) {

        User user = getLoggedInUser();

        Booking booking = bookingRepository.findById(request.getBookingId())
                .orElseThrow(() -> new
                        ResourceNotFoundException("Booking not found"));

        if (!booking.getUser().getId().equals(user.getId())) {
            throw new AccessDeniedException("You are not authorized to create a ticket for this booking");
        }

        SupportTicket ticket = SupportTicket.builder()
                .subject(request.getSubject())
                .description(request.getDescription())
                .status(IssueTicket.PENDING)
                .user(user)
                .booking(booking)
                .createdAt(LocalDateTime.now())
                .build();

        return mapToResponse(ticketRepository.save(ticket));
    }

    @Override
    public List<IssueTicketResponseDto> getMyTickets() {
        User user = getLoggedInUser();
        return ticketRepository.findByUserId(user.getId())
                .stream().map(this::mapToResponse).toList();
    }

    @Override
    public List<IssueTicketResponseDto> getAllTickets() {
        return ticketRepository.findAll()
                .stream().map(this::mapToResponse).toList();
    }

    @Override
    public IssueTicketResponseDto getTicketById(Long id) {
        return mapToResponse(findTicket(id));
    }

    @Override
    public IssueTicketResponseDto reviewTicket(Long id) {
        SupportTicket ticket = findTicket(id);
        ticket.setStatus(IssueTicket.REVIEWED);
        ticket.setUpdatedAt(LocalDateTime.now());
        return mapToResponse(ticketRepository.save(ticket));
    }

    @Override
    public IssueTicketResponseDto resolveTicket(Long id, IssueTicketResponseByAdminDto request) {

        SupportTicket ticket = findTicket(id);

        ticket.setStatus(IssueTicket.RESOLVED);
        ticket.setAdminResponse(request.getAdminResponse());
        ticket.setUpdatedAt(LocalDateTime.now());

        return mapToResponse(ticketRepository.save(ticket));
    }

    private SupportTicket findTicket(Long id) {
        return ticketRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Ticket not found"));
    }

    private User getLoggedInUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    private IssueTicketResponseDto mapToResponse(SupportTicket t) {
        return IssueTicketResponseDto.builder()
                .id(t.getId())
                .subject(t.getSubject())
                .description(t.getDescription())
                .status(t.getStatus().name())
                .userName(t.getUser().getFirstName() + " " + t.getUser().getLastName())
                .bookingReference(t.getBooking().getBookingReference())
                .adminResponse(t.getAdminResponse())
                .createdAt(t.getCreatedAt())
                .updatedAt(t.getUpdatedAt())
                .build();
    }
}