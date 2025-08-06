package com.hereandalways.services;

import com.hereandalways.models.*;
import com.hereandalways.models.enums.TrusteeStatus;
import com.hereandalways.models.enums.UserRole;
import com.hereandalways.payload.request.TrusteeUpdateRequest;
import com.hereandalways.repositories.LegacyOwnerTrusteeRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Slf4j
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


    public List<LegacyOwnerTrustee> getTrusteesForOwner(UUID ownerId) {
    List<LegacyOwnerTrustee> relationships = relationshipRepo.findByLegacyOwnerId(ownerId);
    
    relationships.forEach(rel -> {
        log.info("Trustee ID: {}", rel.getTrustee().getId());
        log.info("Credentials count via JPA: {}", rel.getTrustee().getCredentials().size());
    });
    
    return relationships;
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
    log.info("🔄 Updating trustee {} with request: {}", trusteeId, request);

    User trustee = userService.getUserEntityById(trusteeId)
            .orElseThrow(() -> new IllegalArgumentException("Trustee not found"));

    // Update name/email
    trustee.setName(request.getName());
    trustee.setEmail(request.getEmail());
    userService.saveUserEntity(trustee);

    // === REMOVALS ===
    if (request.getMessageIdsToRemove() != null) {
        for (UUID messageId : request.getMessageIdsToRemove()) {
            if (messageId != null) {
                log.debug("⛔ Removing trustee from message {}", messageId);
                userService.removeTrusteeFromMessage(trusteeId, messageId);
            }
        }
    }

    if (request.getAssetIdsToRemove() != null) {
        for (UUID assetId : request.getAssetIdsToRemove()) {
            if (assetId != null) {
                log.debug("⛔ Removing trustee from asset {}", assetId);
                userService.removeTrusteeFromAsset(trusteeId, assetId);
            }
        }
    }

    if (request.getCredentialIdsToRemove() != null) {
        for (UUID credentialId : request.getCredentialIdsToRemove()) {
            if (credentialId != null) {
                log.debug("⛔ Removing trustee from credential {}", credentialId);
                userService.removeTrusteeFromCredential(trusteeId, credentialId);
            }
        }
    }

    // === ADDITIONS ===
    if (request.getMessageIdsToAdd() != null) {
        for (UUID messageId : request.getMessageIdsToAdd()) {
            if (messageId != null) {
                log.debug("➕ Adding trustee to message {}", messageId);
                userService.addTrusteeToMessage(trusteeId, messageId);
            }
        }
    }

    if (request.getAssetIdsToAdd() != null) {
        for (UUID assetId : request.getAssetIdsToAdd()) {
            if (assetId != null) {
                log.debug("➕ Adding trustee to asset {}", assetId);
                userService.addTrusteeToAsset(trusteeId, assetId);
            }
        }
    }

    if (request.getCredentialIdsToAdd() != null) {
        for (UUID credentialId : request.getCredentialIdsToAdd()) {
            if (credentialId != null) {
                log.debug("➕ Adding trustee to credential {}", credentialId);
                userService.addTrusteeToCredential(trusteeId, credentialId);
            }
        }
    }

    log.info("✅ Trustee {} update completed", trusteeId);
}

}









