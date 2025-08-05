package com.hereandalways.services;

import com.hereandalways.models.User;
import com.hereandalways.payload.request.UserRequest;
import com.hereandalways.payload.response.UserResponse;
import com.hereandalways.repositories.UserRepository;

import org.springframework.transaction.annotation.Transactional;

import com.hereandalways.models.enums.UserRole;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.hereandalways.repositories.MessageRepository;
import com.hereandalways.repositories.DigitalAssetRepository;
import com.hereandalways.repositories.CredentialRepository;


import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final MessageRepository messageRepo;
    private final DigitalAssetRepository assetRepo;
    private final CredentialRepository credentialRepo;




    /** DTO-based create */
    public UserResponse createUser(UserRequest request) {
        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setRole(request.getRole());
        User saved = userRepository.save(user);
        return mapToResponse(saved);
    }

    /** DTO-based update */
    public UserResponse updateUser(UUID id, UserRequest request) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setRole(request.getRole());
        // You can also update password if desired:
        // user.setPasswordHash(passwordEncoder.encode(request.getPassword()));

        User updated = userRepository.save(user);
        return mapToResponse(updated);
    }

    /** DTO-based get */
    public UserResponse getUserById(UUID id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        return mapToResponse(user);
    }

    /** DTO-based get all */
    public List<UserResponse> getAllUsers() {
        return userRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    /** DTO-based delete */
    public void deleteUser(UUID id) {
        userRepository.deleteById(id);
    }

    /** entity-level retrieval for other services */
    public Optional<User> getUserEntityById(UUID id) {
        return userRepository.findById(id);
    }

    /** entity-level save for other services */
    public User saveUserEntity(User user) {
        return userRepository.save(user);
    }

    /** reusable mapper */
    private UserResponse mapToResponse(User user) {
        UserResponse dto = new UserResponse();
        dto.setId(user.getId());
        dto.setName(user.getName());
        dto.setEmail(user.getEmail());
        dto.setRole(user.getRole());
        dto.setCreatedAt(user.getCreatedAt());
        dto.setUpdatedAt(user.getUpdatedAt());
        return dto;
    }

    @Transactional
public void removeTrusteeFromMessage(UUID trusteeId, UUID messageId) {
    var trustee = getUserEntityById(trusteeId)
            .orElseThrow(() -> new IllegalArgumentException("Trustee not found"));
    var message = messageRepo.findById(messageId)
            .orElseThrow(() -> new IllegalArgumentException("Message not found"));
    message.getTrustees().removeIf(t -> t.getId().equals(trusteeId));
    messageRepo.save(message);
}

@Transactional
public void removeTrusteeFromAsset(UUID trusteeId, UUID assetId) {
    var trustee = getUserEntityById(trusteeId)
            .orElseThrow(() -> new IllegalArgumentException("Trustee not found"));
    var asset = assetRepo.findById(assetId)
            .orElseThrow(() -> new IllegalArgumentException("Asset not found"));
    asset.getTrustees().removeIf(t -> t.getId().equals(trusteeId));
    assetRepo.save(asset);
}

  @Transactional(readOnly = true)
public Optional<User> getUserEntityByEmail(String email) {
    if (email == null || email.isBlank()) {
        throw new IllegalArgumentException("Email cannot be empty");
    }
    return userRepository.findByEmail(email);
}

@Transactional
public void addTrusteeToMessage(UUID trusteeId, UUID messageId) {
    var trustee = getUserEntityById(trusteeId)
            .orElseThrow(() -> new IllegalArgumentException("Trustee not found"));
    var message = messageRepo.findById(messageId)
            .orElseThrow(() -> new IllegalArgumentException("Message not found"));
    message.getTrustees().add(trustee);
    messageRepo.save(message);
}

@Transactional
public void addTrusteeToAsset(UUID trusteeId, UUID assetId) {
    var trustee = getUserEntityById(trusteeId)
            .orElseThrow(() -> new IllegalArgumentException("Trustee not found"));
    var asset = assetRepo.findById(assetId)
            .orElseThrow(() -> new IllegalArgumentException("Asset not found"));
    asset.getTrustees().add(trustee);
    assetRepo.save(asset);
}

@Transactional
public void addTrusteeToCredential(UUID trusteeId, UUID credentialId) {
    var trustee = getUserEntityById(trusteeId)
            .orElseThrow(() -> new IllegalArgumentException("Trustee not found"));
    var credential = credentialRepo.findById(credentialId)
            .orElseThrow(() -> new IllegalArgumentException("Credential not found"));
    credential.getLinkedTrustees().add(trustee);
    credentialRepo.save(credential);
}

@Transactional
public void removeTrusteeFromCredential(UUID trusteeId, UUID credentialId) {
    var credential = credentialRepo.findById(credentialId)
            .orElseThrow(() -> new IllegalArgumentException("Credential not found"));
    credential.getLinkedTrustees().removeIf(t -> t.getId().equals(trusteeId));
    credentialRepo.save(credential);
}


}
