package com.hereandalways.repositories;

import com.hereandalways.models.Message;
import com.hereandalways.models.enums.DeliveryStatus;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MessageRepository extends JpaRepository<Message, UUID> {
    
    // Used in MessageService.scheduleDelivery()
    Optional<Message> findByIdAndDeliveryStatus(UUID id, DeliveryStatus status);
    
    // Used in MessageController.getMessagesByOwner()
    List<Message> findByLegacyOwnerId(UUID legacyOwnerId);
}