package com.hereandalways.controllers;

import com.hereandalways.models.DigitalAsset;
import com.hereandalways.models.Message;
import com.hereandalways.models.User;
import com.hereandalways.models.enums.DeliveryStatus;
import com.hereandalways.payload.request.MessageRequest;
import com.hereandalways.payload.request.UpdateMessageRequest;
import com.hereandalways.payload.response.MessageResponse;
import com.hereandalways.services.MessageService;
import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import lombok.extern.slf4j.Slf4j;


import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;


@Slf4j
@RestController
@RequestMapping("/api/messages")
@RequiredArgsConstructor
public class MessageController {

    private final MessageService messageService;

    @PostMapping("/{ownerId}")
    public ResponseEntity<MessageResponse> createMessage(
            @PathVariable UUID ownerId,
            @RequestBody MessageRequest request
    ) {
        DeliveryStatus status = request.getDeliveryStatus() != null
                ? DeliveryStatus.valueOf(request.getDeliveryStatus())
                : DeliveryStatus.DRAFT;

        Message message = messageService.createMessage(
                ownerId,
                request.getSubject(),
                request.getBody(),
                request.getScheduledDelivery(),
                request.getTrusteeIds(),  
                status
        );

        return ResponseEntity.ok(toResponse(message));
    }

    @GetMapping("/{ownerId}")
    public ResponseEntity<List<MessageResponse>> getMessages(@PathVariable UUID ownerId) {
        List<MessageResponse> responses = messageService.getMessagesForOwner(ownerId)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());

        return ResponseEntity.ok(responses);
    }

    @GetMapping("/{ownerId}/recent")
    public ResponseEntity<List<MessageResponse>> getRecentMessages(@PathVariable UUID ownerId) {
        List<MessageResponse> responses = messageService.getRecentMessages(ownerId)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());

        return ResponseEntity.ok(responses);
    }

    @DeleteMapping("/{messageId}")
    public ResponseEntity<Void> deleteMessage(@PathVariable UUID messageId) {
        messageService.deleteMessage(messageId);
        return ResponseEntity.noContent().build();
    }

@PatchMapping("/{messageId}")
public ResponseEntity<MessageResponse> updateMessage(
        @PathVariable UUID messageId,
        @RequestBody UpdateMessageRequest request
) {
    log.info(" Received PATCH request for message {} with data: {}", messageId, request);
    
    try {
        DeliveryStatus status = null;
        if (request.getDeliveryStatus() != null) {
            try {
                status = DeliveryStatus.valueOf(request.getDeliveryStatus().toUpperCase());
                log.debug("Converted deliveryStatus '{}' to enum {}", request.getDeliveryStatus(), status);
            } catch (IllegalArgumentException e) {
                log.error("Invalid delivery status value: {}", request.getDeliveryStatus());
                throw new IllegalArgumentException("Invalid delivery status: " + request.getDeliveryStatus());
            }
        }

        log.info("🔄 Calling service to update message {}", messageId);
        Message updated = messageService.updateMessage(
                messageId,
                request.getSubject(),
                request.getBody(),
                request.getScheduledDelivery(),
                request.getTrusteeIds(),
                request.getAssetIds(),
                status
        );

        if (status != null && !updated.getDeliveryStatus().equals(status)) {
            log.error("Status mismatch! Requested: {}, Actual: {}", status, updated.getDeliveryStatus());
            throw new IllegalStateException("Status update failed");
        }

        log.info("Successfully updated message {}", messageId);
        return ResponseEntity.ok(toResponse(updated));
    } catch (Exception e) {
        log.error("Failed to update message {}: {}", messageId, e.getMessage());
        throw e;
    }
}

    /**
     * Converts a Message entity to the DTO
     */
  private MessageResponse toResponse(Message message) {
    List<String> trusteeNames = List.of();
    List<UUID> trusteeIds = List.of();
    List<UUID> assetIds = List.of();

    if (message.getTrustees() != null && !message.getTrustees().isEmpty()) {
        trusteeNames = message.getTrustees().stream()
                .filter(java.util.Objects::nonNull)
                .map(User::getName)
                .toList();
        trusteeIds = message.getTrustees().stream()
                .filter(java.util.Objects::nonNull)
                .map(User::getId)
                .toList();
    }

    if (message.getLinkedAssets() != null && !message.getLinkedAssets().isEmpty()) {
        assetIds = message.getLinkedAssets().stream()
                .filter(java.util.Objects::nonNull)
                .map(DigitalAsset::getId)
                .toList();
    }

    return new MessageResponse(
            message.getId(),
            message.getSubject(),
            message.getBody(),
            message.getDeliveryStatus().name(),
            message.getScheduledDelivery(),
            message.getCreatedAt(),
            trusteeNames,
            trusteeIds,
            assetIds 
    );
}

}
