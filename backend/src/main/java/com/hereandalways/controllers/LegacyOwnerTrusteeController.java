package com.hereandalways.controllers;

import com.hereandalways.models.LegacyOwnerTrustee;
import com.hereandalways.payload.request.InviteTrusteeRequest;
import com.hereandalways.payload.request.TrusteeUpdateRequest;
import com.hereandalways.payload.response.TrusteeResponse;
import com.hereandalways.payload.response.TrusteeResponse.MessageSummary;
import com.hereandalways.payload.response.TrusteeResponse.AssetSummary;
import com.hereandalways.repositories.MessageRepository;
import com.hereandalways.services.LegacyOwnerTrusteeService;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/trustees")
@RequiredArgsConstructor
public class LegacyOwnerTrusteeController {

    private final LegacyOwnerTrusteeService legacyOwnerTrusteeService;
    private final MessageRepository messageRepo;

    @PostMapping("/{ownerId}")
    public ResponseEntity<TrusteeResponse> addTrustee(
            @PathVariable UUID ownerId,
            @RequestBody InviteTrusteeRequest request
    ) {
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
                List.of()
        );

        return ResponseEntity.ok(response);
    }

    @GetMapping("/{ownerId}")
    public ResponseEntity<List<TrusteeResponse>> getTrustees(@PathVariable UUID ownerId) {
        var relationships = legacyOwnerTrusteeService.getTrusteesForOwner(ownerId);

        var responses = relationships.stream().map(rel -> {
            var trustee = rel.getTrustee();

            List<MessageSummary> messages = messageRepo.findMessageSummariesByTrusteeId(trustee.getId())
                    .stream()
                    .map(m -> new MessageSummary(m.getId(), m.getSubject()))
                    .toList();

            List<AssetSummary> assets = trustee.getAssets() != null
                    ? trustee.getAssets().stream()
                        .map(a -> new AssetSummary(a.getId(), a.getName()))
                        .toList()
                    : List.of();

            return new TrusteeResponse(
                    trustee.getId(),
                    trustee.getName(),
                    trustee.getEmail(),
                    rel.getStatus().name(),
                    rel.getInvitedAt(),
                    messages,
                    assets
            );
        }).toList();

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

        return new TrusteeResponse(
                trustee.getId(),
                trustee.getName(),
                trustee.getEmail(),
                rel.getStatus().name(),
                rel.getInvitedAt(),
                messages,
                assets
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
