package com.hereandalways.models;

import com.hereandalways.models.enums.JobStatus;
import com.hereandalways.models.enums.JobType;
import com.hereandalways.models.enums.ScheduleType;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "scheduled_job")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
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

  @Column(name = "entity_id", nullable = false)
  private UUID entityId; // Links to Message or DigitalAsset id

  @Column(name = "scheduled_for", nullable = false)
  private LocalDateTime scheduledFor;

  @Column(name = "executed_at")
  private LocalDateTime executedAt;

  @Column(name = "error_message", columnDefinition = "TEXT")
  private String errorMessage;

  @Enumerated(EnumType.STRING)
  @Column(name = "schedule_type", nullable = false)
  private ScheduleType scheduleType;

  @Column(name = "time_offset")
  private Integer timeOffset; // Replaces yearsOffset

  // Relationships
  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(
      name = "legacy_owner_id",
      nullable = false,
      foreignKey = @ForeignKey(name = "fk_scheduled_job_owner"))
  private User legacyOwner;

  @OneToMany(mappedBy = "job", cascade = CascadeType.ALL, orphanRemoval = true)
  private List<JobRecipient> recipients = new ArrayList<>();

  // Callback
  @PreUpdate
  protected void onUpdate() {
    if (this.status == JobStatus.COMPLETED && this.executedAt == null) {
      this.executedAt = LocalDateTime.now();
    }
  }

  // Helper methods
  public void addRecipient(User trustee, LocalDateTime deliveryTime) {
    JobRecipient recipient = new JobRecipient();
    recipient.setJob(this);
    recipient.setTrustee(trustee);
    recipient.setScheduledDeliveryTime(deliveryTime);
    recipients.add(recipient);
  }

  public void calculateDeliveryTime(LocalDateTime triggerDate) {
    switch (this.scheduleType) {
      case RELATIVE_DAYS_AFTER_DEATH:
      case RELATIVE_DAYS_AFTER_INACTIVITY:
        this.scheduledFor = triggerDate.plusDays(timeOffset);
        break;

      case RELATIVE_WEEKS_AFTER_INACTIVITY:
        this.scheduledFor = triggerDate.plusWeeks(timeOffset);
        break;

      case RELATIVE_MONTHS_AFTER_DEATH:
        this.scheduledFor = triggerDate.plusMonths(timeOffset);
        break;

      case RELATIVE_YEARS_AFTER_DEATH:
        this.scheduledFor = triggerDate.plusYears(timeOffset);
        break;

      case ABSOLUTE:
        // No calculation needed
        break;
    }
  }
}
