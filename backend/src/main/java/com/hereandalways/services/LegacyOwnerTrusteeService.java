package com.hereandalways.services;

import com.hereandalways.models.*;
import com.hereandalways.repositories.LegacyOwnerTrusteeRepository;
import com.hereandalways.repositories.UserRepository;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class LegacyOwnerTrusteeService {

  private final LegacyOwnerTrusteeRepository relationshipRepo;
  private final UserRepository userRepo;

  @Transactional
  public LegacyOwnerTrustee addTrustee(UUID ownerId, UUID trusteeId, String email) {
    User owner = userRepo.findById(ownerId).orElseThrow();
    User trustee;

    if (trusteeId != null) {
      trustee = userRepo.findById(trusteeId).orElseThrow();
    } else {
      // Create external trustee record
      trustee = new User();
      trustee.setExternal(true);
      trustee.setContactEmail(email);
      trustee.setRole(UserRole.TRUSTEE);
      trustee = userRepo.save(trustee);
    }

    LegacyOwnerTrustee relationship = new LegacyOwnerTrustee();
    relationship.setLegacyOwner(owner);
    relationship.setTrustee(trustee);

    return relationshipRepo.save(relationship);
  }

  /** Get all trustees for an owner */
  @Transactional(readOnly = true)
  public List<LegacyOwnerTrustee> getTrusteesForOwner(UUID ownerId) {
    return relationshipRepo.findByLegacyOwnerId(ownerId);
  }

  /** Remove a trustee relationship */
  @Transactional
  public void removeTrustee(UUID relationshipId) {
    relationshipRepo.deleteById(relationshipId);
  }
}
