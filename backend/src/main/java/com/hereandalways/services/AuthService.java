package com.hereandalways.services;

import com.hereandalways.exceptions.InvalidCredentialsException;
import com.hereandalways.models.User;
import com.hereandalways.models.enums.UserRole;
import com.hereandalways.payload.request.UserRequest;
import com.hereandalways.payload.request.UserLoginRequest;
import com.hereandalways.payload.response.AuthResponse;
import com.hereandalways.repositories.UserRepository;
import com.hereandalways.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    @Transactional
    public AuthResponse register(UserRequest request) {
        log.info("Attempting to register user with email: {}", request.getEmail());
        
        if (userRepository.existsByEmail(request.getEmail())) {
            log.warn("Registration failed - email already exists: {}", request.getEmail());
            throw new RuntimeException("Email already in use");
        }

        try {
            User user = User.builder()
                    .name(request.getName())
                    .email(request.getEmail())
                    .passwordHash(passwordEncoder.encode(request.getPassword()))
                    .role(UserRole.LEGACY_OWNER)
                    .externalTrustee(false)
                    .build();

            User saved = userRepository.save(user);
            log.info("User registered successfully with ID: {}", saved.getId());

            String token = jwtUtil.generateToken(
                    saved.getId(),
                    saved.getEmail(),
                    saved.getName(),
                    saved.getRole().name()
            );

            return new AuthResponse(
                    token,
                    saved.getId(),
                    saved.getName(),
                    saved.getEmail(),
                    saved.getRole().name()
            );
        } catch (Exception e) {
            log.error("Registration failed for email: {}", request.getEmail(), e);
            throw new RuntimeException("Registration failed: " + e.getMessage());
        }
    }

    public AuthResponse login(UserLoginRequest request) {
        log.info("Attempting login for email: {}", request.getEmail());
        
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> {
                    log.warn("Login failed - email not found: {}", request.getEmail());
                    return new InvalidCredentialsException("Invalid email or password");
                });

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            log.warn("Login failed - invalid password for email: {}", request.getEmail());
            throw new InvalidCredentialsException("Invalid email or password");
        }

        String token = jwtUtil.generateToken(
                user.getId(),
                user.getEmail(),
                user.getName(),
                user.getRole().name()
        );

        log.info("Login successful for user ID: {}", user.getId());
        return new AuthResponse(
                token,
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole().name()
        );
    }
}