package com.hereandalways.repositories;

import com.hereandalways.models.DigitalAsset;
import com.hereandalways.models.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface DigitalAssetRepository extends JpaRepository<DigitalAsset, UUID> {
  List<DigitalAsset> findByLegacyOwnerId(UUID ownerId);
  List<DigitalAsset> findByTrustees_Id(UUID trusteeId);
}
