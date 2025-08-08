package com.hereandalways.repositories;

import com.hereandalways.models.JobRecipient;
import com.hereandalways.models.enums.RecipientStatus;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface JobRecipientRepository extends JpaRepository<JobRecipient, UUID> {
    
    Optional<JobRecipient> findByAccessCode(String accessCode);
    
    List<JobRecipient> findByTrusteeIdAndStatus(UUID trusteeId, RecipientStatus status);
}