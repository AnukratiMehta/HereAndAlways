package com.hereandalways.repositories;

import com.hereandalways.models.DigitalAsset;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DigitalAssetRepository extends JpaRepository<DigitalAsset, UUID> {
    
    // Used in DigitalAssetService.getAssetsByOwner()
    List<DigitalAsset> findByLegacyOwnerId(UUID legacyOwnerId);
    
    // Used in DigitalAssetService.deleteAsset()
    Optional<DigitalAsset> findByIdAndLegacyOwnerId(UUID id, UUID legacyOwnerId);
}