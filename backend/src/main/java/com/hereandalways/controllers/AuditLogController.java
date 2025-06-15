package com.hereandalways.controllers;

import com.hereandalways.models.AuditLog;
import com.hereandalways.services.AuditLogService;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.hereandalways.models.enums.AuditEntity;
// import java.time.LocalDateTime;


@RestController
@RequestMapping("/api/audit-logs")
@RequiredArgsConstructor
public class AuditLogController {

  private final AuditLogService auditLogService;

  @GetMapping("/entity")
  public ResponseEntity<List<AuditLog>> getEntityHistory(
      @RequestParam AuditEntity entity, @RequestParam UUID entityId) {
    return ResponseEntity.ok(auditLogService.getEntityAuditHistory(entity, entityId));
  }

  @GetMapping("/user")
  public ResponseEntity<List<AuditLog>> getUserActivity(
      @RequestParam UUID userId, @RequestParam(defaultValue = "50") int limit) {
    return ResponseEntity.ok(auditLogService.getUserActivity(userId, limit));
  }

  // @GetMapping("/date-range")
  // public ResponseEntity<List<AuditLog>> getLogsByDateRange(
  //     @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime start, @RequestParam String end) {
  //   return ResponseEntity.ok(auditLogService.getAuditLogsByDateRange(start, end));
  // }
}
