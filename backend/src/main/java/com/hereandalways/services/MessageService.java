package com.hereandalways.services;

import com.hereandalways.models.*;
import com.hereandalways.models.enums.*;
import com.hereandalways.repositories.*;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.EnumSet;

@Service
@RequiredArgsConstructor
public class MessageService {
  private final MessageRepository messageRepo;
  private final UserRepository userRepo;
  private final ScheduledJobService jobService;
  

  @Transactional
  public Message createDraft(UUID ownerId, UUID trusteeId, String subject, String body) {
    User owner =
        userRepo
            .findById(ownerId)
            .orElseThrow(() -> new IllegalArgumentException("Invalid owner ID"));

    Message message = new Message();
    message.setSubject(subject);
    message.setBody(body);
    message.setLegacyOwner(owner);
    message.setDeliveryStatus(DeliveryStatus.DRAFT);

    if (trusteeId != null) {
      User trustee =
          userRepo
              .findById(trusteeId)
              .orElseThrow(() -> new IllegalArgumentException("Invalid trustee ID"));
      message.setTrustee(trustee);
    }

    return messageRepo.save(message);
  }

  @Transactional
  public void scheduleDelivery(
      UUID messageId, ScheduleType scheduleType, LocalDateTime deliveryTime) {
    Message message =
        messageRepo
            .findByIdAndDeliveryStatus(messageId, DeliveryStatus.DRAFT)
            .orElseThrow(() -> new IllegalArgumentException("Message not found or not a draft"));

    message.setDeliveryStatus(DeliveryStatus.QUEUED);
    message.setScheduledDelivery(deliveryTime);
    messageRepo.save(message);

    // Create corresponding scheduled job
    jobService.createScheduledJob(
        message.getId(),
        JobType.MESSAGE_DELIVERY,
        message.getLegacyOwner().getId(),
        scheduleType,
        deliveryTime,
        null, // timeOffset only used for relative schedules
        List.of(message.getTrustee().getEmail()));
  }
}
