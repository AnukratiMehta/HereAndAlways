// // Table Message {
//   id UUID [pk]
//   legacy_owner_id UUID [ref: > User.id]
//   trustee_id UUID [ref: > User.id]
//   subject VARCHAR
//   body TEXT
//   delivery_status VARCHAR [note: 'DRAFT, QUEUED, SENT']
//   created_at TIMESTAMP
//   scheduled_delivery TIMESTAMP
// }

package com.hereandalways.models;

import jakarta.persistence.*;
import java.util.UUID;

@Entity
@Table(name = "messages")
public class Message {

  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  private UUID id;
}
