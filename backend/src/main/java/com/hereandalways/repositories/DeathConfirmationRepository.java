package com.hereandalways.repositories;

import com.hereandalways.models.DeathConfirmation;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DeathConfirmationRepository extends JpaRepository<DeathConfirmation, UUID> {
  // Inherits CRUD methods like save(), findById(), delete(), etc.

}
