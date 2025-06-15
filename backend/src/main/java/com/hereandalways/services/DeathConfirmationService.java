package com.hereandalways.services;

import com.hereandalways.models.*;
import com.hereandalways.models.enums.ConfirmationStatus;
import com.hereandalways.repositories.DeathConfirmationRepository;
import com.hereandalways.repositories.UserRepository;
import java.time.LocalDateTime;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class DeathConfirmationService {

  private final DeathConfirmationRepository confirmationRepo;
  private final UserRepository userRepo;
  private final ScheduledJobService scheduledJobService;

  @Transactional
  public DeathConfirmation createConfirmationRequest(UUID legacyOwnerId, UUID trusteeId) {
    User legacyOwner =
        userRepo
            .findById(legacyOwnerId)
            .orElseThrow(() -> new IllegalArgumentException("Invalid legacy owner ID"));

    User trustee =
        userRepo
            .findById(trusteeId)
            .orElseThrow(() -> new IllegalArgumentException("Invalid trustee ID"));

    DeathConfirmation confirmation = new DeathConfirmation();
    confirmation.setLegacyOwner(legacyOwner);
    confirmation.setTrustee(trustee);
    confirmation.setStatus(ConfirmationStatus.PENDING);

    return confirmationRepo.save(confirmation);
  }

  /** Trustee confirms a death */
  @Transactional
  public void confirmDeath(UUID confirmationId, UUID trusteeId) {
    DeathConfirmation confirmation =
        confirmationRepo
            .findById(confirmationId)
            .orElseThrow(() -> new IllegalArgumentException("Confirmation not found"));

    if (!confirmation.getTrustee().getId().equals(trusteeId)) {
      throw new SecurityException("Only the designated trustee can confirm");
    }

    confirmation.setStatus(ConfirmationStatus.CONFIRMED);
    confirmationRepo.save(confirmation);

    // Trigger any scheduled jobs
    scheduledJobService.processDeathConfirmation(
        confirmation.getLegacyOwner().getId(), LocalDateTime.now());
  }

  /** Trustee rejects a death confirmation */
  @Transactional
  public void rejectDeathConfirmation(UUID confirmationId, UUID trusteeId) {
    DeathConfirmation confirmation =
        confirmationRepo
            .findById(confirmationId)
            .orElseThrow(() -> new IllegalArgumentException("Confirmation not found"));

    if (!confirmation.getTrustee().getId().equals(trusteeId)) {
      throw new SecurityException("Only the designated trustee can reject");
    }

    confirmation.setStatus(ConfirmationStatus.REJECTED);
    confirmationRepo.save(confirmation);
  }

  /** Gets the current confirmation status for a legacy owner */
  @Transactional(readOnly = true)
  public DeathConfirmation getCurrentConfirmation(UUID legacyOwnerId) {
    return confirmationRepo
        .findFirstByLegacyOwnerIdOrderByConfirmedAtDesc(legacyOwnerId)
        .orElse(null);
  }
}
