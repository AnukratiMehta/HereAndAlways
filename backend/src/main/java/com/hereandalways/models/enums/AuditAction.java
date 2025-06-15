package com.hereandalways.models.enums;

public enum AuditAction {
  // User actions
  USER_CREATED,
  USER_UPDATED,
  USER_DELETED,

  // Legacy actions
  TRUSTEE_ADDED,
  TRUSTEE_REMOVED,
  DEATH_CONFIRMED,

  // Message actions
  MESSAGE_ADDED,
  MESSAGE_UPDATED,
  MESSAGE_DELETED,
  MESSAGE_SHARED,

  // Asset actions
  ASSET_UPLOADED,
  ASSET_DELETED,
  ASSET_SHARED,

  // System actions
  LOGIN_SUCCESS,
  LOGIN_FAILED,
  PASSWORD_CHANGED
}
