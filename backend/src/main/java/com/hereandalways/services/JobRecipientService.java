package com.hereandalways.services;

import com.hereandalways.models.*;
import com.hereandalways.repositories.*;
import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class JobRecipientService {
  private final JobRecipientRepository recipientRepo;
  private final UserRepository userRepo;

  @Transactional
  public void claimAccessGrant(String accessCode, UUID trusteeId) {
    JobRecipient recipient =
        recipientRepo
            .findByAccessCode(accessCode)
            .orElseThrow(() -> new IllegalArgumentException("Invalid access code"));

    if (recipient.getStatus() != RecipientStatus.PENDING) {
      throw new IllegalStateException("Access already claimed");
    }

    User trustee =
        userRepo
            .findById(trusteeId)
            .orElseThrow(() -> new IllegalArgumentException("Invalid trustee"));

    recipient.setTrustee(trustee);
    recipient.setStatus(RecipientStatus.REGISTERED);
    recipient.setAccessRegisteredAt(LocalDateTime.now());
  }

  @Transactional(readOnly = true)
  public Optional<JobRecipient> validateAccessCode(String accessCode) {
    return recipientRepo
        .findByAccessCode(accessCode)
        .filter(recipient -> recipient.getStatus() == RecipientStatus.PENDING);
  }

  @Transactional
  public void revokeAccess(UUID recipientId) {
    JobRecipient recipient =
        recipientRepo
            .findById(recipientId)
            .orElseThrow(() -> new IllegalArgumentException("Recipient not found"));
    recipient.setStatus(RecipientStatus.REVOKED);
  }
}
