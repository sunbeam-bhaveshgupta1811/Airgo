package com.airline.service;

import com.airline.dao.*;
import com.airline.entity.*;
import com.airline.exception.*;
import com.airline.request.*;
import com.airline.response.IssueTicketResponseByAdminDto;
import com.airline.response.IssueTicketResponseDto;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class IssueTicketServiceImpl implements IssueTicketService {

    private final IssueTicketDao ticketDao;
    private final UserDao userDao;
    private final BookingDao bookingDao;

    @Override
    public IssueTicketResponseDto createTicket(IssueTicketRequestDto request) {

        User user = getLoggedInUser();

        Booking booking = bookingDao.findById(request.getBookingId())
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));

        SupportTicket ticket = SupportTicket.builder()
                .subject(request.getSubject())
                .description(request.getDescription())
                .status(IssueTicket.PENDING)
                .user(user)
                .booking(booking)
                .createdAt(LocalDateTime.now())
                .build();

        return mapToResponse(ticketDao.save(ticket));
    }

    @Override
    public List<IssueTicketResponseDto> getMyTickets() {
        User user = getLoggedInUser();
        return ticketDao.findByUserId(user.getId())
                .stream().map(this::mapToResponse).toList();
    }

    @Override
    public List<IssueTicketResponseDto> getAllTickets() {
        return ticketDao.findAll()
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
        return mapToResponse(ticketDao.save(ticket));
    }

    @Override
    public IssueTicketResponseDto resolveTicket(Long id, IssueTicketResponseByAdminDto request) {

        SupportTicket ticket = findTicket(id);

        ticket.setStatus(IssueTicket.RESOLVED);
        ticket.setAdminResponse(request.getAdminResponse());
        ticket.setUpdatedAt(LocalDateTime.now());

        return mapToResponse(ticketDao.save(ticket));
    }

    private SupportTicket findTicket(Long id) {
        return ticketDao.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Ticket not found"));
    }

    private User getLoggedInUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userDao.findByEmail(email)
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