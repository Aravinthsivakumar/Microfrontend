package com.courseplatform.service;

import com.courseplatform.dto.response.UserResponse;
import com.courseplatform.entity.*;
import com.courseplatform.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.stream.Collectors;

@Service
public class UserService {

    @Autowired UserRepository userRepo;

    public UserResponse getProfile(String email) {
        User user = userRepo.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found"));
        return toResponse(user);
    }

    public UserResponse updateUsername(String email, String newUsername) {
        User user = userRepo.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found"));
        user.setUsername(newUsername);
        return toResponse(userRepo.save(user));
    }

    public UserResponse updatePhone(String email, String phone) {
        User user = userRepo.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found"));
        user.setPhone(phone);
        return toResponse(userRepo.save(user));
    }

    private UserResponse toResponse(User u) {
        UserResponse res = new UserResponse();

        res.setId(u.getId());
        res.setUsername(u.getUsername());
        res.setEmail(u.getEmail());
        res.setPhone(u.getPhone());
        res.setRoles(
            u.getRoles().stream()
                .map(r -> r.getName().name())
                .collect(Collectors.toList())
        );

        return res;
    }

    public User getUserByEmail(String email) {
        return userRepo.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found"));
    }
}