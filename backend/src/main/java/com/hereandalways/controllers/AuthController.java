package com.hereandalways.controllers;

import com.hereandalways.exceptions.InvalidCredentialsException;
import com.hereandalways.payload.request.UserLoginRequest;
import com.hereandalways.payload.request.UserRequest;
import com.hereandalways.payload.response.AuthResponse;
import com.hereandalways.services.AuthService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import java.time.LocalDateTime;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/signup")
    public ResponseEntity<?> register(@Valid @RequestBody UserRequest request) {
        try {
            AuthResponse response = authService.register(request);
            log.info("Registration successful for email: {}", request.getEmail());
            return ResponseEntity.ok(response);
        } catch (Exception ex) {
            log.error("Registration failed for email: {}", request.getEmail(), ex);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of(
                        "status", "error",
                        "error", "RegistrationError",
                        "message", ex.getMessage(),
                        "timestamp", LocalDateTime.now()
                    ));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody UserLoginRequest request) {
        try {
            AuthResponse response = authService.login(request);
            log.info("Login successful for email: {}", request.getEmail());
            return ResponseEntity.ok(response);
        } catch (InvalidCredentialsException ex) {
            log.warn("Invalid login attempt for email: {}", request.getEmail());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of(
                        "status", "error",
                        "error", "InvalidCredentials",
                        "message", "Invalid email or password",
                        "timestamp", LocalDateTime.now()
                    ));
        } catch (Exception ex) {
            log.error("Login error for email: {}", request.getEmail(), ex);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of(
                        "status", "error",
                        "error", "InternalError",
                        "message", "An unexpected error occurred",
                        "timestamp", LocalDateTime.now()
                    ));
        }
    }
}