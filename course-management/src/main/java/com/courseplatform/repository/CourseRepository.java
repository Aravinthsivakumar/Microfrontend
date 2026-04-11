package com.courseplatform.repository;
import com.courseplatform.entity.Course;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;

public interface CourseRepository extends JpaRepository<Course, Long> {
    List<Course> findByTrainerId(Long trainerId);
    List<Course> findByActiveTrue();

    @Query("SELECT c FROM Course c WHERE c.active = true AND " +
           "(LOWER(c.skill) LIKE LOWER(CONCAT('%',:kw,'%')) OR " +
           "LOWER(c.category) LIKE LOWER(CONCAT('%',:kw,'%')) OR " +
           "LOWER(c.title) LIKE LOWER(CONCAT('%',:kw,'%')))")
    List<Course> searchByKeyword(String kw);
}