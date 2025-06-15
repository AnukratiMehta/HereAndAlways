package com.hereandalways.controllers;

import com.hereandalways.models.DeathConfirmation;
import com.hereandalways.services.DeathConfirmationService;
import jakarta.validation.constraints.NotNull;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/death-confirmations")
@RequiredArgsConstructor
public class DeathConfirmationController {

  private final DeathConfirmationService deathConfirmationService;

  @PostMapping
  public ResponseEntity<DeathConfirmation> createConfirmationRequest(
      @RequestParam @NotNull UUID legacyOwnerId, @RequestParam @NotNull UUID trusteeId) {

    DeathConfirmation confirmation =
        deathConfirmationService.createConfirmationRequest(legacyOwnerId, trusteeId);

    return ResponseEntity.status(HttpStatus.CREATED).body(confirmation);
  }

  @PutMapping("/{id}/confirm")
  public ResponseEntity<Void> confirmDeath(
      @PathVariable UUID id, @RequestParam @NotNull UUID trusteeId) {

    deathConfirmationService.confirmDeath(id, trusteeId);
    return ResponseEntity.noContent().build();
  }

  @PutMapping("/{id}/reject")
  public ResponseEntity<Void> rejectConfirmation(
      @PathVariable UUID id, @RequestParam @NotNull UUID trusteeId) {

    deathConfirmationService.rejectDeathConfirmation(id, trusteeId);
    return ResponseEntity.noContent().build();
  }

  @GetMapping("/owner/{ownerId}")
  public ResponseEntity<DeathConfirmation> getCurrentConfirmation(@PathVariable UUID ownerId) {

    DeathConfirmation confirmation = deathConfirmationService.getCurrentConfirmation(ownerId);

    return ResponseEntity.ok(confirmation);
  }
}
