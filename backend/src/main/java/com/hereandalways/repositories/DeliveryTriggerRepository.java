package com.hereandalways.repositories;

import com.hereandalways.models.DigitalTrigger;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DigitalTriggerRepository extends JpaRepository<DigitalTrigger, UUID> {
  // Inherits CRUD methods like save(), findById(), delete(), etc.

}
