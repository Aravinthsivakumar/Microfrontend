package com.courseplatform.service;

import com.courseplatform.dto.request.TrainerUpgradeRequest;
import com.courseplatform.entity.*;
import com.courseplatform.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.*;
import java.nio.file.*;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class TrainerUpgradeService {

    @Autowired TrainerProfileRepository profileRepo;
    @Autowired UserRepository userRepo;
    @Autowired RoleRepository roleRepo;
    @Autowired NotificationService notificationService;

    @Value("${app.upload.dir}")
    private String uploadDir;

    public void submitUpgradeRequest(String email, TrainerUpgradeRequest req,
                                     MultipartFile certificate) throws IOException {
        User user = userRepo.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found"));

        Optional<TrainerProfile> existing = profileRepo.findByUserId(user.getId());
        if (existing.isPresent()) {
            TrainerProfile p = existing.get();
            if (p.getApprovalStatus() == TrainerProfile.ApprovalStatus.REJECTED) {
                if (p.getLastAppliedAt() != null &&
                    p.getLastAppliedAt().isAfter(LocalDateTime.now().minusHours(24))) {
                    throw new RuntimeException("Please wait 24 hours before reapplying");
                }
            }
        }

        String certPath = null;
        if (certificate != null && !certificate.isEmpty()) {
            Files.createDirectories(Paths.get(uploadDir));
            String filename = System.currentTimeMillis() + "_" + certificate.getOriginalFilename();
            Path dest = Paths.get(uploadDir, filename);
            Files.copy(certificate.getInputStream(), dest, StandardCopyOption.REPLACE_EXISTING);
            certPath = "/uploads/certificates/" + filename;
        }

        TrainerProfile profile = existing.orElse(new TrainerProfile());
        profile.setUser(user);
        profile.setSkills(req.getSkills());
        profile.setCategory(req.getCategory());
        profile.setExperience(req.getExperience());
        profile.setCertificatePath(certPath);
        profile.setApprovalStatus(TrainerProfile.ApprovalStatus.PENDING);
        profile.setLastAppliedAt(LocalDateTime.now());
        profileRepo.save(profile);

        User admin = userRepo.findByEmail("admin@platform.com")
            .orElseThrow(() -> new RuntimeException("Admin not found"));
        notificationService.send(user, admin,
            Notification.NotificationType.UPGRADE_SUBMITTED,
            user.getUsername() + " has submitted a trainer upgrade request.");
    }

    public void processUpgradeRequest(Long profileId, boolean approve, String reason) {
        TrainerProfile profile = profileRepo.findById(profileId)
            .orElseThrow(() -> new RuntimeException("Profile not found"));

        User user = profile.getUser();
        User admin = userRepo.findByEmail("admin@platform.com").orElseThrow();

        if (approve) {
            profile.setApprovalStatus(TrainerProfile.ApprovalStatus.APPROVED);
            Role trainerRole = roleRepo.findByName(Role.ERole.ROLE_TRAINER)
                .orElseThrow(() -> new RuntimeException("Trainer role not found"));
            user.getRoles().add(trainerRole);
            userRepo.save(user);

            notificationService.send(admin, user,
                Notification.NotificationType.UPGRADE_APPROVED,
                "Congratulations! Your trainer upgrade request has been approved.");
        } else {
            profile.setApprovalStatus(TrainerProfile.ApprovalStatus.REJECTED);
            profile.setRejectionReason(reason);
            notificationService.send(admin, user,
                Notification.NotificationType.UPGRADE_REJECTED,
                "Your trainer upgrade request was rejected. Reason: " + reason);
        }
        profileRepo.save(profile);
    }

    public List<TrainerProfile> getPendingRequests() {
        return profileRepo.findByApprovalStatus(TrainerProfile.ApprovalStatus.PENDING);
    }
}