package com.airline.controller;

import com.airline.dao.NotificationDao;
import com.airline.dao.UserDao;
import com.airline.dto.ApiResponse;
import com.airline.entity.Notification;
import com.airline.entity.User;
import com.airline.exception.ResourceNotFoundException;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
@SecurityRequirement(name = "bearerAuth")
public class NotificationController {

    private final NotificationDao notificationDao;
    private final UserDao userDao;

    @GetMapping
    public ResponseEntity<ApiResponse<List<Notification>>> getMyNotifications() {
        User user = getLoggedInUser();
        List<Notification> notifications = notificationDao.findByUserIdOrderByCreatedAtDesc(user.getId());
        return ResponseEntity.ok(ApiResponse.success("Notifications fetched", notifications));
    }

    @GetMapping("/unread")
    public ResponseEntity<ApiResponse<List<Notification>>> getUnreadNotifications() {
        User user = getLoggedInUser();
        List<Notification> notifications = notificationDao.findByUserIdAndReadFalseOrderByCreatedAtDesc(user.getId());
        return ResponseEntity.ok(ApiResponse.success("Unread notifications fetched", notifications));
    }

    @GetMapping("/unread/count")
    public ResponseEntity<ApiResponse<Map<String, Integer>>> getUnreadCount() {
        User user = getLoggedInUser();
        int count = notificationDao.countByUserIdAndReadFalse(user.getId());
        return ResponseEntity.ok(ApiResponse.success("Count fetched", Map.of("count", count)));
    }

    @PatchMapping("/{id}/read")
    public ResponseEntity<ApiResponse<Void>> markAsRead(@PathVariable Long id) {
        Notification notification = notificationDao.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Notification not found"));
        notification.setRead(true);
        notificationDao.save(notification);
        return ResponseEntity.ok(ApiResponse.success("Marked as read", null));
    }

    @PatchMapping("/read-all")
    public ResponseEntity<ApiResponse<Void>> markAllAsRead() {
        User user = getLoggedInUser();
        List<Notification> unread = notificationDao.findByUserIdAndReadFalseOrderByCreatedAtDesc(user.getId());
        unread.forEach(n -> n.setRead(true));
        notificationDao.saveAll(unread);
        return ResponseEntity.ok(ApiResponse.success("All notifications marked as read", null));
    }

    private User getLoggedInUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userDao.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }
}
