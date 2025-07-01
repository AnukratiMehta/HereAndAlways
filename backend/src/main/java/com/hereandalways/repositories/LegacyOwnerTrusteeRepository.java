package com.hereandalways.repositories;

import com.hereandalways.models.LegacyOwnerTrustee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface LegacyOwnerTrusteeRepository extends JpaRepository<LegacyOwnerTrustee, UUID> {

    // Find all trustees appointed by a specific legacy owner
    List<LegacyOwnerTrustee> findByLegacyOwnerId(UUID legacyOwnerId);

    // Find all legacy owners for which a user is trustee
    List<LegacyOwnerTrustee> findByTrusteeId(UUID trusteeId);

    // Optionally, find a specific trustee relationship between legacy owner and trustee
    LegacyOwnerTrustee findByLegacyOwnerIdAndTrusteeId(UUID legacyOwnerId, UUID trusteeId);
}
