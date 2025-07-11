package com.hereandalways.controllers;

import com.hereandalways.models.DigitalAsset;
import com.hereandalways.models.User;
import com.hereandalways.services.DigitalAssetService;
import com.hereandalways.services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/assets")
@RequiredArgsConstructor
public class DigitalAssetController {

  private final DigitalAssetService assetService;
  private final UserService userService;

  @PostMapping
  public ResponseEntity<DigitalAsset> createAsset(
      @RequestBody DigitalAsset asset,
      @RequestParam UUID ownerId
  ) {
    DigitalAsset saved = assetService.saveAsset(asset, ownerId);
    return ResponseEntity.ok(saved);
  }

  @GetMapping
  public ResponseEntity<List<DigitalAsset>> getAssetsByOwner(@RequestParam UUID ownerId) {
    return ResponseEntity.ok(assetService.getAssetsByOwner(ownerId));
  }

  @GetMapping("/trustee/{trusteeId}")
  public ResponseEntity<List<DigitalAsset>> getAssetsByTrustee(@PathVariable UUID trusteeId) {
    return ResponseEntity.ok(assetService.getAssetsByTrustee(trusteeId));
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<Void> deleteAsset(@PathVariable UUID id) {
    assetService.deleteAsset(id);
    return ResponseEntity.noContent().build();
  }
}
