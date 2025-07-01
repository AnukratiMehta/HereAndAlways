package com.hereandalways.payload.request;

import lombok.Data;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
public class MessageRequest {
    private String subject;
    private String body;
    private String deliveryStatus; // "DRAFT" or "QUEUED"
    private LocalDateTime scheduledDelivery;
    private UUID trusteeId;
}
