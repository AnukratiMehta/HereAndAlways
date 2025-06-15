package com.hereandalways.controllers;

import com.hereandalways.models.LegacyOwnerTrustee;
import com.hereandalways.services.LegacyOwnerTrusteeService;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/trustees")
@RequiredArgsConstructor
public class LegacyOwnerTrusteeController {

  private final LegacyOwnerTrusteeService trusteeService;

  @PostMapping
  public ResponseEntity<LegacyOwnerTrustee> createTrusteeRelationship(
      @RequestParam @NotNull UUID ownerId,
      @RequestParam(required = false) UUID trusteeId,
      @RequestParam(required = false) @Email String trusteeEmail) {

    if (trusteeId == null && trusteeEmail == null) {
      throw new IllegalArgumentException("Either trusteeId or trusteeEmail must be provided");
    }

    LegacyOwnerTrustee relationship = trusteeService.addTrustee(ownerId, trusteeId, trusteeEmail);

    return ResponseEntity.status(HttpStatus.CREATED).body(relationship);
  }

  @GetMapping("/owner/{ownerId}")
  public ResponseEntity<List<LegacyOwnerTrustee>> getTrusteesForOwner(@PathVariable UUID ownerId) {
    return ResponseEntity.ok(trusteeService.getTrusteesForOwner(ownerId));
  }

  @DeleteMapping("/{relationshipId}")
  public ResponseEntity<Void> removeTrustee(
      @PathVariable UUID relationshipId, @RequestParam @NotNull UUID ownerId) {
    trusteeService.removeTrustee(relationshipId, ownerId);
    return ResponseEntity.noContent().build();
  }
}
