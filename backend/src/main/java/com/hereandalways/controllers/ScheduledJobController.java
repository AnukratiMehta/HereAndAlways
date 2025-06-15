package com.hereandalways.controllers;

import com.hereandalways.models.ScheduledJob;
import com.hereandalways.services.ScheduledJobService;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/jobs")
@RequiredArgsConstructor
public class ScheduledJobController {

  private final ScheduledJobService jobService;

  @PostMapping
  public ResponseEntity<ScheduledJob> createJob(
      @RequestParam UUID entityId,
      @RequestParam String jobType,
      @RequestParam UUID ownerId,
      @RequestParam String scheduleType,
      @RequestParam(required = false) String exactTime,
      @RequestParam(required = false) Integer timeOffset,
      @RequestParam List<String> trusteeEmails) {

    return ResponseEntity.ok(
        jobService.createScheduledJob(
            entityId, jobType, ownerId, scheduleType, exactTime, timeOffset, trusteeEmails));
  }

  @PostMapping("/process-death")
  public ResponseEntity<Void> processDeathConfirmation(
      @RequestParam UUID ownerId, @RequestParam String deathDate) {

    jobService.processDeathConfirmation(ownerId, deathDate);
    return ResponseEntity.ok().build();
  }

  @PostMapping("/deliver-absolute")
  public ResponseEntity<Void> deliverAbsoluteJob(@RequestParam UUID jobId) {

    jobService.deliverAbsoluteJob(jobId);
    return ResponseEntity.ok().build();
  }

  @PostMapping("/register-access")
  public ResponseEntity<Void> registerTrusteeAccess(
      @RequestParam String accessCode, @RequestParam UUID trusteeId) {

    jobService.registerTrusteeAccess(accessCode, trusteeId);
    return ResponseEntity.ok().build();
  }

  @GetMapping("/trustee-content")
  public ResponseEntity<?> getTrusteeContent(@RequestParam UUID trusteeId) {

    return ResponseEntity.ok(jobService.getTrusteeContent(trusteeId));
  }
}
