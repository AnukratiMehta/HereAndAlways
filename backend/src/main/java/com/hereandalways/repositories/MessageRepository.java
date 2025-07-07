package com.hereandalways.repositories;

import com.hereandalways.models.Message;
import com.hereandalways.models.enums.DeliveryStatus;
import com.hereandalways.payload.response.MessageSummaryProjection;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface MessageRepository extends JpaRepository<Message, UUID> {

    @EntityGraph(attributePaths = {"trustees"})
    List<Message> findByLegacyOwnerId(UUID legacyOwnerId);

    List<Message> findByLegacyOwnerIdAndDeliveryStatus(UUID legacyOwnerId, DeliveryStatus status);

    List<Message> findByLegacyOwnerIdOrderByLastAccessedAtDesc(UUID legacyOwnerId);

    @Query("""
        select m.id as id, m.subject as subject
        from Message m
        join m.trustees t
        where t.id = :trusteeId
    """)
    List<MessageSummaryProjection> findMessageSummariesByTrusteeId(UUID trusteeId);
}
