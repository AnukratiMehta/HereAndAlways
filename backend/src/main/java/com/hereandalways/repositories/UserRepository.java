package com.hereandalways.repositories;

import com.hereandalways.models.User;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, UUID> {
  // Inherits CRUD methods like save(), findById(), delete(), etc.

  // Find by exact email match
  Optional<User> findByEmail(String email);

  // Find all admins
  List<User> findByRole(UserRole role);

  // Find users created after a date
  List<User> findByCreatedAtAfter(LocalDateTime date);
}
