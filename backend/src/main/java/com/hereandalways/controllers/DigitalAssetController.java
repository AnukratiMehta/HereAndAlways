package com.hereandalways.controllers;

import com.hereandalways.models.DigitalAsset;
import com.hereandalways.payload.request.DigitalAssetRequest;
import com.hereandalways.payload.response.DigitalAssetResponse;
import com.hereandalways.services.DigitalAssetService;
import com.hereandalways.services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/assets")
@RequiredArgsConstructor
public class DigitalAssetController {

    private final DigitalAssetService assetService;
    private final UserService userService;

    @PostMapping
    public ResponseEntity<DigitalAssetResponse> createAsset(
            @RequestBody DigitalAssetRequest request,
            @RequestParam UUID ownerId
    ) {
        DigitalAssetResponse response = assetService.createAsset(request, ownerId);
        return ResponseEntity.ok(response);
    }

    @PatchMapping("/{id}")
    public ResponseEntity<DigitalAssetResponse> updateAssetMetadata(
            @PathVariable UUID id,
            @RequestBody Map<String, String> updates
    ) {
        Optional<DigitalAsset> updated = assetService.updateAssetMetadata(id, updates);
        return updated.map(DigitalAssetResponse::fromEntity)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping
    public ResponseEntity<List<DigitalAssetResponse>> getAssets(
            @RequestParam(required = false) UUID ownerId,
            @RequestParam(required = false) UUID messageId,
            @RequestParam(required = false) UUID trusteeId) {
        
        List<DigitalAsset> assets;
        if (messageId != null) {
            assets = assetService.getAssetsByMessage(messageId);
        } else if (trusteeId != null) {
            assets = assetService.getAssetsByTrustee(trusteeId);
        } else if (ownerId != null) {
            assets = assetService.getAssetsByOwner(ownerId);
        } else {
            return ResponseEntity.badRequest().build();
        }
        
        List<DigitalAssetResponse> responses = assets.stream()
                .map(DigitalAssetResponse::fromEntity)
                .toList();
        return ResponseEntity.ok(responses);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAsset(@PathVariable UUID id) {
        assetService.deleteAsset(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<DigitalAssetResponse> updateAsset(
            @PathVariable UUID id,
            @RequestBody DigitalAssetRequest request
    ) {
        Optional<DigitalAssetResponse> updated = assetService.updateAsset(id, request);
        return updated.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
}