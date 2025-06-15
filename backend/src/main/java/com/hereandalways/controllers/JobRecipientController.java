package com.hereandalways.controllers;

import com.hereandalways.models.JobRecipient;
import com.hereandalways.services.JobRecipientService;
import java.util.Optional;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/job-recipients")
@RequiredArgsConstructor
public class JobRecipientController {

  private final JobRecipientService recipientService;

  @PutMapping("/claim")
  public ResponseEntity<Void> claimAccess(
      @RequestParam String accessCode, @RequestParam UUID trusteeId) {
    recipientService.claimAccessGrant(accessCode, trusteeId);
    return ResponseEntity.ok().build();
  }

  @GetMapping("/validate")
  public ResponseEntity<Optional<JobRecipient>> validateAccessCode(
      @RequestParam String accessCode) {
    return ResponseEntity.ok(recipientService.validateAccessCode(accessCode));
  }

  @PutMapping("/{id}/revoke")
  public ResponseEntity<Void> revokeAccess(@PathVariable UUID id) {
    recipientService.revokeAccess(id);
    return ResponseEntity.noContent().build();
  }
}
