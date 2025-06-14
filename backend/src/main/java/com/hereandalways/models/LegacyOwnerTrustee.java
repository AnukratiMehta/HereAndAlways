package com.hereandalways.models;

import jakarta.persistence.*;
import java.util.UUID;         
import java.time.LocalDateTime;
import com.hereandalways.models.enums.TrusteeStatus; 

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
foreignKey = @ForeignKey(name = "fk_legacy_owner")
)
private User legacyOwner;

@ManyToOne(fetch = FetchType.LAZY)
@JoinColumn(
name = "trustee_id", 
nullable = false,
foreignKey = @ForeignKey(name = "fk_trustee")
)
private User trustee;

@PrePersist
protected void onCreate() {
    this.invitedAt = LocalDateTime.now(); // Auto-set invite time
}

// Runs only on updates
@PreUpdate
protected void onUpdate() {
    if (this.status == TrusteeStatus.APPROVED && this.approvedAt == null) { 
        this.approvedAt = LocalDateTime.now();
    }
}

}