// TrainerProfileRepository.java
package com.courseplatform.repository;
import com.courseplatform.entity.TrainerProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface TrainerProfileRepository extends JpaRepository<TrainerProfile, Long> {
    Optional<TrainerProfile> findByUserId(Long userId);
    List<TrainerProfile> findByApprovalStatus(TrainerProfile.ApprovalStatus status);
}