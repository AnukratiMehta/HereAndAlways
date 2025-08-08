package com.hereandalways.repositories;

import com.hereandalways.models.DeliveryTrigger;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface DeliveryTriggerRepository extends JpaRepository<DeliveryTrigger, UUID> {
    
    List<DeliveryTrigger> findByLegacyOwnerId(UUID legacyOwnerId);
    
    Optional<DeliveryTrigger> findByIdAndLegacyOwnerId(UUID id, UUID legacyOwnerId);
}