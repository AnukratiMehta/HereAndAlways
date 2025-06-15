package com.hereandalways.services;

import com.hereandalways.models.*;
import com.hereandalways.models.enums.AuditAction;
import com.hereandalways.models.enums.AuditEntity;
import com.hereandalways.repositories.AuditLogRepository;
import com.hereandalways.repositories.UserRepository;
import java.time.LocalDateTime;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.UUID;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AuditLogService {

  private final AuditLogRepository auditLogRepository;
  private final UserRepository userRepository;

  @Transactional
  public AuditLog logAction(
      UUID userId, AuditAction action, AuditEntity entity, UUID entityId, String metadata) {
    AuditLog log = new AuditLog();
    log.setAction(action);
    log.setEntity(entity);
    log.setEntityId(entityId);
    log.setMetadata(metadata);
    log.setTimestamp(LocalDateTime.now());

    if (userId != null) {
      log.setUser(userRepository.findById(userId).orElse(null));
    }

    return auditLogRepository.save(log);
  }

  @Transactional(readOnly = true)
  public List<AuditLog> getEntityAuditHistory(AuditEntity entity, UUID entityId) {
    return auditLogRepository.findByEntityAndEntityIdOrderByTimestampDesc(entity, entityId);
  }

  @Transactional(readOnly = true)
  public List<AuditLog> getUserActivity(UUID userId, int limit) {
    return auditLogRepository.findByUserIdOrderByTimestampDesc(userId).stream()
        .limit(limit)
        .toList();
  }

  @Transactional(readOnly = true)
  public List<AuditLog> getAuditLogsByDateRange(LocalDateTime start, LocalDateTime end) {
    return auditLogRepository.findByTimestampBetweenOrderByTimestampDesc(start, end);
  }
}
