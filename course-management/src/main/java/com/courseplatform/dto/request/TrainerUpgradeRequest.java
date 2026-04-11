package com.courseplatform.dto.request;
import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class TrainerUpgradeRequest {
    @NotBlank private String skills;
    @NotBlank private String category;
    @Min(0) private Integer experience;
}