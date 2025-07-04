package com.hereandalways.models;

import com.hereandalways.models.enums.TrusteeStatus;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Table(name = "legacy_owner_trustee")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class LegacyOwnerTrustee {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "approved_at")
    private LocalDateTime approvedAt;

    @Column(name = "invited_at", updatable = false)
    private LocalDateTime invitedAt;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TrusteeStatus status;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "legacy_owner_id", nullable = false, foreignKey = @ForeignKey(name = "fk_legacy_owner"))
    private User legacyOwner;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "trustee_id", nullable = false, foreignKey = @ForeignKey(name = "fk_trustee"))
    private User trustee;

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
}
