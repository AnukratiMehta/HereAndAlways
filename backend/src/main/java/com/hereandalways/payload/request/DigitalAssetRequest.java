package com.hereandalways.payload.request;

import com.hereandalways.models.enums.AssetType;
import lombok.Data;

import java.util.List;
import java.util.UUID;

@Data
public class DigitalAssetRequest {
    private String name;
    private String description;
    private AssetType assetType;
    private String downloadUrl;
    private String encryptedKey;
    private Long fileSize;
    private String mimeType;

    private List<UUID> trusteeIds;   
    private UUID messageId;          
}
