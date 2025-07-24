package com.hereandalways.payload.response;

import com.hereandalways.models.enums.UserRole;
import lombok.Data;

import java.util.UUID;

@Data
public class AuthResponse {
    private String token;
    private UUID userId;
    private String name;
    private String email;
    private UserRole role;
}
