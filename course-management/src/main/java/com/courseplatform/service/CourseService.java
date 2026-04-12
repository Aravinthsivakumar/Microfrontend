package com.courseplatform.service;

import com.courseplatform.dto.request.CourseRequestDto;
import com.courseplatform.dto.response.CourseResponse;
import com.courseplatform.entity.*;
import com.courseplatform.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CourseService {

    @Autowired CourseRepository courseRepo;
    @Autowired UserRepository userRepo;

    public CourseResponse createCourse(String trainerEmail, CourseRequestDto dto) {
        User trainer = userRepo.findByEmail(trainerEmail)
            .orElseThrow(() -> new RuntimeException("Trainer not found"));

        Course course = new Course();

        course.setTrainer(trainer);
        course.setTitle(dto.getTitle());
        course.setDescription(dto.getDescription());
        course.setCategory(dto.getCategory());
        course.setSkill(dto.getSkill());
        course.setDuration(dto.getDuration());
        course.setTiming(dto.getTiming());
        course.setTopics(dto.getTopics());
        course.setLocation(dto.getLocation());
        course.setPrice(dto.getPrice());
        return toResponse(courseRepo.save(course));
    }

    public CourseResponse updateCourse(Long courseId, String trainerEmail, CourseRequestDto dto) {
        Course course = courseRepo.findById(courseId)
            .orElseThrow(() -> new RuntimeException("Course not found"));
        if (!course.getTrainer().getEmail().equals(trainerEmail))
            throw new RuntimeException("Not authorized");

        course.setTitle(dto.getTitle());
        course.setDescription(dto.getDescription());
        course.setDuration(dto.getDuration());
        course.setTiming(dto.getTiming());
        course.setTopics(dto.getTopics());
        course.setLocation(dto.getLocation());
        course.setPrice(dto.getPrice());
        return toResponse(courseRepo.save(course));
    }

    public List<CourseResponse> searchCourses(String keyword) {
        List<Course> courses = (keyword == null || keyword.isBlank())
            ? courseRepo.findByActiveTrue()
            : courseRepo.searchByKeyword(keyword);
        return courses.stream().map(this::toResponse).collect(Collectors.toList());
    }

    public List<CourseResponse> getTrainerCourses(String trainerEmail) {
        User trainer = userRepo.findByEmail(trainerEmail)
            .orElseThrow(() -> new RuntimeException("Trainer not found"));
        return courseRepo.findByTrainerId(trainer.getId())
            .stream().map(this::toResponse).collect(Collectors.toList());
    }

    public CourseResponse getCourseById(Long id) {
        return toResponse(courseRepo.findById(id)
            .orElseThrow(() -> new RuntimeException("Course not found")));
    }

 
    	private CourseResponse toResponse(Course c) {
    	    CourseResponse res = new CourseResponse();

    	    res.setId(c.getId());
    	    res.setTitle(c.getTitle());
    	    res.setDescription(c.getDescription());
    	    res.setCategory(c.getCategory());
    	    res.setSkill(c.getSkill());
    	    res.setDuration(c.getDuration());
    	    res.setTiming(c.getTiming());
    	    res.setTopics(c.getTopics());
    	    res.setLocation(c.getLocation());
    	    res.setPrice(c.getPrice());
    	    res.setTrainerName(c.getTrainer().getUsername());
    	    res.setTrainerId(c.getTrainer().getId());
    	    res.setCreatedAt(c.getCreatedAt());

    	    return res;
    	}
}