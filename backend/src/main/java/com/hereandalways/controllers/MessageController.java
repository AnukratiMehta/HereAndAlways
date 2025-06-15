package com.hereandalways.controllers;

import com.hereandalways.models.Message;
import com.hereandalways.services.MessageService;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/messages")
@RequiredArgsConstructor
public class MessageController {

  private final MessageService messageService;

  @PostMapping("/draft")
  public ResponseEntity<Message> createDraft(
      @RequestParam UUID ownerId,
      @RequestParam(required = false) UUID trusteeId,
      @RequestParam String subject,
      @RequestParam String body) {
    return ResponseEntity.ok(messageService.createDraft(ownerId, trusteeId, subject, body));
  }

  @PutMapping("/{id}/schedule")
  public ResponseEntity<Void> scheduleDelivery(
      @PathVariable UUID id, @RequestParam String scheduleType, @RequestParam String deliveryTime) {
    messageService.scheduleDelivery(id, scheduleType, deliveryTime);
    return ResponseEntity.ok().build();
  }

  @GetMapping("/owner/{ownerId}")
  public ResponseEntity<List<Message>> getMessagesByOwner(@PathVariable UUID ownerId) {
    return ResponseEntity.ok(messageService.getMessagesByOwner(ownerId));
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<Void> deleteMessage(@PathVariable UUID id, @RequestParam UUID ownerId) {
    messageService.deleteMessage(id, ownerId);
    return ResponseEntity.noContent().build();
  }
}
