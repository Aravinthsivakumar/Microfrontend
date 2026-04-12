package com.courseplatform.repository;
import com.courseplatform.entity.CourseRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface CourseRequestRepository extends JpaRepository<CourseRequest, Long> {
    List<CourseRequest> findByUserId(Long userId);
    List<CourseRequest> findByCourse_TrainerId(Long trainerId);
    Optional<CourseRequest> findByUserIdAndCourseId(Long userId, Long courseId);
}