package com.hereandalways.payload.response;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import com.hereandalways.models.enums.VaultCategory;
import lombok.Builder;
import lombok.Data;

// CredentialResponse.java
@Data
@Builder
public class CredentialResponse {
    private UUID id;
    private String title;
    private String usernameOrCardNumber;
    private VaultCategory category;
    private String notes;
    private LocalDateTime createdAt;
    private List<UUID> trusteeIds;
    private String passwordOrPin;  
    private String encryptedKey;
    
    // Add this to include trustee names
    private List<TrusteeSummary> trustees;
    
    @Data
    @Builder
    public static class TrusteeSummary {
        private UUID id;
        private String name;
        private String email;
    }
}
