package com.hereandalways.controllers;

import com.hereandalways.models.LegacyOwnerTrustee;
import com.hereandalways.payload.request.InviteTrusteeRequest;
import com.hereandalways.payload.request.TrusteeUpdateRequest;
import com.hereandalways.payload.response.TrusteeResponse;
import com.hereandalways.payload.response.TrusteeResponse.MessageSummary;
import com.hereandalways.payload.response.TrusteeResponse.AssetSummary;
import com.hereandalways.payload.response.TrusteeResponse.CredentialSummary;
import com.hereandalways.repositories.MessageRepository;
import com.hereandalways.repositories.CredentialRepository;
import com.hereandalways.services.LegacyOwnerTrusteeService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;
@Slf4j
@RestController
@RequestMapping("/api/trustees")
@RequiredArgsConstructor
public class LegacyOwnerTrusteeController {

    private final LegacyOwnerTrusteeService legacyOwnerTrusteeService;
    private final MessageRepository messageRepo;
    private final CredentialRepository credentialRepo;

    @PostMapping("/{ownerId}")
    public ResponseEntity<?> addTrustee(
            @PathVariable UUID ownerId,
            @RequestBody InviteTrusteeRequest request
    ) {
        try {
            // Validate request
            if ((request.getTrusteeId() == null && request.getEmail() == null) || 
                request.getName() == null) {
                return ResponseEntity.badRequest().body(Map.of(
                    "error", "Validation failed",
                    "message", "Either trusteeId or email must be provided, and name is required"
                ));
            }

            var relationship = legacyOwnerTrusteeService.addTrustee(
                    ownerId,
                    request.getTrusteeId(),
                    request.getEmail(),
                    request.getName()
            );

            TrusteeResponse response = new TrusteeResponse(
                    relationship.getTrustee().getId(),
                    relationship.getTrustee().getName(),
                    relationship.getTrustee().getEmail(),
                    relationship.getStatus().name(),
                    relationship.getInvitedAt(),
                    List.of(),
                    List.of(),
                    List.of()
            );

            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of(
                "error", "Invalid request",
                "message", e.getMessage()
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of(
                        "error", "Internal server error",
                        "message", "Failed to process trustee invitation"
                    ));
        }
    }

    @GetMapping("/{ownerId}")
public ResponseEntity<List<TrusteeResponse>> getTrustees(@PathVariable UUID ownerId) {
    var relationships = legacyOwnerTrusteeService.getTrusteesForOwner(ownerId);

    var responses = relationships.stream().map(rel -> {
        var trustee = rel.getTrustee();

        List<CredentialSummary> credentials = credentialRepo.findByLinkedTrustees_Id(trustee.getId())
            .stream()
            .map(c -> new CredentialSummary(c.getId(), c.getTitle(), c.getCategory()))
            .collect(Collectors.toList());

        return new TrusteeResponse(
            trustee.getId(),
            trustee.getName(),
            trustee.getEmail(),
            rel.getStatus().name(),
            rel.getInvitedAt(),
            messageRepo.findMessageSummariesByTrusteeId(trustee.getId())
                .stream()
                .map(m -> new MessageSummary(m.getId(), m.getSubject()))
                .collect(Collectors.toList()),
            trustee.getAssets() != null ? 
                trustee.getAssets().stream()
                    .map(a -> new AssetSummary(a.getId(), a.getName()))
                    .collect(Collectors.toList()) : 
                List.of(),
            credentials 
        );
    }).collect(Collectors.toList());

    return ResponseEntity.ok(responses);
}

    @GetMapping("/recent/{ownerId}")
    public ResponseEntity<List<TrusteeResponse>> getRecentTrustees(@PathVariable UUID ownerId) {
        var relationships = legacyOwnerTrusteeService.getRecentTrustees(ownerId);

        var responses = relationships.stream().map(rel -> {
            var trustee = rel.getTrustee();

            List<MessageSummary> messages = messageRepo
                .findMessageSummariesByTrusteeIdAndOwnerId(trustee.getId(), ownerId)
                .stream()
                .map(m -> new MessageSummary(m.getId(), m.getSubject()))
                .toList();

            List<AssetSummary> assets = trustee.getAssets() != null
                    ? trustee.getAssets().stream()
                        .map(a -> new AssetSummary(a.getId(), a.getName()))
                        .toList()
                    : List.of();

            List<CredentialSummary> credentials = credentialRepo.findByLinkedTrustees_Id(trustee.getId())
        .stream()
        .map(c -> new CredentialSummary(
            c.getId(), 
            c.getTitle(),
            c.getCategory()
        ))
        .toList();

            return new TrusteeResponse(
                    trustee.getId(),
                    trustee.getName(),
                    trustee.getEmail(),
                    rel.getStatus().name(),
                    rel.getInvitedAt(),
                    messages,
                    assets,
                    credentials
            );
        }).toList();

        return ResponseEntity.ok(responses);
    }

    @DeleteMapping("/{relationshipId}")
    public ResponseEntity<Void> removeTrustee(@PathVariable UUID relationshipId) {
        legacyOwnerTrusteeService.removeTrustee(relationshipId);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/update/{trusteeId}")
    public ResponseEntity<Void> updateTrustee(
            @PathVariable UUID trusteeId,
            @RequestBody TrusteeUpdateRequest request
    ) {
        legacyOwnerTrusteeService.updateTrustee(trusteeId, request);
        return ResponseEntity.noContent().build();
    }
}