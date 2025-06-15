package com.hereandalways.models;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.UUID;
import com.hereandalways.models.enums.AuditAction;
import com.hereandalways.models.enums.AuditEntity;

import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Table(name = "audit_log")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AuditLog {

  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  private UUID id;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false)
  private AuditAction action;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false)
  private AuditEntity entity;

  @Column(name = "entity_id", nullable = false)
  private UUID entityId;

  @Column(nullable = false)
  private LocalDateTime timestamp;

  @Column(columnDefinition = "JSONB")
  private String metadata; // Additional context as JSON

  // Relationships
  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "user_id", foreignKey = @ForeignKey(name = "fk_audit_log_user"))
  private User user;
}
