package com.hereandalways.repositories;

import com.hereandalways.models.JobRecipient;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;


public interface JobRecipientRepository extends JpaRepository<JobRecipient, UUID> {
}