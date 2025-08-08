package com.hereandalways.models;

import com.hereandalways.models.enums.TriggerType;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.UUID;

import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Table(name = "delivery_trigger")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class DeliveryTrigger {

  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  private UUID id;

  @Enumerated(EnumType.STRING)
  @Column(name = "trigger_type", nullable = false)
  private TriggerType triggerType;


  @Column(name = "trigger_config", columnDefinition = "JSONB") 
  private String triggerConfig; 

  @Column(name = "is_active", nullable = false)
  private Boolean isActive = true;

  @Column(name = "created_at", updatable = false)
  private LocalDateTime createdAt;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(
      name = "legacy_owner_id",
      nullable = false,
      foreignKey = @ForeignKey(name = "fk_delivery_trigger_owner"))
  private User legacyOwner;

  @PrePersist
  protected void onCreate() {
    this.createdAt = LocalDateTime.now();
  }
}
