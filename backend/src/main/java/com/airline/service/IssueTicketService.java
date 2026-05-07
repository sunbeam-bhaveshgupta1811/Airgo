package com.airline.service;

import com.airline.request.*;
import com.airline.response.IssueTicketResponseByAdminDto;
import com.airline.response.IssueTicketResponseDto;

import java.util.List;

public interface IssueTicketService {

    IssueTicketResponseDto createTicket(IssueTicketRequestDto request);

    List<IssueTicketResponseDto> getMyTickets();

    List<IssueTicketResponseDto> getAllTickets();

    IssueTicketResponseDto getTicketById(Long id);

    IssueTicketResponseDto reviewTicket(Long id);

    IssueTicketResponseDto resolveTicket(Long id, IssueTicketResponseByAdminDto request);
}