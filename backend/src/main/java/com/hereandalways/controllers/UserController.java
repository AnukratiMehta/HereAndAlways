package com.hereandalways.controllers;

import com.hereandalways.models.User;
import com.hereandalways.services.UserService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController // handles web requests and automatically serializes return values into JSON or XML
@RequestMapping("/api/users") // Base URL path - All endpoints start with /api/users
@RequiredArgsConstructor // Lombok: Creates constructor with all final dependencies
public class UserController {

  private final UserService userService;

  /**
   * GET /api/users Returns all users in the system
   *
   * <p>Flow: 1. Client makes GET request 2. userService.findAll() retrieves data 3. Spring converts
   * List<User> to JSON 4. Wrapped in 200 OK response
   */
  @GetMapping
  public ResponseEntity<List<User>> getAllUsers() {
    return ResponseEntity.ok(
        userService
            .findAll()); // ResponseEntity: Wraps responses with HTTP status codes and headers
  }

  @GetMapping("/{id}")
  public ResponseEntity<User> getUserById(
      @PathVariable UUID id) { // @PathVariable extracts {id} from URL and converts to UUID
    return ResponseEntity.ok(userService.findById(id));
  }

  @GetMapping("/email/{email}")
  public ResponseEntity<User> getUserByEmail(@PathVariable @Email String email) {
    return ResponseEntity.ok(userService.findByEmail(email));
  }

  @PostMapping
  public ResponseEntity<User> createUser(
      @RequestBody @Valid User user) { // @Valid triggers validation defined in User entity
    return ResponseEntity.ok(userService.create(user));
  }

  @PutMapping("/{id}")
  public ResponseEntity<User> updateUser(
      @PathVariable UUID id,
      @RequestBody @Valid User user) { // @RequestBody deserializes JSON to User object
    return ResponseEntity.ok(userService.update(id, user));
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<Void> deleteUser(@PathVariable UUID id) {
    userService.delete(id);
    return ResponseEntity.noContent().build();
  }

  @PutMapping("/{id}/password")
  public ResponseEntity<Void> updatePassword(
      @PathVariable UUID id, @RequestParam String oldPassword, @RequestParam String newPassword) {
    userService.updatePassword(id, oldPassword, newPassword);
    return ResponseEntity.ok().build();
  }

  @GetMapping("/admins")
  public ResponseEntity<List<User>> getAdminUsers() {
    return ResponseEntity.ok(userService.findAdmins());
  }


}
