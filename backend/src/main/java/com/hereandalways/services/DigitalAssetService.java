package com.hereandalways.services;

import com.hereandalways.models.DigitalAsset;
import com.hereandalways.models.User;
import com.hereandalways.repositories.DigitalAssetRepository;
import com.hereandalways.repositories.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class DigitalAssetService {

  private final DigitalAssetRepository assetRepo;
  private final UserRepository userRepo;

  public List<DigitalAsset> getAssetsByOwner(UUID ownerId) {
    return assetRepo.findByLegacyOwnerId(ownerId);
  }

  public List<DigitalAsset> getAssetsByTrustee(UUID trusteeId) {
    return assetRepo.findByTrustees_Id(trusteeId);
  }

  public Optional<DigitalAsset> getById(UUID id) {
    return assetRepo.findById(id);
  }

  @Transactional
  public DigitalAsset saveAsset(DigitalAsset asset, UUID ownerId) {
    User owner = userRepo.findById(ownerId)
        .orElseThrow(() -> new IllegalArgumentException("Invalid owner ID"));
    asset.setLegacyOwner(owner);
    return assetRepo.save(asset);
  }

  public void deleteAsset(UUID id) {
    assetRepo.deleteById(id);
  }
}
