package com.hereandalways.repositories;

import com.hereandalways.models.DeliveryTrigger;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface DeliveryTriggerRepository extends JpaRepository<DeliveryTrigger, UUID> {
    
    // Used in DeliveryTriggerService.getTriggersForOwner()
    List<DeliveryTrigger> findByLegacyOwnerId(UUID legacyOwnerId);
    
    // Used in DeliveryTriggerService.deactivateTrigger() and deleteTrigger()
    Optional<DeliveryTrigger> findByIdAndLegacyOwnerId(UUID id, UUID legacyOwnerId);
}