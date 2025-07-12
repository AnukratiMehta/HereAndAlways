package com.hereandalways.payload.response;

import com.hereandalways.models.DigitalAsset;
import com.hereandalways.models.Message;
import com.hereandalways.models.User;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Data
@Builder
public class DigitalAssetResponse {
    private UUID id;
    private String name;
    private String description;
    private String assetType;
    private String downloadUrl;
    private String encryptedKey;
    private Long fileSize;
    private String mimeType;
    private LocalDateTime createdAt;

    private UUID legacyOwnerId;

    private List<TrusteeSummary> linkedTrustees;
    private List<LinkedMessageSummary> linkedMessages;

    @Data
    @Builder
    public static class TrusteeSummary {
        private UUID id;
        private String name;
    }

    @Data
    @Builder
    public static class LinkedMessageSummary {
        private UUID id;
        private String title;
    }

    public static DigitalAssetResponse fromEntity(DigitalAsset asset) {
        return DigitalAssetResponse.builder()
            .id(asset.getId())
            .name(asset.getName())
            .description(asset.getDescription())
            .assetType(asset.getAssetType().name())
            .downloadUrl(asset.getDownloadUrl())
            .encryptedKey(asset.getEncryptedKey())
            .fileSize(asset.getFileSize())
            .mimeType(asset.getMimeType())
            .createdAt(asset.getCreatedAt())
            .legacyOwnerId(asset.getLegacyOwner() != null ? asset.getLegacyOwner().getId() : null)
            .linkedTrustees(
                asset.getTrustees() != null
                    ? asset.getTrustees().stream()
                        .map(t -> TrusteeSummary.builder()
                            .id(t.getId())
                            .name(t.getName())
                            .build())
                        .collect(Collectors.toList())
                    : null
            )
            .linkedMessages(
                asset.getLinkedMessages() != null
                    ? asset.getLinkedMessages().stream()
                        .map(m -> LinkedMessageSummary.builder()
                            .id(m.getId())
                            .title(org.hibernate.Hibernate.isInitialized(m) ? m.getSubject() : null)
                            .build())
                        .collect(Collectors.toList())
                    : null
            )
            .build();
    }
}
