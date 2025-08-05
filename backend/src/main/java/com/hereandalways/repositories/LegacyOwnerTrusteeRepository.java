package com.hereandalways.repositories;

import com.hereandalways.models.LegacyOwnerTrustee;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface LegacyOwnerTrusteeRepository extends JpaRepository<LegacyOwnerTrustee, UUID> {

    @EntityGraph(attributePaths = {"trustee", "trustee.credentials"})
    List<LegacyOwnerTrustee> findByLegacyOwnerId(UUID legacyOwnerId);

    @EntityGraph(attributePaths = {"trustee"})
    List<LegacyOwnerTrustee> findByTrusteeId(UUID trusteeId);

    @EntityGraph(attributePaths = {"trustee", "legacyOwner"})
    LegacyOwnerTrustee findByLegacyOwnerIdAndTrusteeId(UUID legacyOwnerId, UUID trusteeId);

    @EntityGraph(attributePaths = {"trustee", "trustee.credentials"})
    List<LegacyOwnerTrustee> findByLegacyOwnerIdOrderByInvitedAtDesc(UUID ownerId);
}