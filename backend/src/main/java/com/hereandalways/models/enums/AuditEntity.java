package com.hereandalways.models.enums;

public enum AuditEntity {
  USER,
  LEGACY_OWNER_TRUSTEE,
  DIGITAL_ASSET,
  MESSAGE,
  DELIVERY_TRIGGER,
  SCHEDULED_JOB,
  DEATH_CONFIRMATION,
  SYSTEM // For non-entity events (e.g., auth)
}
