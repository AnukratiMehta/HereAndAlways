package com.hereandalways.controllers;

import com.hereandalways.models.DigitalAsset;
import com.hereandalways.models.enums.AssetType;
import com.hereandalways.services.DigitalAssetService;
import jakarta.validation.constraints.NotNull;
import java.io.IOException;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/assets")
@RequiredArgsConstructor
public class DigitalAssetController {

  private final DigitalAssetService assetService;

  @PostMapping
  public ResponseEntity<DigitalAsset> createAsset(
      @RequestParam @NotNull UUID ownerId,
      @RequestParam String name,
      @RequestParam(required = false) String description,
      @RequestParam AssetType type,
      @RequestParam(required = false) MultipartFile file)
      throws IOException {

    DigitalAsset asset = assetService.createAsset(ownerId, name, description, type, file);
    return ResponseEntity.ok(asset);
  }

  @GetMapping("/owner/{ownerId}")
  public ResponseEntity<List<DigitalAsset>> getAllAssets(@PathVariable UUID ownerId) {
    return ResponseEntity.ok(assetService.getAssetsByOwner(ownerId));
  }

  @DeleteMapping("/{assetId}")
  public ResponseEntity<Void> deleteAsset(@PathVariable UUID assetId, @RequestParam UUID ownerId)
      throws IOException {
    assetService.deleteAsset(assetId, ownerId);
    return ResponseEntity.noContent().build();
  }
}
