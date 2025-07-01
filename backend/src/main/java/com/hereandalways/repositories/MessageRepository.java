package com.hereandalways.repositories;

import com.hereandalways.models.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface MessageRepository extends JpaRepository<Message, UUID> {
    List<Message> findByLegacyOwnerId(UUID legacyOwnerId);

    List<Message> findByLegacyOwnerIdAndDeliveryStatus(UUID legacyOwnerId, com.hereandalways.models.enums.DeliveryStatus status);
}
