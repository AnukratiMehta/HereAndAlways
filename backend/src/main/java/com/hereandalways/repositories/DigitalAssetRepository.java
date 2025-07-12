package com.hereandalways.repositories;

import com.hereandalways.models.DigitalAsset;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface DigitalAssetRepository extends JpaRepository<DigitalAsset, UUID> {

  @EntityGraph(attributePaths = {"linkedMessages", "trustees"})
  List<DigitalAsset> findByLegacyOwnerId(UUID ownerId);

  @EntityGraph(attributePaths = {"linkedMessages", "trustees"})
  List<DigitalAsset> findByTrustees_Id(UUID trusteeId);
}
