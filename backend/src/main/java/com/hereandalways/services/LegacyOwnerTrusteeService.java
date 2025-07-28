package com.hereandalways.services;

import com.hereandalways.models.*;
import com.hereandalways.models.enums.TrusteeStatus;
import com.hereandalways.models.enums.UserRole;
import com.hereandalways.payload.request.TrusteeUpdateRequest;
import com.hereandalways.repositories.LegacyOwnerTrusteeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class LegacyOwnerTrusteeService {

    private final LegacyOwnerTrusteeRepository relationshipRepo;
    private final UserService userService;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    public LegacyOwnerTrustee addTrustee(UUID ownerId, UUID trusteeId, String email, String name) {
        // Additional validation
        if (name == null || name.trim().isEmpty()) {
            throw new IllegalArgumentException("Trustee name is required");
        }

        User owner = userService.getUserEntityById(ownerId)
                .orElseThrow(() -> new IllegalArgumentException("Owner not found with id: " + ownerId));

        User trustee;
        if (trusteeId != null) {
            // Existing trustee
            trustee = userService.getUserEntityById(trusteeId)
                    .orElseThrow(() -> new IllegalArgumentException("Trustee not found with id: " + trusteeId));
        } else {
            // New external trustee
            if (email == null || email.trim().isEmpty()) {
                throw new IllegalArgumentException("Email is required for new trustees");
            }

            if (userService.getUserEntityByEmail(email).isPresent()) {
                throw new IllegalArgumentException("User with this email already exists");
            }

            trustee = new User();
            trustee.setExternalTrustee(true);
            trustee.setEmail(email);
            trustee.setName(name);
            trustee.setRole(UserRole.TRUSTEE);
            trustee.setPasswordHash(passwordEncoder.encode(UUID.randomUUID().toString()));
            trustee = userService.saveUserEntity(trustee);
        }

        LegacyOwnerTrustee relationship = new LegacyOwnerTrustee();
        relationship.setLegacyOwner(owner);
        relationship.setTrustee(trustee);
        relationship.setStatus(TrusteeStatus.PENDING);

        return relationshipRepo.save(relationship);
    }


    @Transactional(readOnly = true)
    public List<LegacyOwnerTrustee> getTrusteesForOwner(UUID ownerId) {
        return relationshipRepo.findByLegacyOwnerId(ownerId);
    }

    @Transactional
    public void removeTrustee(UUID relationshipId) {
        relationshipRepo.deleteById(relationshipId);
    }

    @Transactional(readOnly = true)
public List<LegacyOwnerTrustee> getRecentTrustees(UUID ownerId) {
    return relationshipRepo.findByLegacyOwnerIdOrderByInvitedAtDesc(ownerId);
}

@Transactional
public void updateTrustee(UUID trusteeId, TrusteeUpdateRequest request) {
    User trustee = userService.getUserEntityById(trusteeId)
            .orElseThrow(() -> new IllegalArgumentException("Trustee not found"));

    // Update name/email if changed
    trustee.setName(request.getName());
    trustee.setEmail(request.getEmail());
    userService.saveUserEntity(trustee); // Persist changes

    // Remove selected messages
    if (request.getMessageIdsToRemove() != null) {
        for (UUID messageId : request.getMessageIdsToRemove()) {
            userService.removeTrusteeFromMessage(trusteeId, messageId);
        }
    }

    // Remove selected assets
    if (request.getAssetIdsToRemove() != null) {
    for (UUID assetId : request.getAssetIdsToRemove()) {
        userService.removeTrusteeFromAsset(trusteeId, assetId);
    }
}



}



}
