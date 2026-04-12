package com.courseplatform.service;

import com.courseplatform.dto.request.FeedbackRequest;
import com.courseplatform.entity.*;
import com.courseplatform.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class FeedbackService {

    @Autowired FeedbackRepository feedbackRepo;
    @Autowired EnrollmentRepository enrollmentRepo;
    @Autowired UserRepository userRepo;
    @Autowired CourseRepository courseRepo;

    public Feedback submitFeedback(String email, FeedbackRequest req) {
        User user = userRepo.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found"));
        if (!enrollmentRepo.existsByUserIdAndCourseId(user.getId(), req.getCourseId()))
            throw new RuntimeException("You are not enrolled in this course");

        Course course = courseRepo.findById(req.getCourseId())
            .orElseThrow(() -> new RuntimeException("Course not found"));

        Feedback fb = new Feedback();

        fb.setUser(user);
        fb.setCourse(course);
        fb.setRating(req.getRating());
        fb.setComment(req.getComment());
        return feedbackRepo.save(fb);
    }

    public List<Feedback> getAllFeedback() { return feedbackRepo.findAll(); }

    public void deleteFeedback(Long id) { feedbackRepo.deleteById(id); }
}