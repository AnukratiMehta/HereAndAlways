package com.hereandalways.services;

import com.hereandalways.models.DigitalAsset;
import com.hereandalways.models.Message;
import com.hereandalways.models.User;
import com.hereandalways.models.enums.AssetType;
import com.hereandalways.payload.request.DigitalAssetRequest;
import com.hereandalways.payload.response.DigitalAssetResponse;
import com.hereandalways.repositories.DigitalAssetRepository;
import com.hereandalways.repositories.MessageRepository;
import com.hereandalways.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.transaction.annotation.Transactional;


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

    @Transactional(readOnly = true)
    public List<DigitalAsset> getAssetsByOwner(UUID ownerId) {
        return assetRepo.findByLegacyOwnerId(ownerId);
    }

    @Transactional(readOnly = true)
    public List<DigitalAsset> getAssetsByTrustee(UUID trusteeId) {
        return assetRepo.findByTrustees_Id(trusteeId);
    }

    @Transactional(readOnly = true)
    public List<DigitalAsset> getAssetsByMessage(UUID messageId) {
        return assetRepo.findByLinkedMessages_Id(messageId);
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
            assetRepo.save(asset);
        });
        return opt;
    }

    @Transactional
    public void deleteAsset(UUID id) {
        Optional<DigitalAsset> assetOpt = assetRepo.findById(id);
        assetOpt.ifPresent(asset -> {
            asset.getTrustees().clear();
            asset.setLinkedMessages(new HashSet<>());
            assetRepo.delete(asset);
        });
    }

    @Transactional
    public DigitalAssetResponse createAsset(DigitalAssetRequest request, UUID ownerId) {
        User owner = userRepo.findById(ownerId)
                .orElseThrow(() -> new IllegalArgumentException("Invalid owner ID"));

        List<User> trustees = request.getTrusteeIds() != null
                ? userRepo.findAllById(request.getTrusteeIds())
                : new ArrayList<>();

        Set<Message> linkedMessages = request.getMessageIds() != null && !request.getMessageIds().isEmpty()
                ? new HashSet<>(messageRepo.findAllById(request.getMessageIds()))
                : new HashSet<>();

        AssetType type = request.getAssetType();
        if (type == null || type == AssetType.DOCUMENT) {
            type = inferAssetType(request.getMimeType());
        }

        DigitalAsset asset = new DigitalAsset();
        asset.setName(request.getName());
        asset.setDescription(request.getDescription());
        asset.setAssetType(type);
        asset.setDownloadUrl(request.getDownloadUrl());
        asset.setEncryptedKey(request.getEncryptedKey());
        asset.setFileSize(request.getFileSize());
        asset.setMimeType(request.getMimeType());
        asset.setLegacyOwner(owner);
        asset.setTrustees(trustees);
        asset.setLinkedMessages(linkedMessages);

        DigitalAsset saved = assetRepo.save(asset);
        return DigitalAssetResponse.fromEntity(saved);
    }

    @Transactional
    public Optional<DigitalAssetResponse> updateAsset(UUID id, DigitalAssetRequest request) {
        Optional<DigitalAsset> existingOpt = assetRepo.findById(id);
        if (existingOpt.isEmpty()) return Optional.empty();

        DigitalAsset asset = existingOpt.get();

        if (request.getName() != null) asset.setName(request.getName());
        if (request.getDescription() != null) asset.setDescription(request.getDescription());
        if (request.getDownloadUrl() != null) asset.setDownloadUrl(request.getDownloadUrl());
        if (request.getEncryptedKey() != null) asset.setEncryptedKey(request.getEncryptedKey());
        if (request.getFileSize() != null) asset.setFileSize(request.getFileSize());
        if (request.getMimeType() != null) asset.setMimeType(request.getMimeType());

        if (request.getAssetType() != null) {
            AssetType type = request.getAssetType();
            if (type == AssetType.DOCUMENT) {
                type = inferAssetType(request.getMimeType());
            }
            asset.setAssetType(type);
        }

        if (request.getTrusteeIds() != null) {
            List<User> updatedTrustees = userRepo.findAllById(request.getTrusteeIds());
            asset.setTrustees(updatedTrustees);
        }

        if (request.getMessageIds() != null) {
            Set<Message> updatedMessages = new HashSet<>(messageRepo.findAllById(request.getMessageIds()));
            asset.setLinkedMessages(updatedMessages);
        }

        DigitalAsset updated = assetRepo.save(asset);
        return Optional.of(DigitalAssetResponse.fromEntity(updated));
    }

    private AssetType inferAssetType(String mimeType) {
        if (mimeType == null) return AssetType.DOCUMENT;
        if (mimeType.startsWith("image/")) return AssetType.IMAGE;
        if (mimeType.startsWith("video/")) return AssetType.VIDEO;
        if (mimeType.startsWith("audio/")) return AssetType.MUSIC;
        if (mimeType.contains("pdf") || mimeType.contains("msword") || mimeType.contains("document")) return AssetType.DOCUMENT;
        if (mimeType.contains("spreadsheet") || mimeType.contains("excel")) return AssetType.DOCUMENT;
        if (mimeType.contains("zip") || mimeType.contains("compressed")) return AssetType.DOCUMENT;
        if (mimeType.contains("plain") || mimeType.contains("json")) return AssetType.DOCUMENT;
        return AssetType.DOCUMENT;
    }
}