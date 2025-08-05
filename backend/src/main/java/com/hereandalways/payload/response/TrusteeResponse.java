package com.hereandalways.payload.response;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import com.hereandalways.models.enums.VaultCategory;

@Data
@AllArgsConstructor
public class TrusteeResponse {
    private UUID trusteeId;
    private String trusteeName;
    private String trusteeEmail;
    private String status;
    private LocalDateTime invitedAt;

    private List<MessageSummary> messages;
    private List<AssetSummary> assets;
    private List<CredentialSummary> credentials;

    @Data
    @AllArgsConstructor
    public static class MessageSummary {
        private UUID id;
        private String subject;
    }

    @Data
    @AllArgsConstructor
    public static class AssetSummary {
        private UUID id;
        private String name;
    }

      @Data
    @AllArgsConstructor
    public static class CredentialSummary {
        private UUID id;
        private String title;
        private VaultCategory category;
    }
}