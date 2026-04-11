package com.courseplatform.service;

import com.courseplatform.entity.*;
import com.courseplatform.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class CourseRequestService {

    @Autowired CourseRequestRepository requestRepo;
    @Autowired CourseRepository courseRepo;
    @Autowired UserRepository userRepo;
    @Autowired EnrollmentRepository enrollmentRepo;
    @Autowired NotificationService notificationService;

    public void sendRequest(String userEmail, Long courseId) {
        User user = userRepo.findByEmail(userEmail)
            .orElseThrow(() -> new RuntimeException("User not found"));
        Course course = courseRepo.findById(courseId)
            .orElseThrow(() -> new RuntimeException("Course not found"));

        if (requestRepo.findByUserIdAndCourseId(user.getId(), courseId).isPresent())
            throw new RuntimeException("Request already sent");

        CourseRequest req = new CourseRequest();

        req.setUser(user);
        req.setCourse(course);
        req.setStatus(CourseRequest.RequestStatus.PENDING);
        requestRepo.save(req);

        notificationService.send(user, course.getTrainer(),
            Notification.NotificationType.REQUEST_SENT,
            user.getUsername() + " wants to enroll in your course: " + course.getTitle());

        notificationService.send(course.getTrainer(), user,
            Notification.NotificationType.NEW_STUDENT,
            "New enrollment request from " + user.getUsername());
    }

    public void respondToRequest(Long requestId, String trainerEmail, boolean accept) {
        CourseRequest req = requestRepo.findById(requestId)
            .orElseThrow(() -> new RuntimeException("Request not found"));

        if (!req.getCourse().getTrainer().getEmail().equals(trainerEmail))
            throw new RuntimeException("Not authorized");

        User trainer = req.getCourse().getTrainer();
        User student = req.getUser();

        if (accept) {
            req.setStatus(CourseRequest.RequestStatus.ACCEPTED);
            Enrollment enrollment = new Enrollment();
            enrollment.setUser(student);
            enrollment.setCourse(req.getCourse());
            enrollmentRepo.save(enrollment);

            String message = "Your request for '" + req.getCourse().getTitle() +
                "' was accepted! Trainer contact: " + trainer.getEmail() +
                (trainer.getPhone() != null ? ", Phone: " + trainer.getPhone() : "");
            notificationService.send(trainer, student,
                Notification.NotificationType.REQUEST_ACCEPTED, message);
        } else {
            req.setStatus(CourseRequest.RequestStatus.REJECTED);
            notificationService.send(trainer, student,
                Notification.NotificationType.REQUEST_REJECTED,
                "Your request for '" + req.getCourse().getTitle() + "' was declined.");
        }
        requestRepo.save(req);
    }

    public java.util.List<CourseRequest> getRequestsForTrainer(String trainerEmail) {
        User trainer = userRepo.findByEmail(trainerEmail)
            .orElseThrow(() -> new RuntimeException("Trainer not found"));
        return requestRepo.findByCourse_TrainerId(trainer.getId());
    }
}