package com.hereandalways.services;

import com.hereandalways.models.*;
import com.hereandalways.models.enums.TrusteeStatus;
import com.hereandalways.models.enums.UserRole;
import com.hereandalways.repositories.LegacyOwnerTrusteeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class LegacyOwnerTrusteeService {

    private final LegacyOwnerTrusteeRepository relationshipRepo;
    private final UserService userService;

    @Transactional
    public LegacyOwnerTrustee addTrustee(UUID ownerId, UUID trusteeId, String email, String name) {
        User owner = userService.getUserEntityById(ownerId)
                .orElseThrow(() -> new IllegalArgumentException("Legacy owner not found with id: " + ownerId));

        User trustee;

        if (trusteeId != null) {
            trustee = userService.getUserEntityById(trusteeId)
                    .orElseThrow(() -> new IllegalArgumentException("Trustee not found with id: " + trusteeId));
        } else {
            trustee = new User();
            trustee.setExternalTrustee(true);
            trustee.setEmail(email);
            trustee.setName(name); 
            trustee.setRole(UserRole.TRUSTEE);
            trustee.setPasswordHash("changeme"); // random default, ideally hash a random string
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
}
