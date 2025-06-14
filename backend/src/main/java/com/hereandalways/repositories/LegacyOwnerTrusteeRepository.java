package com.hereandalways.repositories;

import com.hereandalways.models.LegacyOwnerTrustee;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.UUID;

public interface LegacyOwnerTrusteeRepository extends JpaRepository<LegacyOwnerTrustee, UUID> {
    // Inherits CRUD methods like save(), findById(), delete(), etc.

}