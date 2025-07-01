package com.hereandalways.controllers;

import com.hereandalways.models.Message;
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
        Message message = messageService.createMessage(ownerId, request);

        MessageResponse response = new MessageResponse(
                message.getId(),
                message.getSubject(),
                message.getBody(),
                message.getDeliveryStatus(),
                message.getCreatedAt(),
                message.getScheduledDelivery(),
                message.getTrustee() != null ? message.getTrustee().getId() : null
        );

        return ResponseEntity.ok(response);
    }

    @GetMapping("/{ownerId}")
    public ResponseEntity<List<MessageResponse>> getMessages(
            @PathVariable UUID ownerId
    ) {
        List<MessageResponse> responses = messageService.getMessagesForOwner(ownerId)
                .stream()
                .map(msg -> new MessageResponse(
                        msg.getId(),
                        msg.getSubject(),
                        msg.getBody(),
                        msg.getDeliveryStatus(),
                        msg.getCreatedAt(),
                        msg.getScheduledDelivery(),
                        msg.getTrustee() != null ? msg.getTrustee().getId() : null
                ))
                .collect(Collectors.toList());

        return ResponseEntity.ok(responses);
    }
}
