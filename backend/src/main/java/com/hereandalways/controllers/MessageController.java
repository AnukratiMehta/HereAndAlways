package com.hereandalways.controllers;

import com.hereandalways.models.Message;
import com.hereandalways.models.enums.ScheduleType;
import com.hereandalways.services.MessageService;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

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
      @PathVariable UUID id, @RequestParam ScheduleType scheduleType, @RequestParam LocalDateTime deliveryTime) {
    messageService.scheduleDelivery(id, scheduleType, deliveryTime);
    return ResponseEntity.ok().build();
  }

}
