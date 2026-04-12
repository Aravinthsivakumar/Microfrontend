package com.courseplatform.controller;

import com.courseplatform.entity.TrainerProfile;
import com.courseplatform.service.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired AdminService adminService;
    @Autowired TrainerUpgradeService upgradeService;
    @Autowired FeedbackService feedbackService;

    @GetMapping("/dashboard")
    public ResponseEntity<Map<String, Long>> getDashboard() {
        return ResponseEntity.ok(adminService.getDashboardStats());
    }

    @GetMapping("/trainer-requests")
    public ResponseEntity<List<TrainerProfile>> getPendingRequests() {
        return ResponseEntity.ok(upgradeService.getPendingRequests());
    }

    @PutMapping("/trainer-requests/{id}/approve")
    public ResponseEntity<?> approve(@PathVariable Long id) {
        upgradeService.processUpgradeRequest(id, true, null);
        return ResponseEntity.ok(Map.of("message", "Approved"));
    }

    @PutMapping("/trainer-requests/{id}/reject")
    public ResponseEntity<?> reject(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {
        upgradeService.processUpgradeRequest(id, false, body.get("reason"));
        return ResponseEntity.ok(Map.of("message", "Rejected"));
    }

    @GetMapping("/feedback")
    public ResponseEntity<?> getAllFeedback() {
        return ResponseEntity.ok(feedbackService.getAllFeedback());
    }

    @DeleteMapping("/feedback/{id}")
    public ResponseEntity<?> deleteFeedback(@PathVariable Long id) {
        feedbackService.deleteFeedback(id);
        return ResponseEntity.ok(Map.of("message", "Deleted"));
    }

    @GetMapping("/reports/users")
    public ResponseEntity<?> userReport() {
        return ResponseEntity.ok(adminService.getDashboardStats());
    }
}