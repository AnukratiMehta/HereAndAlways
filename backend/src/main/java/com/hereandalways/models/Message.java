package com.hereandalways.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.hereandalways.models.enums.DeliveryStatus;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
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

    @Lob
@Basic(fetch = FetchType.LAZY)
@Column
@JsonIgnore
private String body;


    @Enumerated(EnumType.STRING)
@Column(nullable = false, columnDefinition = "VARCHAR(20)")
private DeliveryStatus deliveryStatus; 

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "scheduled_delivery")
    private LocalDateTime scheduledDelivery;

    @Column(name = "last_accessed_at")
    private LocalDateTime lastAccessedAt;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "legacy_owner_id", nullable = false)
    private User legacyOwner;

    @ManyToMany
    @JoinTable(
        name = "message_trustees",
        joinColumns = @JoinColumn(name = "message_id"),
        inverseJoinColumns = @JoinColumn(name = "trustee_id")
    )
    private List<User> trustees;

    // Message.java
@ManyToMany(mappedBy = "linkedMessages")
private Set<DigitalAsset> linkedAssets = new HashSet<>();

// Helper methods for bidirectional sync
public void addAsset(DigitalAsset asset) {
    this.linkedAssets.add(asset);
    asset.getLinkedMessages().add(this);
}

public void removeAsset(DigitalAsset asset) {
    this.linkedAssets.remove(asset);
    asset.getLinkedMessages().remove(this);
}

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        if (lastAccessedAt == null) {
            lastAccessedAt = createdAt;
        }
    }
}
