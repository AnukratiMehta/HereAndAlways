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

    /**
     * Create a new message (save as draft or queue to send)
     */
    @PostMapping("/{ownerId}")
    public ResponseEntity<MessageResponse> createMessage(
            @PathVariable UUID ownerId,
            @RequestBody MessageRequest request
    ) {
        // default status
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

        MessageResponse response = new MessageResponse(
                message.getId(),
                message.getSubject(),
                message.getBody(),
                message.getDeliveryStatus().name(),
                message.getScheduledDelivery(),
                message.getCreatedAt()
        );

        return ResponseEntity.ok(response);
    }

    /**
     * Get all messages for a legacy owner
     */
    @GetMapping("/{ownerId}")
    public ResponseEntity<List<MessageResponse>> getMessages(@PathVariable UUID ownerId) {
        List<MessageResponse> responses = messageService.getMessagesForOwner(ownerId)
                .stream()
                .map(msg -> new MessageResponse(
                        msg.getId(),
                        msg.getSubject(),
                        msg.getBody(),
                        msg.getDeliveryStatus().name(),
                        msg.getScheduledDelivery(),
                        msg.getCreatedAt()
                ))
                .collect(Collectors.toList());

        return ResponseEntity.ok(responses);
    }

    /**
     * Delete a message
     */
    @DeleteMapping("/{messageId}")
    public ResponseEntity<Void> deleteMessage(@PathVariable UUID messageId) {
        messageService.deleteMessage(messageId);
        return ResponseEntity.noContent().build();
    }

    /**
     * Update the status of a message
     */
    @PatchMapping("/{messageId}/status")
    public ResponseEntity<MessageResponse> updateStatus(
            @PathVariable UUID messageId,
            @RequestParam String status
    ) {
        Message updated = messageService.updateStatus(messageId, DeliveryStatus.valueOf(status));
        MessageResponse response = new MessageResponse(
                updated.getId(),
                updated.getSubject(),
                updated.getBody(),
                updated.getDeliveryStatus().name(),
                updated.getScheduledDelivery(),
                updated.getCreatedAt()
        );

        return ResponseEntity.ok(response);
    }
}
