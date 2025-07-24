// src/main/java/com/hereandalways/payload/response/AuthResponse.java
package com.hereandalways.payload.response;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AuthResponse {
    private String token;
}
