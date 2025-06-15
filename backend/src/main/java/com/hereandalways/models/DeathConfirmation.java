package com.hereandalways.models;

import com.hereandalways.models.enums.ConfirmationStatus;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "death_confirmation")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class DeathConfirmation {

  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  private UUID id;

  @Enumerated(EnumType.STRING)
  @Column(name = "confirmation_status", nullable = false)
  private ConfirmationStatus status = ConfirmationStatus.PENDING;

  @Column(name = "confirmed_at")
  private LocalDateTime confirmedAt;

  // Relationships
  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(
      name = "legacy_owner_id",
      nullable = false,
      foreignKey = @ForeignKey(name = "fk_death_confirmation_owner"))
  private User legacyOwner;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(
      name = "trustee_id",
      nullable = false,
      foreignKey = @ForeignKey(name = "fk_death_confirmation_trustee"))
  private User trustee;

  // Callback
  @PreUpdate
  protected void onUpdate() {
    if (this.status == ConfirmationStatus.CONFIRMED && this.confirmedAt == null) {
      this.confirmedAt = LocalDateTime.now();
    }
  }
}
