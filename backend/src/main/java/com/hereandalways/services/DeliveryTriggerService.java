package com.hereandalways.services;

import com.hereandalways.models.*;
import com.hereandalways.models.enums.TriggerType;
import com.hereandalways.repositories.DeliveryTriggerRepository;
import com.hereandalways.repositories.UserRepository;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class DeliveryTriggerService {

  private final DeliveryTriggerRepository triggerRepo;
  private final UserRepository userRepo;

  @Transactional
  public DeliveryTrigger createTrigger(
      UUID ownerId, TriggerType triggerType, String config, boolean isActive) {
    User owner = userRepo.findById(ownerId).orElseThrow();

    DeliveryTrigger trigger = new DeliveryTrigger();
    trigger.setTriggerType(triggerType);
    trigger.setTriggerConfig(config);
    trigger.setIsActive(isActive);
    trigger.setLegacyOwner(owner);

    return triggerRepo.save(trigger);
  }

  @Transactional
  public void deactivateTrigger(UUID ownerId, UUID triggerId) {
    DeliveryTrigger trigger =
        triggerRepo.findByIdAndLegacyOwnerId(triggerId, ownerId).orElseThrow();
    trigger.setIsActive(false);
    triggerRepo.save(trigger);
  }

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
