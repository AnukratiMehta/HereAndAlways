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

  @Lob
  private String description;

  @Enumerated(EnumType.STRING)
  @Column(name = "asset_type", nullable = false)
  private AssetType assetType;

  @Column(name = "download_url")
  private String downloadUrl; // formerly 'secureLink'

  @Column(name = "encrypted_key", nullable = false)
  private String encryptedKey;

  @Column(name = "file_size")
  private Long fileSize;

  @Column(name = "mime_type")
  private String mimeType;

  @Column(name = "created_at", updatable = false)
  private LocalDateTime createdAt;

  // Ownership
  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(
      name = "legacy_owner_id",
      nullable = false,
      foreignKey = @ForeignKey(name = "fk_digital_asset_owner"))
  private User legacyOwner;

  // Trustee linkage
  @ManyToMany
  @JoinTable(
      name = "asset_trustees",
      joinColumns = @JoinColumn(name = "asset_id"),
      inverseJoinColumns = @JoinColumn(name = "trustee_id")
  )
  private List<User> trustees;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "linked_message_id")
  private Message linkedMessage;

  @PrePersist
  protected void onCreate() {
    this.createdAt = LocalDateTime.now();
  }
}
