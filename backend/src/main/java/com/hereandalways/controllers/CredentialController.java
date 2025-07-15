package com.hereandalways.controllers;

import com.hereandalways.payload.request.CreateCredentialRequest;
import com.hereandalways.payload.response.CredentialResponse;
import com.hereandalways.models.enums.VaultCategory;
import com.hereandalways.services.CredentialService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/credentials")
@RequiredArgsConstructor
public class CredentialController {

    private final CredentialService credentialService;

    /**
     * Create a new credential
     */
    @PostMapping
    public ResponseEntity<CredentialResponse> createCredential(
            @RequestParam UUID ownerId,
            @RequestBody CreateCredentialRequest request
    ) {
        CredentialResponse created = credentialService.createCredential(ownerId, request);
        return ResponseEntity.ok(created);
    }

    /**
     * Get all credentials for a specific legacy owner
     */
    @GetMapping
    public ResponseEntity<List<CredentialResponse>> getAllCredentials(
            @RequestParam UUID ownerId
    ) {
        List<CredentialResponse> credentials = credentialService.getAllCredentials(ownerId);
        return ResponseEntity.ok(credentials);
    }

    /**
     * Optional: Filter credentials by category (e.g. BANK, SOCIAL)
     */
    @GetMapping("/filter")
    public ResponseEntity<List<CredentialResponse>> getByCategory(
            @RequestParam UUID ownerId,
            @RequestParam VaultCategory category
    ) {
        List<CredentialResponse> filtered = credentialService.getByCategory(ownerId, category);
        return ResponseEntity.ok(filtered);
    }

    @DeleteMapping("/{credentialId}")
public ResponseEntity<Void> deleteCredential(@PathVariable UUID credentialId) {
    credentialService.deleteCredential(credentialId);
    return ResponseEntity.noContent().build();
}

}
