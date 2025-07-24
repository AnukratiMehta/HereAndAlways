package com.hereandalways.controllers;

import com.hereandalways.payload.request.LoginRequest;
import com.hereandalways.payload.request.UserRequest;
import com.hereandalways.payload.response.AuthResponse;
import com.hereandalways.services.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
public ResponseEntity<AuthResponse> register(@Valid @RequestBody UserRequest request) {
    try {
        return ResponseEntity.ok(authService.register(request));
    } catch (Exception e) {
        return ResponseEntity.badRequest().build();
    }
}

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }
}
