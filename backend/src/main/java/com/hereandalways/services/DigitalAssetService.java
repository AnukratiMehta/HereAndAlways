package com.hereandalways.services;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.hereandalways.models.DigitalAsset;
import com.hereandalways.models.Message;
import com.hereandalways.models.User;
import com.hereandalways.payload.request.DigitalAssetRequest;
import com.hereandalways.payload.response.DigitalAssetResponse;
import com.hereandalways.repositories.DigitalAssetRepository;
import com.hereandalways.repositories.MessageRepository;
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
  private final MessageRepository messageRepo;

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

  @Transactional
public DigitalAssetResponse createAsset(DigitalAssetRequest request, UUID ownerId) {
    User owner = userRepo.findById(ownerId)
        .orElseThrow(() -> new IllegalArgumentException("Invalid owner ID"));

    List<User> trustees = request.getTrusteeIds() != null
        ? userRepo.findAllById(request.getTrusteeIds())
        : new ArrayList<>();

    Message linkedMessage = null;
    if (request.getMessageId() != null) {
        linkedMessage = messageRepo.findById(request.getMessageId())
            .orElseThrow(() -> new IllegalArgumentException("Invalid message ID"));
    }

    DigitalAsset asset = new DigitalAsset();
    asset.setName(request.getName());
    asset.setDescription(request.getDescription());
    asset.setAssetType(request.getAssetType());
    asset.setDownloadUrl(request.getDownloadUrl());
    asset.setEncryptedKey(request.getEncryptedKey());
    asset.setFileSize(request.getFileSize());
    asset.setMimeType(request.getMimeType());
    asset.setLegacyOwner(owner);
    asset.setTrustees(trustees);
    asset.setLinkedMessage(linkedMessage);

    DigitalAsset saved = assetRepo.save(asset);
    return DigitalAssetResponse.fromEntity(saved);
}

@Transactional
public Optional<DigitalAssetResponse> updateAsset(UUID id, DigitalAssetRequest request) {
    Optional<DigitalAsset> existingOpt = assetRepo.findById(id);
    if (existingOpt.isEmpty()) return Optional.empty();

    DigitalAsset asset = existingOpt.get();

    // Update fields if present
    if (request.getName() != null) asset.setName(request.getName());
    if (request.getDescription() != null) asset.setDescription(request.getDescription());
    if (request.getAssetType() != null) asset.setAssetType(request.getAssetType());
    if (request.getDownloadUrl() != null) asset.setDownloadUrl(request.getDownloadUrl());
    if (request.getEncryptedKey() != null) asset.setEncryptedKey(request.getEncryptedKey());
    if (request.getFileSize() != null) asset.setFileSize(request.getFileSize());
    if (request.getMimeType() != null) asset.setMimeType(request.getMimeType());

    // Update trustees
    if (request.getTrusteeIds() != null) {
        List<User> updatedTrustees = userRepo.findAllById(request.getTrusteeIds());
        asset.setTrustees(updatedTrustees);
    }

    // Update linked message
    if (request.getMessageId() != null) {
        asset.setLinkedMessage(
            messageRepo.findById(request.getMessageId())
                .orElseThrow(() -> new IllegalArgumentException("Invalid message ID"))
        );
    } else {
        asset.setLinkedMessage(null); // Unlink if null provided
    }

    DigitalAsset updated = assetRepo.save(asset);
    return Optional.of(DigitalAssetResponse.fromEntity(updated));
}


}
