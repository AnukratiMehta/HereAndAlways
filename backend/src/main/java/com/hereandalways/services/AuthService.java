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
    }

    public AuthResponse login(UserLoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new InvalidCredentialsException("Invalid email or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new InvalidCredentialsException("Invalid email or password");
        }

        String token = jwtUtil.generateToken(
                user.getId(),
                user.getEmail(),
                user.getName(),
                user.getRole().name()
        );

        return new AuthResponse(
                token,
                user.getId(),     
                user.getName(),
                user.getEmail(),
                user.getRole().name()
        );
    }
}