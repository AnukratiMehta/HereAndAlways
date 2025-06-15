package com.hereandalways.repositories;

import com.hereandalways.models.DeliveryTrigger;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DeliveryTriggerRepository extends JpaRepository<DeliveryTrigger, UUID> {
  // Inherits CRUD methods like save(), findById(), delete(), etc.

}
