package com.hereandalways.repositories;

import com.hereandalways.models.LegacyOwnerTrustee;
import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LegacyOwnerTrusteeRepository extends JpaRepository<LegacyOwnerTrustee, UUID> {
    
    // Used in getTrusteesForOwner()
    List<LegacyOwnerTrustee> findByLegacyOwnerId(UUID legacyOwnerId);
}