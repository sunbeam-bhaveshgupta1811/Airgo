package com.airline.controller;

import com.airline.request.*;
import com.airline.response.IssueTicketResponseByAdminDto;
import com.airline.response.IssueTicketResponseDto;
import com.airline.service.IssueTicketService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping
@RequiredArgsConstructor
@SecurityRequirement(name = "bearerAuth")
public class IssueTicketController {

    private final IssueTicketService ticketService;

    @PreAuthorize("hasRole('USER')")
    @PostMapping("/user/tickets")
    public IssueTicketResponseDto create(@RequestBody IssueTicketRequestDto request) {
        return ticketService.createTicket(request);
    }

    @PreAuthorize("hasRole('USER')")
    @GetMapping("/user/tickets/my")
    public List<IssueTicketResponseDto> myTickets() {
        return ticketService.getMyTickets();
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/admin/tickets")
    public List<IssueTicketResponseDto> all() {
        return ticketService.getAllTickets();
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/admin/tickets/{id}")
    public IssueTicketResponseDto getById(@PathVariable Long id) {
        return ticketService.getTicketById(id);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/admin/tickets/{id}/review")
    public IssueTicketResponseDto review(@PathVariable Long id) {
        return ticketService.reviewTicket(id);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/admin/tickets/{id}/resolve")
    public IssueTicketResponseDto resolve(@PathVariable Long id,
                                          @RequestBody IssueTicketResponseByAdminDto request) {
        return ticketService.resolveTicket(id, request);
    }
}