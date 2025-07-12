package com.hereandalways.services;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.hereandalways.models.DigitalAsset;
import com.hereandalways.models.User;
import com.hereandalways.repositories.DigitalAssetRepository;
import com.hereandalways.repositories.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@Service
@RequiredArgsConstructor
public class DigitalAssetService {

  private final DigitalAssetRepository assetRepo;
  private final UserRepository userRepo;
  private final RestTemplate restTemplate = new RestTemplate();

  @Value("${supabase.url}")
  private String supabaseUrl;

  @Value("${supabase.serviceRoleKey}")
  private String serviceRoleKey;

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

  public Optional<DigitalAsset> updateAssetMetadata(UUID id, Map<String, String> updates) {
    Optional<DigitalAsset> opt = assetRepo.findById(id);
    opt.ifPresent(asset -> {
      if (updates.containsKey("description")) {
        asset.setDescription(updates.get("description"));
      }
      // Add more fields here if needed
      assetRepo.save(asset);
    });
    return opt;
  }

  public void deleteAsset(UUID id) {
    assetRepo.deleteById(id);
  }
}
