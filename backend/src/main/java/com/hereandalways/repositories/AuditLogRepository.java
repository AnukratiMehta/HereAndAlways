package com.hereandalways.repositories;

import com.hereandalways.models.AuditLog;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AuditLogRepository extends JpaRepository<AuditLog, UUID> {
  // Inherits CRUD methods like save(), findById(), delete(), etc.

}
