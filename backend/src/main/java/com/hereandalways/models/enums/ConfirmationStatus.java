package com.hereandalways.models.enums;

public enum ConfirmationStatus {
  PENDING, // Awaiting trustee response
  CONFIRMED, // Trustee verified death
  REJECTED // Trustee denied confirmation
}
