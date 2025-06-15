package com.hereandalways.services;

import com.hereandalways.models.*;
import com.hereandalways.models.enums.AssetType;
import com.hereandalways.repositories.DigitalAssetRepository;
import com.hereandalways.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class DigitalAssetService {

    private final DigitalAssetRepository assetRepo;
    private final UserRepository userRepo;
    private final FileStorageService fileStorageService; // Hypothetical file storage service


    @Transactional
    public DigitalAsset createAsset(UUID ownerId, String name, String description, 
                                 AssetType type, MultipartFile file) throws IOException {
        User owner = userRepo.findById(ownerId).orElseThrow();
        
        DigitalAsset asset = new DigitalAsset();
        asset.setName(name);
        asset.setDescription(description);
        asset.setAssetType(type);
        asset.setLegacyOwner(owner);
        
        if (file != null && !file.isEmpty()) {
            String secureLink = fileStorageService.storeFile(file);
            asset.setSecureLink(secureLink);
        }
        
        return assetRepo.save(asset);
    }


    /**
     * Get all assets for an owner
     */
    @Transactional(readOnly = true)
    public List<DigitalAsset> getAssetsByOwner(UUID ownerId) {
        return assetRepo.findByLegacyOwnerId(ownerId);
    }

    @Transactional
    public void deleteAsset(UUID assetId, UUID ownerId) throws IOException {
        DigitalAsset asset = assetRepo.findByIdAndLegacyOwnerId(assetId, ownerId)
                                    .orElseThrow();
        
        if (asset.getSecureLink() != null) {
            fileStorageService.deleteFile(asset.getSecureLink());
        }
        
        assetRepo.delete(asset);
    }
}