package com.hereandalways.payload.response;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Data
@AllArgsConstructor
public class MessageResponse {
    private UUID id;
    private String subject;
    private String body;
    private String deliveryStatus;
    private LocalDateTime scheduledDelivery;
    private LocalDateTime createdAt;
    private List<String> trusteeNames;  
    private List<UUID> trusteeIds;
    private List<UUID> assetIds; // Add this line
}