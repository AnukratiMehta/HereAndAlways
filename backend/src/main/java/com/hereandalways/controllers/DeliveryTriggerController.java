package com.hereandalways.controllers;

import com.hereandalways.models.DeliveryTrigger;
import com.hereandalways.models.enums.TriggerType;
import com.hereandalways.services.DeliveryTriggerService;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/triggers")
@RequiredArgsConstructor
public class DeliveryTriggerController {

  private final DeliveryTriggerService triggerService;

  @PostMapping
  public ResponseEntity<DeliveryTrigger> createTrigger(
      @RequestParam UUID ownerId,
      @RequestParam TriggerType triggerType,
      @RequestParam String triggerConfig,
      @RequestParam(defaultValue = "true") boolean isActive) {
    return ResponseEntity.ok(
        triggerService.createTrigger(ownerId, triggerType, triggerConfig, isActive));
  }


  @PutMapping("/{id}/deactivate")
  public ResponseEntity<Void> deactivateTrigger(@PathVariable UUID ownerId, UUID triggerId) {
    triggerService.deactivateTrigger(ownerId, triggerId);
    return ResponseEntity.noContent().build();
  }

  @GetMapping("/owner/{ownerId}")
  public ResponseEntity<List<DeliveryTrigger>> getTriggersForOwner(@PathVariable UUID ownerId) {
    return ResponseEntity.ok(triggerService.getTriggersForOwner(ownerId));
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<Void> deleteTrigger(@PathVariable UUID ownerId, UUID triggerId) {
    triggerService.deleteTrigger(ownerId, triggerId);
    return ResponseEntity.noContent().build();
  }
}
