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

import com.hereandalways.models.enums.ScheduleType;
import com.hereandalways.models.enums.JobType;


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

    User owner =
        userRepo
            .findById(ownerId)
            .orElseThrow(() -> new IllegalArgumentException("Invalid owner ID"));

    ScheduledJob job = new ScheduledJob();
    job.setJobType(jobType);
    job.setEntityId(entityId);
    job.setLegacyOwner(owner);
    job.setStatus(JobStatus.PENDING);
    job.setScheduleType(scheduleType);

    if (scheduleType == ScheduleType.ABSOLUTE) {
      job.setScheduledFor(exactTime);
    } else {
      job.setTimeOffset(timeOffset);
      job.setScheduledFor(LocalDateTime.MIN);
    }

    jobRepo.save(job);

    trusteeEmails.forEach(
        email -> {
          JobRecipient recipient = new JobRecipient();
          recipient.setJob(job);
          recipient.setStatus(RecipientStatus.PENDING);

          recipient.setScheduledDeliveryTime(
              scheduleType == ScheduleType.ABSOLUTE ? exactTime : null);

          recipientRepo.save(recipient); 

          log.info("Created access for {} with code {}", email, recipient.getAccessCode());
        });

    return job;
  }

  @Transactional
  public void processDeathConfirmation(UUID ownerId, LocalDateTime deathDate) {
    List<ScheduledJob> jobs =
        jobRepo.findByLegacyOwnerIdAndScheduleTypeIn(
            ownerId,
            EnumSet.of(
                ScheduleType.IMMEDIATELY_AFTER_CONFIRMATION,
                ScheduleType.RELATIVE_DAYS_AFTER_DEATH,
                ScheduleType.RELATIVE_WEEKS_AFTER_DEATH,
                ScheduleType.RELATIVE_MONTHS_AFTER_DEATH,
                ScheduleType.RELATIVE_YEARS_AFTER_DEATH));

    jobs.forEach(
        job -> {
          job.calculateDeliveryTime(deathDate);

          if (job.getScheduledFor().isBefore(LocalDateTime.now())) {
            job.setStatus(JobStatus.COMPLETED);
            job.setExecutedAt(LocalDateTime.now());
          }

          jobRepo.save(job);

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
      job.setStatus(JobStatus.COMPLETED);
      job.setExecutedAt(LocalDateTime.now());
      jobRepo.save(job);
    }
  }

  @Transactional
  public void registerTrusteeAccess(String accessCode, UUID trusteeId) {
    JobRecipient recipient =
        recipientRepo
            .findByAccessCode(accessCode)
            .orElseThrow(() -> new IllegalArgumentException("Invalid access code"));

    if (recipient.getStatus() != RecipientStatus.PENDING) {
      throw new IllegalStateException("Access already claimed");
    }

    User trustee =
        userRepo
            .findById(trusteeId)
            .orElseThrow(() -> new IllegalArgumentException("Invalid trustee ID"));

    recipient.setTrustee(trustee);
    recipient.setStatus(RecipientStatus.REGISTERED);
    recipient.setAccessRegisteredAt(LocalDateTime.now());
    recipientRepo.save(recipient);
  }


  @Transactional(readOnly = true)
public Map<String, Object> getTrusteeContent(UUID trusteeId) {
    Map<String, Object> result = new HashMap<>();
    List<Message> messages = new ArrayList<>();
    List<DigitalAsset> assets = new ArrayList<>();
    result.put("messages", messages);
    result.put("assets", assets);

    recipientRepo
        .findByTrusteeIdAndStatus(trusteeId, RecipientStatus.REGISTERED)
        .forEach(recipient -> {
            ScheduledJob job = recipient.getJob();
            
            if (job.getStatus() == JobStatus.COMPLETED) {
                if (job.getJobType() == JobType.MESSAGE_DELIVERY) {
                    messageRepo.findById(job.getEntityId())
                        .ifPresent(messages::add); 
                } else {
                    assetRepo.findById(job.getEntityId())
                        .ifPresent(assets::add); 
                }
            }
        });

    return result;
}
}
