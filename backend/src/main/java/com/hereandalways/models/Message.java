package com.hereandalways.models;

import com.hereandalways.models.enums.DeliveryStatus;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.UUID;

import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
@Entity
@Table(name = "messages")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Message {

  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  private UUID id;

  @Column(nullable = true)
  private String subject;

  @Lob // For large data, better than TEXT
  @Column(nullable = true)
  private String body;

  @Enumerated(EnumType.STRING)
  @Column(name = "delivery_status", nullable = false)
  private DeliveryStatus deliveryStatus = DeliveryStatus.DRAFT;

  @Column(name = "created_at", updatable = false)
  private LocalDateTime createdAt;

  @Column(name = "scheduled_delivery")
  private LocalDateTime scheduledDelivery;

  @Column(name = "last_accessed_at")
  private LocalDateTime lastAccessedAt;


  // Relationships

  @ManyToOne(fetch = FetchType.LAZY, optional = false)
  @JoinColumn(
      name = "legacy_owner_id",
      nullable = false,
      foreignKey = @ForeignKey(name = "fk_message_legacy_owner"))
  private User legacyOwner;

  @ManyToOne(fetch = FetchType.LAZY, optional = true)
  @JoinColumn(
      name = "trustee_id",
      foreignKey = @ForeignKey(name = "fk_message_trustee"),
      nullable = true)
  private User trustee;

  // Callbacks

  @PrePersist
protected void onCreate() {
    createdAt = LocalDateTime.now();
    lastAccessedAt = createdAt;
}

}
