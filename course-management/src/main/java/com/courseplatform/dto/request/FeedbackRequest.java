package com.courseplatform.dto.request;
import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class FeedbackRequest {
    @NotNull private Long courseId;
    @Min(1) @Max(5) private Integer rating;
    @NotBlank private String comment;
	public Long getCourseId() {
		return courseId;
	}
	public void setCourseId(Long courseId) {
		this.courseId = courseId;
	}
	public Integer getRating() {
		return rating;
	}
	public void setRating(Integer rating) {
		this.rating = rating;
	}
	public String getComment() {
		return comment;
	}
	public void setComment(String comment) {
		this.comment = comment;
	}
	public FeedbackRequest() {
		super();
		// TODO Auto-generated constructor stub
	}
    
    
}