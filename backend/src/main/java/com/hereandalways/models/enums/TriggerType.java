package com.hereandalways.models.enums;

public enum TriggerType {
  DATE, // Scheduled for specific date
  INACTIVITY, // Triggered after account inactivity
  MANUAL, // Manually activated by admin
  DEATH_CONFIRMED // Activated after death verification
}
