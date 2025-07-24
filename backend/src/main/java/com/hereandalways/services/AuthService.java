// src/main/java/com/hereandalways/services/AuthService.java
package com.hereandalways.services;

import com.hereandalways.models.User;
import com.hereandalways.models.enums.UserRole;
import com.hereandalways.payload.request.UserRequest;
import com.hereandalways.payload.request.UserLoginRequest;
import com.hereandalways.payload.response.AuthResponse;
import com.hereandalways.payload.response.UserResponse;
import com.hereandalways.repositories.UserRepository;
import com.hereandalways.security.JwtUtil;

import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthResponse register(UserRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already in use");
        }

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .role(request.getRole() != null ? request.getRole() : UserRole.LEGACY_OWNER)
                .externalTrustee(false)
                .build();

        User saved = userRepository.save(user);
        String token = jwtUtil.generateToken(saved.getId(), saved.getEmail());
        return new AuthResponse(token);
    }

    public AuthResponse login(UserLoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid credentials"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new RuntimeException("Invalid credentials");
        }

        String token = jwtUtil.generateToken(user.getId(), user.getEmail());
        return new AuthResponse(token);
    }
}
