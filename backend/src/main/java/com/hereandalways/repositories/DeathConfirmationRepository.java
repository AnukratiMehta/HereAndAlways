package com.hereandalways.repositories;

import com.hereandalways.models.DeathConfirmation;

import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DeathConfirmationRepository extends JpaRepository<DeathConfirmation, UUID> {

    Optional<DeathConfirmation> findFirstByLegacyOwnerIdOrderByConfirmedAtDesc(UUID legacyOwnerId);
    

}
