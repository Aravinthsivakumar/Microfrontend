package com.courseplatform.controller;

import com.courseplatform.dto.request.CourseRequestDto;
import com.courseplatform.dto.response.CourseResponse;
import com.courseplatform.entity.CourseRequest;
import com.courseplatform.service.*;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/trainer")
public class TrainerController {

    @Autowired CourseService courseService;
    @Autowired CourseRequestService requestService;
    @Autowired UserService userService;

    @PostMapping("/courses")
    public ResponseEntity<CourseResponse> createCourse(
            @AuthenticationPrincipal UserDetails ud,
            @Valid @RequestBody CourseRequestDto dto) {
        return ResponseEntity.ok(courseService.createCourse(ud.getUsername(), dto));
    }

    @PutMapping("/courses/{id}")
    public ResponseEntity<CourseResponse> updateCourse(
            @AuthenticationPrincipal UserDetails ud,
            @PathVariable Long id,
            @Valid @RequestBody CourseRequestDto dto) {
        return ResponseEntity.ok(courseService.updateCourse(id, ud.getUsername(), dto));
    }

    @GetMapping("/courses")
    public ResponseEntity<List<CourseResponse>> getMyCourses(
            @AuthenticationPrincipal UserDetails ud) {
        return ResponseEntity.ok(courseService.getTrainerCourses(ud.getUsername()));
    }

    @GetMapping("/requests")
    public ResponseEntity<List<CourseRequest>> getRequests(
            @AuthenticationPrincipal UserDetails ud) {
        return ResponseEntity.ok(requestService.getRequestsForTrainer(ud.getUsername()));
    }

    @PutMapping("/requests/{id}/respond")
    public ResponseEntity<?> respond(
            @AuthenticationPrincipal UserDetails ud,
            @PathVariable Long id,
            @RequestBody Map<String, Boolean> body) {
        requestService.respondToRequest(id, ud.getUsername(), body.get("accept"));
        return ResponseEntity.ok(Map.of("message", "Response recorded"));
    }

    @GetMapping("/students")
    public ResponseEntity<?> getStudents(@AuthenticationPrincipal UserDetails ud) {
        Long trainerId = userService.getUserByEmail(ud.getUsername()).getId();
        return ResponseEntity.ok(Map.of("trainerId", trainerId));
    }
}