package com.airline.controller;

import com.airline.response.SeatMapResponse;
import com.airline.service.SeatAssignmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Controller
@RequiredArgsConstructor
public class SeatWebSocketController {

    private final SeatAssignmentService seatAssignmentService;

    @MessageMapping("/flights/{scheduleId}/seats")
    @SendTo("/topic/flights/{scheduleId}/seats")
    public SeatMapResponse getSeatMap(@DestinationVariable Long scheduleId) {
        return seatAssignmentService.getSeatMap(scheduleId);
    }
}
