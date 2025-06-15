package com.hereandalways.models.enums;

public enum RecipientStatus {
  PENDING, // Invitation sent but not registered
  REGISTERED, // Trustee created account with code
  REVOKED // Owner/admin revoked access
}
