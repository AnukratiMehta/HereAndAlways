package com.hereandalways.models;

import com.hereandalways.models.enums.VaultCategory;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "credentials")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Credential {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "legacy_owner_id", nullable = false, foreignKey = @ForeignKey(name = "fk_credential_owner"))
    private User legacyOwner;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String usernameOrCardNumber;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String passwordOrPin;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String encryptedKey;


    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private VaultCategory category;

    @Column(length = 1000)
    private String notes;

     @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "credential_trustees",
        joinColumns = @JoinColumn(name = "credential_id"),
        inverseJoinColumns = @JoinColumn(name = "trustee_id")
    )
    private List<User> linkedTrustees = new ArrayList<>();

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
