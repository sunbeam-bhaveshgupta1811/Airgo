package com.airline.service;

import com.airline.response.SeatMapResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class SeatBroadcastService {

    private final SimpMessagingTemplate messagingTemplate;
    private final SeatAssignmentService seatAssignmentService;

    public void broadcastSeatUpdate(Long scheduleId) {
        try {
            SeatMapResponse seatMap = seatAssignmentService.getSeatMap(scheduleId);
            messagingTemplate.convertAndSend("/topic/flights/" + scheduleId + "/seats", seatMap);
            log.info("Seat map broadcast for schedule {}", scheduleId);
        } catch (Exception e) {
            log.error("Failed to broadcast seat update for schedule {}: {}", scheduleId, e.getMessage());
        }
    }
}
