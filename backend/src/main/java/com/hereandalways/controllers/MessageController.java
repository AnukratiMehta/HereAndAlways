package com.hereandalways.controllers;

import com.hereandalways.models.Message;
import com.hereandalways.models.enums.DeliveryStatus;
import com.hereandalways.payload.request.MessageRequest;
import com.hereandalways.payload.response.MessageResponse;
import com.hereandalways.services.MessageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

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
                request.getTrusteeId(),
                status
        );

        MessageResponse response = toResponse(message);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{ownerId}")
    public ResponseEntity<List<MessageResponse>> getMessages(@PathVariable UUID ownerId) {
        List<MessageResponse> responses = messageService.getMessagesForOwner(ownerId)
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

    @PatchMapping("/{messageId}/status")
    public ResponseEntity<MessageResponse> updateStatus(
            @PathVariable UUID messageId,
            @RequestParam String status
    ) {
        Message updated = messageService.updateStatus(messageId, DeliveryStatus.valueOf(status));
        MessageResponse response = toResponse(updated);
        return ResponseEntity.ok(response);
    }

    /**
     * Helper to convert entity to response DTO
     */
    private MessageResponse toResponse(Message message) {
        String trusteeName = null;
        UUID trusteeId = null;

        if (message.getTrustee() != null) {
            trusteeName = message.getTrustee().getName();
            trusteeId = message.getTrustee().getId();
        }

        return new MessageResponse(
                message.getId(),
                message.getSubject(),
                message.getBody(),
                message.getDeliveryStatus().name(),
                message.getScheduledDelivery(),
                message.getCreatedAt(),
                trusteeName,
                trusteeId
        );
    }
}
