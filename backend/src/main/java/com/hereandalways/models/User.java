package com.hereandalways.models;

import jakarta.persistence.*;
import java.util.UUID;         
import java.time.LocalDateTime;
import com.hereandalways.models.enums.UserRole;
import java.util.List;
import java.util.ArrayList;
import com.hereandalways.models.LegacyOwnerTrustee;

@Entity
@Table(name = "users")

public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(name = "password_hash", nullable = false)
    private String passwordHash;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private UserRole role;


    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

     
    // JPA lifecycle callbacks

    // Runs only on first save
    @PrePersist
     protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
     }


    // Runs only on updates
     @PreUpdate
     protected void onUpdate() {
        updatedAt = LocalDateTime.now();
     }


    // Relationships

    @OneToMany(mappedBy = "legacyOwner", cascade = CascadeType.ALL, orphanRemoval = true) 
    // cascade = CascadeType.ALL ensures operations (save, delete) propagate to related entities.
    // orphanRemoval = true automatically deletes orphaned LegacyOwnerTrustee records.
    private List<LegacyOwnerTrustee> trustees = new ArrayList<>();

    @OneToMany(mappedBy = "trustee")
    // Cascade and OrphanRemoval not needed here because this is an inverse relationship.
    // We only need it for parents.
    private List<LegacyOwnerTrustee> trustedBy = new ArrayList<>();

}