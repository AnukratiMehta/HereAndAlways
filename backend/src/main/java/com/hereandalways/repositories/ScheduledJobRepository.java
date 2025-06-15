package com.hereandalways.repositories;

import com.hereandalways.models.ScheduledJob;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ScheduledJobRepository extends JpaRepository<ScheduledJob, UUID> {
  // Inherits CRUD methods like save(), findById(), delete(), etc.

}
