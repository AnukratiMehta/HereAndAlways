package com.hereandalways.repositories;

import com.hereandalways.models.DigitalTrigger;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.UUID;

public interface DigitalTriggerRepository extends JpaRepository<DigitalTrigger, UUID> {
    // Inherits CRUD methods like save(), findById(), delete(), etc.

}