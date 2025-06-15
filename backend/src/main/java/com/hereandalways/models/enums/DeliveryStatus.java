package com.hereandalways.models.enums;

public enum DeliveryStatus {
  DRAFT, // Message not yet scheduled
  QUEUED, // Scheduled for delivery
  SENT, // Successfully delivered
  FAILED // Delivery attempt failed
}
