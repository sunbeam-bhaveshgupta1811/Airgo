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

}
