package com.courseplatform.service;

import com.courseplatform.repository.*;
import com.courseplatform.entity.Role;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.HashMap;
import java.util.Map;

@Service
public class AdminService {

    @Autowired UserRepository userRepo;
    @Autowired CourseRepository courseRepo;
    @Autowired FeedbackRepository feedbackRepo;
    @Autowired EnrollmentRepository enrollmentRepo;

    public Map<String, Long> getDashboardStats() {
        Map<String, Long> stats = new HashMap<>();
        stats.put("totalUsers", userRepo.countByRoles_Name(Role.ERole.ROLE_USER));
        stats.put("totalTrainers", userRepo.countByRoles_Name(Role.ERole.ROLE_TRAINER));
        stats.put("totalCourses", courseRepo.count());
        stats.put("totalEnrollments", enrollmentRepo.count());
        stats.put("totalFeedback", feedbackRepo.count());
        return stats;
    }
}