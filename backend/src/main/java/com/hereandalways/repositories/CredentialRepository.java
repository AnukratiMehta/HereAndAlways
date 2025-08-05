package com.hereandalways.repositories;

import com.hereandalways.models.Credential;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface CredentialRepository extends JpaRepository<Credential, UUID> {
    @EntityGraph(attributePaths = {"linkedTrustees"})
    List<Credential> findAllByLegacyOwnerId(UUID legacyOwnerId);

    @EntityGraph(attributePaths = {"linkedTrustees"})
    List<Credential> findAllByLegacyOwnerIdAndCategory(UUID legacyOwnerId, Enum category);

    @EntityGraph(attributePaths = {"linkedTrustees"})
    List<Credential> findByLinkedTrustees_Id(UUID trusteeId);
}
