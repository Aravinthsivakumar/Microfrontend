package com.courseplatform.controller;

import com.courseplatform.dto.request.*;
import com.courseplatform.dto.response.*;
import com.courseplatform.entity.Enrollment;
import com.courseplatform.repository.EnrollmentRepository;
import com.courseplatform.service.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/user")
public class UserController {

    @Autowired UserService userService;
    @Autowired TrainerUpgradeService upgradeService;
    @Autowired CourseRequestService requestService;
    @Autowired FeedbackService feedbackService;
    @Autowired NotificationService notifService;
    @Autowired EnrollmentRepository enrollmentRepo;

    @GetMapping("/profile")
    public ResponseEntity<UserResponse> getProfile(@AuthenticationPrincipal UserDetails ud) {
        return ResponseEntity.ok(userService.getProfile(ud.getUsername()));
    }

    @PutMapping("/profile/username")
    public ResponseEntity<UserResponse> updateUsername(
            @AuthenticationPrincipal UserDetails ud,
            @RequestBody Map<String, String> body) {
        return ResponseEntity.ok(userService.updateUsername(ud.getUsername(), body.get("username")));
    }

    @PutMapping("/profile/phone")
    public ResponseEntity<UserResponse> updatePhone(
            @AuthenticationPrincipal UserDetails ud,
            @RequestBody Map<String, String> body) {
        return ResponseEntity.ok(userService.updatePhone(ud.getUsername(), body.get("phone")));
    }

    @PostMapping("/upgrade-request")
    public ResponseEntity<?> submitUpgrade(
            @AuthenticationPrincipal UserDetails ud,
            @RequestPart("data") TrainerUpgradeRequest req,
            @RequestPart(value = "certificate", required = false) MultipartFile file)
            throws IOException {
        upgradeService.submitUpgradeRequest(ud.getUsername(), req, file);
        return ResponseEntity.ok(Map.of("message", "Upgrade request submitted"));
    }

    @PostMapping("/course-request/{courseId}")
    public ResponseEntity<?> sendCourseRequest(
            @AuthenticationPrincipal UserDetails ud,
            @PathVariable Long courseId) {
        requestService.sendRequest(ud.getUsername(), courseId);
        return ResponseEntity.ok(Map.of("message", "Request sent"));
    }

    @PostMapping("/feedback")
    public ResponseEntity<?> submitFeedback(
            @AuthenticationPrincipal UserDetails ud,
            @RequestBody FeedbackRequest req) {
        return ResponseEntity.ok(feedbackService.submitFeedback(ud.getUsername(), req));
    }

    @GetMapping("/enrollments")
    public ResponseEntity<List<Enrollment>> getEnrollments(@AuthenticationPrincipal UserDetails ud) {
        Long userId = userService.getUserByEmail(ud.getUsername()).getId();
        return ResponseEntity.ok(enrollmentRepo.findByUserId(userId));
    }

    @GetMapping("/notifications")
    public ResponseEntity<List<NotificationResponse>> getNotifications(
            @AuthenticationPrincipal UserDetails ud) {
        Long userId = userService.getUserByEmail(ud.getUsername()).getId();
        return ResponseEntity.ok(notifService.getForUser(userId));
    }

    @GetMapping("/notifications/unread-count")
    public ResponseEntity<Map<String, Long>> getUnreadCount(
            @AuthenticationPrincipal UserDetails ud) {
        Long userId = userService.getUserByEmail(ud.getUsername()).getId();
        return ResponseEntity.ok(Map.of("count", notifService.getUnreadCount(userId)));
    }

    @PutMapping("/notifications/read-all")
    public ResponseEntity<?> markAllRead(@AuthenticationPrincipal UserDetails ud) {
        Long userId = userService.getUserByEmail(ud.getUsername()).getId();
        notifService.markAllRead(userId);
        return ResponseEntity.ok(Map.of("message", "Marked as read"));
    }
}