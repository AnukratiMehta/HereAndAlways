package com.hereandalways.payload.request;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Data
public class MessageRequest {
    private String subject;
    private String body;
    private LocalDateTime scheduledDelivery;
    private List<UUID> trusteeIds; 
    private String deliveryStatus;
}
