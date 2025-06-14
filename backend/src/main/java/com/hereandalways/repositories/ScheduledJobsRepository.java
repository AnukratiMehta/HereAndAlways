Can the repo just have this?

package com.hereandalways.repositories;

import com.hereandalways.models.ScheduledJob;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.UUID;

public interface ScheduledJobRepository extends JpaRepository<ScheduledJob, UUID> {
    // Inherits CRUD methods like save(), findById(), delete(), etc.

}