package com.hereandalways.payload.request;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Data
public class UpdateMessageRequest {
    private String subject;
    private String body;
    private LocalDateTime scheduledDelivery;
    private List<UUID> trusteeIds;
    private List<UUID> assetIds; 
    private String deliveryStatus;
}