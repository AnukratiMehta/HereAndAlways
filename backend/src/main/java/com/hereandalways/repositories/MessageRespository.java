package com.hereandalways.repositories;

import com.hereandalways.models.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.UUID;

public interface MessageRepository extends JpaRepository<Message, UUID> {
    // Inherits CRUD methods like save(), findById(), delete(), etc.

}