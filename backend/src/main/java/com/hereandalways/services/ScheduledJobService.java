package com.hereandalways.services;

import com.hereandalways.models.*;
import com.hereandalways.models.enums.JobStatus;
import com.hereandalways.models.enums.RecipientStatus;
import com.hereandalways.repositories.*;
import java.time.LocalDateTime;
import java.util.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.HashMap;
import java.util.EnumSet;

@Service
@RequiredArgsConstructor
@Slf4j
public class ScheduledJobService {
  private final ScheduledJobRepository jobRepo;
  private final JobRecipientRepository recipientRepo;
  private final UserRepository userRepo;
  private final MessageRepository messageRepo;
  private final DigitalAssetRepository assetRepo;

  @Transactional
  public ScheduledJob createScheduledJob(
      UUID entityId,
      JobType jobType,
      UUID ownerId,
      ScheduleType scheduleType,
      LocalDateTime exactTime,
      Integer timeOffset,
      List<String> trusteeEmails) {

    // 1. Validate owner exists
    User owner =
        userRepo
            .findById(ownerId)
            .orElseThrow(() -> new IllegalArgumentException("Invalid owner ID"));

    // 2. Create and configure the job
    ScheduledJob job = new ScheduledJob();
    job.setJobType(jobType);
    job.setEntityId(entityId);
    job.setLegacyOwner(owner);
    job.setStatus(JobStatus.PENDING);
    job.setScheduleType(scheduleType);

    // 3. Handle timing based on schedule type
    if (scheduleType == ScheduleType.ABSOLUTE) {
      job.setScheduledFor(exactTime);
    } else {
      job.setTimeOffset(timeOffset);
      // Will be calculated when trigger occurs
      job.setScheduledFor(LocalDateTime.MIN);
    }

    // 4. Save the parent job first
    jobRepo.save(job);

    // 5. Create access grants for each trustee
    trusteeEmails.forEach(
        email -> {
          JobRecipient recipient = new JobRecipient();
          recipient.setJob(job);
          recipient.setStatus(RecipientStatus.PENDING);

          // For absolute schedules, use job's scheduled time
          // For relative, this will be updated when trigger occurs
          recipient.setScheduledDeliveryTime(
              scheduleType == ScheduleType.ABSOLUTE ? exactTime : null);

          recipientRepo.save(recipient); // Generates access_code automatically

          log.info("Created access for {} with code {}", email, recipient.getAccessCode());
          // In production: Send email with registration link
        });

    return job;
  }

  // ==== TRIGGER PROCESSING ==== //

  /**
   * Processes death confirmations and calculates delivery times for relative jobs.
   *
   * @param ownerId The deceased owner's ID
   * @param deathDate Verified date of death
   */
  @Transactional
  public void processDeathConfirmation(UUID ownerId, LocalDateTime deathDate) {
    // 1. Find all pending relative-to-death jobs
    List<ScheduledJob> jobs =
        jobRepo.findByLegacyOwnerIdAndScheduleTypeIn(
            ownerId,
            EnumSet.of(
                ScheduleType.IMMEDIATELY_AFTER_CONFIRMATION,
                ScheduleType.RELATIVE_DAYS_AFTER_DEATH,
                ScheduleType.RELATIVE_WEEKS_AFTER_DEATH,
                ScheduleType.RELATIVE_MONTHS_AFTER_DEATH,
                ScheduleType.RELATIVE_YEARS_AFTER_DEATH));

    // 2. Process each job
    jobs.forEach(
        job -> {
          // Calculate delivery time
          job.calculateDeliveryTime(deathDate);

          // Check if delivery should happen immediately
          if (job.getScheduledFor().isBefore(LocalDateTime.now())) {
            deliverJobContent(job);
            job.setStatus(JobStatus.COMPLETED);
            job.setExecutedAt(LocalDateTime.now());
          }

          jobRepo.save(job);

          // Update recipient schedules
          job.getRecipients()
              .forEach(
                  recipient -> {
                    recipient.setScheduledDeliveryTime(job.getScheduledFor());
                    recipientRepo.save(recipient);
                  });
        });
  }

  @Transactional
  public void deliverAbsoluteJob(UUID jobId) {
    ScheduledJob job =
        jobRepo.findById(jobId).orElseThrow(() -> new IllegalArgumentException("Job not found"));

    if (job.getScheduleType() == ScheduleType.ABSOLUTE && job.getStatus() == JobStatus.PENDING) {
      deliverJobContent(job);
      job.setStatus(JobStatus.COMPLETED);
      job.setExecutedAt(LocalDateTime.now());
      jobRepo.save(job);
    }
  }

  // ==== TRUSTEE ACCESS ==== //

  /**
   * Links a trustee account to an access grant during registration.
   *
   * @param accessCode The unique invitation code
   * @param trusteeId The newly created user ID
   */
  @Transactional
  public void registerTrusteeAccess(String accessCode, UUID trusteeId) {
    // 1. Find the pending access grant
    JobRecipient recipient =
        recipientRepo
            .findByAccessCode(accessCode)
            .orElseThrow(() -> new IllegalArgumentException("Invalid access code"));

    // 2. Verify not already claimed
    if (recipient.getStatus() != RecipientStatus.PENDING) {
      throw new IllegalStateException("Access already claimed");
    }

    // 3. Link to trustee account
    User trustee =
        userRepo
            .findById(trusteeId)
            .orElseThrow(() -> new IllegalArgumentException("Invalid trustee ID"));

    recipient.setTrustee(trustee);
    recipient.setStatus(RecipientStatus.REGISTERED);
    recipient.setAccessRegisteredAt(LocalDateTime.now());
    recipientRepo.save(recipient);
  }

  /**
   * Gets all content accessible to a trustee.
   *
   * @param trusteeId The authenticated trustee's ID
   * @return Map containing lists of messages and assets
   */
  @Transactional(readOnly = true)
  public Map<String, List<?>> getTrusteeContent(UUID trusteeId) {
    Map<String, List<?>> result = new HashMap<>();
    result.put("messages", new ArrayList<>());
    result.put("assets", new ArrayList<>());

    // 1. Find all valid access grants
    recipientRepo
        .findByTrusteeIdAndStatus(trusteeId, RecipientStatus.REGISTERED)
        .forEach(
            recipient -> {
              ScheduledJob job = recipient.getJob();

              // 2. Only include if job is completed
              if (job.getStatus() == JobStatus.COMPLETED) {
                if (job.getJobType() == JobType.MESSAGE_DELIVERY) {
                  messageRepo
                      .findById(job.getEntityId())
                      .ifPresent(msg -> result.get("messages").add(msg));
                } else {
                  assetRepo
                      .findById(job.getEntityId())
                      .ifPresent(asset -> result.get("assets").add(asset));
                }
              }
            });

    return result;
  }
}
