package com.hereandalways.repositories;

import com.hereandalways.models.DeathConfirmation;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.UUID;

public interface DeathConfirmationRepository extends JpaRepository<DeathConfirmation, UUID> {
    // Inherits CRUD methods like save(), findById(), delete(), etc.

}