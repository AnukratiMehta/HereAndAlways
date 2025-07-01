package com.hereandalways.controllers;

import com.hereandalways.models.LegacyOwnerTrustee;
import com.hereandalways.payload.request.InviteTrusteeRequest;
import com.hereandalways.payload.response.TrusteeResponse;
import com.hereandalways.services.LegacyOwnerTrusteeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/trustees")
@RequiredArgsConstructor
public class LegacyOwnerTrusteeController {

    private final LegacyOwnerTrusteeService legacyOwnerTrusteeService;

    /**
     * Invite or link a trustee to a legacy owner.
     */
    @PostMapping("/{ownerId}")
    public ResponseEntity<TrusteeResponse> addTrustee(
            @PathVariable UUID ownerId,
            @RequestBody InviteTrusteeRequest request
    ) {
        LegacyOwnerTrustee relationship = legacyOwnerTrusteeService.addTrustee(
                ownerId,
                request.getTrusteeId(),
                request.getEmail(),
                request.getName()
        );

        TrusteeResponse response = new TrusteeResponse(
                relationship.getTrustee().getId(),
                relationship.getTrustee().getName(),
                relationship.getTrustee().getEmail(),
                relationship.getStatus().name()
        );

        return ResponseEntity.ok(response);
    }

    /**
     * List all trustees of a given legacy owner
     */
    @GetMapping("/{ownerId}")
    public ResponseEntity<List<TrusteeResponse>> getTrustees(@PathVariable UUID ownerId) {
        List<TrusteeResponse> responses = legacyOwnerTrusteeService.getTrusteesForOwner(ownerId)
                .stream()
                .map(rel -> new TrusteeResponse(
                        rel.getTrustee().getId(),
                        rel.getTrustee().getName(),
                        rel.getTrustee().getEmail(),
                        rel.getStatus().name()
                ))
                .collect(Collectors.toList());

        return ResponseEntity.ok(responses);
    }

    /**
     * Remove a trustee relationship
     */
    @DeleteMapping("/{relationshipId}")
    public ResponseEntity<Void> removeTrustee(@PathVariable UUID relationshipId) {
        legacyOwnerTrusteeService.removeTrustee(relationshipId);
        return ResponseEntity.noContent().build();
    }
}
