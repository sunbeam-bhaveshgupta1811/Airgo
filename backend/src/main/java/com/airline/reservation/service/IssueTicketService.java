package com.airline.reservation.service;

import com.airline.reservation.dto.request.*;
import com.airline.reservation.dto.response.IssueTicketResponseByAdminDto;
import com.airline.reservation.dto.response.IssueTicketResponseDto;

import java.util.List;

public interface IssueTicketService {

    IssueTicketResponseDto createTicket(IssueTicketRequestDto request);

    List<IssueTicketResponseDto> getMyTickets();

    List<IssueTicketResponseDto> getAllTickets();

    IssueTicketResponseDto getTicketById(Long id);

    IssueTicketResponseDto reviewTicket(Long id);

    IssueTicketResponseDto resolveTicket(Long id, IssueTicketResponseByAdminDto request);
}