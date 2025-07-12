package com.hereandalways.controllers;

import com.hereandalways.models.DigitalAsset;
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
    @RequestBody DigitalAsset asset,
    @RequestParam UUID ownerId
) {
    DigitalAsset saved = assetService.saveAsset(asset, ownerId);
    return ResponseEntity.ok(DigitalAssetResponse.fromEntity(saved));
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
public ResponseEntity<List<DigitalAssetResponse>> getAssetsByOwner(@RequestParam UUID ownerId) {
  List<DigitalAssetResponse> assets = assetService.getAssetsByOwner(ownerId).stream()
      .map(DigitalAssetResponse::fromEntity)
      .toList();
  return ResponseEntity.ok(assets);
}

@GetMapping("/trustee/{trusteeId}")
public ResponseEntity<List<DigitalAssetResponse>> getAssetsByTrustee(@PathVariable UUID trusteeId) {
  List<DigitalAssetResponse> assets = assetService.getAssetsByTrustee(trusteeId).stream()
      .map(DigitalAssetResponse::fromEntity)
      .toList();
  return ResponseEntity.ok(assets);
}

  @DeleteMapping("/{id}")
  public ResponseEntity<Void> deleteAsset(@PathVariable UUID id) {
    assetService.deleteAsset(id);
    return ResponseEntity.noContent().build();
  }
}