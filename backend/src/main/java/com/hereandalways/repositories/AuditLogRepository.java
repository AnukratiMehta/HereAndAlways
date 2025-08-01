package com.hereandalways.repositories;

import com.hereandalways.models.AuditLog;
import com.hereandalways.models.enums.AuditEntity;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AuditLogRepository extends JpaRepository<AuditLog, UUID> {
      // For getEntityAuditHistory()
    List<AuditLog> findByEntityAndEntityIdOrderByTimestampDesc(AuditEntity entity, UUID entityId);
    
    // For getUserActivity()
    List<AuditLog> findByUserIdOrderByTimestampDesc(UUID userId);
    
    // For getAuditLogsByDateRange()
    List<AuditLog> findByTimestampBetweenOrderByTimestampDesc(LocalDateTime start, LocalDateTime end);

}
