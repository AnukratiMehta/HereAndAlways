package com.hereandalways.repositories;

import com.hereandalways.models.AuditLog;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.UUID;

public interface AuditLogRepository extends JpaRepository<AuditLog, UUID> {
    // Inherits CRUD methods like save(), findById(), delete(), etc.

}