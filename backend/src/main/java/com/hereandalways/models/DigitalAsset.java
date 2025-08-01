package com.hereandalways.models;

import com.hereandalways.models.enums.AssetType;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Table(name = "digital_asset")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class DigitalAsset {

  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  private UUID id;

  @Column(nullable = false)
  private String name;

  @Lob private String description;

  @Enumerated(EnumType.STRING)
  @Column(name = "asset_type", nullable = false)
  private AssetType assetType;

  @Column(name = "secure_link")
  private String secureLink;

  @Column(name = "encrypted_key", nullable = false)
  private String encryptedKey;

  @Column(name = "created_at", updatable = false)
  private LocalDateTime createdAt;

  // Relationships
  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(
      name = "legacy_owner_id",
      nullable = false,
      foreignKey = @ForeignKey(name = "fk_digital_asset_owner"))
  private User legacyOwner;

  @ManyToMany
@JoinTable(
    name = "asset_trustees",
    joinColumns = @JoinColumn(name = "asset_id"),
    inverseJoinColumns = @JoinColumn(name = "trustee_id")
)
private List<User> trustees;


  // Callback
  @PrePersist
  protected void onCreate() {
    this.createdAt = LocalDateTime.now();
  }
}
