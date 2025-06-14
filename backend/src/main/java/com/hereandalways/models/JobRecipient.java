package com.hereandalways.models;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.UUID;
import com.hereandalways.models.enums.DeliveryStatus;

@Entity
@Table(name = "job_recipient")
public class JobRecipient {
    @Id 
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "access_code", unique = true, length = 36)
    private String accessCode;

    @Column(name = "access_created_at", updatable = false)
    private LocalDateTime accessCreatedAt = LocalDateTime.now();

    @Column(name = "access_registered_at")
    private LocalDateTime accessRegisteredAt;

    @Enumerated(EnumType.STRING)
    private RecipientStatus status = RecipientStatus.PENDING;

    @Column(name = "scheduled_delivery_time")
    private LocalDateTime scheduledDeliveryTime; // Per trustee timing

    // Relationships

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "job_id", nullable = false)
    private ScheduledJob job;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "trustee_id")
    private User trustee; // Null until registration

    //  Callback

    @PrePersist
    @PreUpdate
    protected void ensureAccessCode() {
    if (this.accessCode == null) {
        this.accessCode = UUID.randomUUID().toString();
    }
    }

    // Constructor

    public JobRecipient() {}
}