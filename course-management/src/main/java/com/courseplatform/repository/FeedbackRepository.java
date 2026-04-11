package com.courseplatform.repository;
import com.courseplatform.entity.Feedback;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface FeedbackRepository extends JpaRepository<Feedback, Long> {
    List<Feedback> findByCourseId(Long courseId);
    List<Feedback> findByUserId(Long userId);
    boolean existsByUserIdAndCourseId(Long userId, Long courseId);
}