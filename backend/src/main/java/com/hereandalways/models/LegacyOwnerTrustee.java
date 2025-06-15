package com.hereandalways.models;

import com.hereandalways.models.enums.TrusteeStatus;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "legacy_owner_trustee")
public class LegacyOwnerTrustee {

  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  private UUID id;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false)
  private TrusteeStatus status;

  @Column(name = "invited_at", updatable = false)
  private LocalDateTime invitedAt;

  @Column(name = "approved_at")
  private LocalDateTime approvedAt;

  // Relationships

  @ManyToOne(fetch = FetchType.LAZY) // Optimizes performance
  @JoinColumn(
      name = "legacy_owner_id",
      nullable = false,
      foreignKey = @ForeignKey(name = "fk_legacy_owner"))
  private User legacyOwner;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "trustee_id", nullable = false, foreignKey = @ForeignKey(name = "fk_trustee"))
  private User trustee;

  // Callbacks

  @PrePersist
  protected void onCreate() {
    this.invitedAt = LocalDateTime.now();
  }

  @PreUpdate
  protected void onUpdate() {
    if (this.status == TrusteeStatus.APPROVED && this.approvedAt == null) {
      this.approvedAt = LocalDateTime.now();
    }
  }

  //   Constructor

  public LegacyOwnerTrustee() {}
}
