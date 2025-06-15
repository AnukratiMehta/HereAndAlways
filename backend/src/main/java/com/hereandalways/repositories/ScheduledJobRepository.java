package com.hereandalways.repositories;

import com.hereandalways.models.ScheduledJob;
import com.hereandalways.models.enums.ScheduleType;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ScheduledJobRepository extends JpaRepository<ScheduledJob, UUID> {
    
    // Used in ScheduledJobService.processDeathConfirmation()
    List<ScheduledJob> findByLegacyOwnerIdAndScheduleTypeIn(UUID ownerId, Set<ScheduleType> types);
}