// src/main/java/com/hereandalways/controllers/AuthController.java
package com.hereandalways.controllers;

import com.hereandalways.exceptions.InvalidCredentialsException;
import com.hereandalways.payload.request.UserLoginRequest;
import com.hereandalways.payload.request.UserRequest;
import com.hereandalways.payload.response.AuthResponse;
import com.hereandalways.services.AuthService;

import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);
    private final AuthService authService;

    @PostMapping("/signup")
    public ResponseEntity<?> register(@RequestBody UserRequest request) {
        try {
            AuthResponse response = authService.register(request);
            return ResponseEntity.ok(response);
        } catch (Exception ex) {
            logger.error("Registration error for email: {}", request.getEmail(), ex);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of(
                        "error", "RegistrationError",
                        "message", ex.getMessage()
                    ));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody UserLoginRequest request) {
        try {
            AuthResponse response = authService.login(request);
            logger.info("Successful login for email: {}", request.getEmail());
            return ResponseEntity.ok(response);
        } catch (InvalidCredentialsException ex) {
            logger.warn("Invalid login attempt for email: {}", request.getEmail());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new HashMap<>() {{
                        put("status", "error");
                        put("error", "InvalidCredentials");
                        put("message", "Invalid email or password");
                    }});
        } catch (Exception ex) {
            logger.error("Login error for email: {}", request.getEmail(), ex);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new HashMap<>() {{
                        put("status", "error");
                        put("error", "InternalError");
                        put("message", "An unexpected error occurred");
                    }});
        }
    }
}