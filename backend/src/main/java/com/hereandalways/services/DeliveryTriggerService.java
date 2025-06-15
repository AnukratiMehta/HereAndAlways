package com.hereandalways.services;

import com.hereandalways.models.*;
import com.hereandalways.models.enums.TriggerType;
import com.hereandalways.models.enums.UserRole;
import com.hereandalways.repositories.DeliveryTriggerRepository;
import com.hereandalways.repositories.UserRepository;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class DeliveryTriggerService {

  private final DeliveryTriggerRepository triggerRepo;
  private final UserRepository userRepo;
  private final ScheduledJobService jobService;

  @Transactional
  public DeliveryTrigger createTrigger(
      UUID ownerId, TriggerType triggerType, String config, boolean isActive) {
    User owner = userRepo.findById(ownerId).orElseThrow();

    DeliveryTrigger trigger = new DeliveryTrigger();
    trigger.setTriggerType(triggerType);
    trigger.setTriggerConfig(config);
    trigger.setActive(isActive);
    trigger.setLegacyOwner(owner);

    return triggerRepo.save(trigger);
  }

  /** ADMIN-ONLY: Activates a trigger and processes any immediate jobs */
  @Transactional
  public void activateTrigger(UUID adminId, UUID triggerId, LocalDateTime triggerDate) {
    // Verify admin privileges
    User admin =
        userRepo.findById(adminId).orElseThrow(() -> new AccessDeniedException("User not found"));

    if (admin.getRole() != UserRole.ADMIN) {
      throw new AccessDeniedException("Only admins can activate triggers");
    }

    DeliveryTrigger trigger = triggerRepo.findById(triggerId).orElseThrow();

    if (!trigger.isActive()) {
      trigger.setActive(true);
      triggerRepo.save(trigger);

      jobService.processTriggerActivation(
          trigger.getLegacyOwner().getId(), trigger.getTriggerType(), triggerDate);
    }
  }

  @Transactional
  public void deactivateTrigger(UUID ownerId, UUID triggerId) {
    DeliveryTrigger trigger =
        triggerRepo.findByIdAndLegacyOwnerId(triggerId, ownerId).orElseThrow();
    trigger.setActive(false);
    triggerRepo.save(trigger);
  }

  /** Gets all triggers for a legacy owner */
  @Transactional(readOnly = true)
  public List<DeliveryTrigger> getTriggersForOwner(UUID ownerId) {
    return triggerRepo.findByLegacyOwnerId(ownerId);
  }

  @Transactional
  public void deleteTrigger(UUID ownerId, UUID triggerId) {
    DeliveryTrigger trigger =
        triggerRepo.findByIdAndLegacyOwnerId(triggerId, ownerId).orElseThrow();
    triggerRepo.delete(trigger);
  }
}
