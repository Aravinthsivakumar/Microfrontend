package com.courseplatform.service;

import com.courseplatform.dto.request.*;
import com.courseplatform.dto.response.AuthResponse;
import com.courseplatform.entity.*;
import com.courseplatform.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.courseplatform.security.JwtUtils;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class AuthService {

    @Autowired UserRepository userRepo;
    @Autowired RoleRepository roleRepo;
    @Autowired PasswordEncoder encoder;
    @Autowired AuthenticationManager authManager;
    @Autowired JwtUtils jwtUtils;

    public AuthResponse register(RegisterRequest req) {
        if (userRepo.existsByEmail(req.getEmail()))
            throw new RuntimeException("Email already in use");

        User user = new User();
        user.setUsername(req.getUsername());
        user.setEmail(req.getEmail());
        user.setPassword(encoder.encode(req.getPassword()));

        Role userRole = roleRepo.findByName(Role.ERole.ROLE_USER)
            .orElseThrow(() -> new RuntimeException("Role not found"));
        user.setRoles(Set.of(userRole));
        userRepo.save(user);

        Authentication auth = authManager.authenticate(
            new UsernamePasswordAuthenticationToken(req.getEmail(), req.getPassword()));

        String token = jwtUtils.generateToken(auth);
        AuthResponse res = new AuthResponse();
        res.setToken(token);
        res.setEmail(user.getEmail());
        res.setUsername(user.getUsername());
        res.setUserId(user.getId());
        res.setRoles(List.of("ROLE_USER"));

        return res;
    }

    public AuthResponse login(LoginRequest req) {
        Authentication auth = authManager.authenticate(
            new UsernamePasswordAuthenticationToken(req.getEmail(), req.getPassword()));

        String token = jwtUtils.generateToken(auth);
        User user = userRepo.findByEmail(req.getEmail())
            .orElseThrow(() -> new RuntimeException("User not found"));

        List<String> roles = user.getRoles().stream()
            .map(r -> r.getName().name())
            .collect(Collectors.toList());

        AuthResponse res = new AuthResponse();
        res.setToken(token);
        res.setEmail(user.getEmail());
        res.setUsername(user.getUsername());
        res.setUserId(user.getId());
        res.setRoles(roles);

        return res;
    }
}