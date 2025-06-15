package com.hereandalways.services;

import com.hereandalways.exceptions.ConflictException;
import com.hereandalways.exceptions.NotFoundException;
import com.hereandalways.models.User;
import com.hereandalways.models.enums.UserRole;
import com.hereandalways.repositories.UserRepository;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/*
 * @Transactional ensures all database operations are atomic
 */

@Service
@RequiredArgsConstructor // Lombok: Generates a constructor
public class UserService {

  // Spring automatically injects these dependencies
  private final UserRepository userRepository; // For database operations
  private final PasswordEncoder passwordEncoder; // For password hashing

  // Basic CRUD operations
  @Transactional(readOnly = true) // optimizes for read-only queries
  public List<User> findAll() {
    return userRepository.findAll();
  }

  @Transactional(readOnly = true)
  public User findById(UUID id) {
    return userRepository
        .findById(id)
        .orElseThrow(() -> new NotFoundException("User not found with id: " + id));
  }

  @Transactional(readOnly = true)
  public User findByEmail(String email) {
    return userRepository
        .findByEmail(email)
        .orElseThrow(() -> new NotFoundException("User not found with email: " + email));
  }

  @Transactional
  public User create(User user) {
    // Validate email uniqueness
    if (userRepository.findByEmail(user.getEmail()).isPresent()) {
      throw new ConflictException("Email already in use: " + user.getEmail());
    }

    // Encode password
    user.setPasswordHash(passwordEncoder.encode(user.getPasswordHash()));

    // Set default role if not specified
    if (user.getRole() == null) {
      user.setRole(UserRole.USER);
    }

    // Commit only if all above steps succeed
    return userRepository.save(user);
  }

  @Transactional
  public User update(UUID id, User updatedUser) {
    User existingUser = findById(id);

    // Prevent email changes
    if (!existingUser.getEmail().equals(updatedUser.getEmail())) {
      throw new IllegalArgumentException("Email cannot be changed");
    }

    // Update allowed fields
    existingUser.setName(updatedUser.getName());

    return userRepository.save(existingUser);
  }

  @Transactional
  public void updatePassword(UUID userId, String oldPassword, String newPassword) {
    // 1. Find user
    User user =
        userRepository.findById(userId).orElseThrow(() -> new NotFoundException("User not found"));

    // 2. Verify old password matches
    if (!passwordEncoder.matches(oldPassword, user.getPasswordHash())) {
      throw new SecurityException("Old password is incorrect");
    }

    // 3. Validate new password
    if (newPassword == null || newPassword.isBlank()) {
      throw new IllegalArgumentException("New password cannot be empty");
    }

    // 4. Update password
    user.setPasswordHash(passwordEncoder.encode(newPassword));
    userRepository.save(user);
  }

  // Delete a user

  @Transactional
  public void delete(UUID id) {
    User user = findById(id);
    userRepository.delete(user);
  }

  // Business-specific methods
  @Transactional(readOnly = true)
  public List<User> findAdmins() {
    return userRepository.findByRole(UserRole.ADMIN);
  }

  @Transactional(readOnly = true)
  public List<User> findUsersCreatedAfter(LocalDateTime date) {
    return userRepository.findByCreatedAtAfter(date);
  }

  @Transactional(readOnly = true)
  public boolean isEmailAvailable(String email) {
    return !userRepository.findByEmail(email).isPresent();
  }

  // Relationship management: Gets all trustees for a user
  @Transactional(readOnly = true)
  public List<User> getTrustees(UUID userId) {
    User user = findById(userId);
    return user.getTrustees().stream().map(LegacyOwnerTrustee::getTrustee).toList();
  }
}
