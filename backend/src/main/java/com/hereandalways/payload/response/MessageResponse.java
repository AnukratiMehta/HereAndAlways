package com.hereandalways.payload.response;

import com.hereandalways.models.enums.DeliveryStatus;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@AllArgsConstructor
public class MessageResponse {
    private UUID id;
    private String subject;
    private String body;
    private DeliveryStatus deliveryStatus;
    private LocalDateTime createdAt;
    private LocalDateTime scheduledDelivery;
    private UUID trusteeId;
}
