package com.hereandalways.repositories;

import com.hereandalways.models.Message;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MessageRepository extends JpaRepository<Message, UUID> {
  // Inherits CRUD methods like save(), findById(), delete(), etc.

}
