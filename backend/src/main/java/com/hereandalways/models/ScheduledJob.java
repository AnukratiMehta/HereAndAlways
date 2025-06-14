package com.hereandalways.models;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.UUID;
import com.hereandalways.models.enums.JobStatus;
import com.hereandalways.models.enums.JobType;


@Entity
@Table(name = "scheduled_job")
public class ScheduledJob {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Enumerated(EnumType.STRING)
    @Column(name = "job_type", nullable = false)
    private JobType jobType;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private JobStatus status = JobStatus.PENDING;

    @Column(name = "scheduled_for", nullable = false)
    private LocalDateTime scheduledFor;

    @Column(name = "executed_at")
    private LocalDateTime executedAt;

    @Column(name = "error_message", columnDefinition = "TEXT")
    private String errorMessage;

    // Relationships
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(
        name = "legacy_owner_id",
        nullable = false,
        foreignKey = @ForeignKey(name = "fk_scheduled_job_owner")
    )
    private User legacyOwner;

    // Callback
    @PreUpdate
    protected void onUpdate() {
        if (this.status == JobStatus.COMPLETED && this.executedAt == null) {
            this.executedAt = LocalDateTime.now();
        }
    }

    // Constructors
    public ScheduledJob() {}

}