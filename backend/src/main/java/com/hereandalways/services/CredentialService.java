package com.hereandalways.services;

import com.hereandalways.payload.request.CreateCredentialRequest;
import com.hereandalways.payload.response.CredentialResponse;
import com.hereandalways.models.Credential;
import com.hereandalways.models.User;
import com.hereandalways.models.enums.VaultCategory;
import com.hereandalways.repositories.CredentialRepository;
import com.hereandalways.repositories.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CredentialService {

    private final CredentialRepository credentialRepository;
    private final UserRepository userRepository;

    @Transactional
    public CredentialResponse createCredential(UUID legacyOwnerId, CreateCredentialRequest request) {
        User owner = userRepository.findById(legacyOwnerId)
                .orElseThrow(() -> new RuntimeException("Legacy owner not found"));

        List<User> trustees = request.getTrusteeIds() != null
                ? userRepository.findAllById(request.getTrusteeIds())
                : new ArrayList<>();

        Credential credential = new Credential();
        credential.setLegacyOwner(owner);
        credential.setTitle(request.getTitle());
        credential.setUsernameOrCardNumber(request.getUsernameOrCardNumber());
        credential.setPasswordOrPin(request.getPasswordOrPin()); 
        credential.setEncryptedKey(request.getEncryptedKey());          
        credential.setNotes(request.getNotes());
        credential.setCategory(request.getCategory());
        credential.setLinkedTrustees(trustees);
        credential.setCreatedAt(LocalDateTime.now());
        credential.setUpdatedAt(LocalDateTime.now());

        Credential saved = credentialRepository.save(credential);
        return toResponse(saved);
    }

    public List<CredentialResponse> getAllCredentials(UUID legacyOwnerId) {
        return credentialRepository.findAllByLegacyOwnerId(legacyOwnerId)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public List<CredentialResponse> getByCategory(UUID legacyOwnerId, VaultCategory category) {
        return credentialRepository.findAllByLegacyOwnerIdAndCategory(legacyOwnerId, category)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    private CredentialResponse toResponse(Credential credential) {
    return CredentialResponse.builder()
            .id(credential.getId())
            .title(credential.getTitle())
            .usernameOrCardNumber(credential.getUsernameOrCardNumber())
            .notes(credential.getNotes())
            .category(credential.getCategory())
            .createdAt(credential.getCreatedAt())
            .passwordOrPin(credential.getPasswordOrPin())     
            .encryptedKey(credential.getEncryptedKey())       
            .trusteeIds(
                credential.getLinkedTrustees()
                        .stream()
                        .map(User::getId)
                        .collect(Collectors.toList())
            )
            .build();
}


    private String encrypt(String input) {
        // 🔐 Temporary simple Base64 for demo — replace with AES or secure solution
        return Base64.getEncoder().encodeToString(input.getBytes(StandardCharsets.UTF_8));
    }

    public Optional<Credential> getCredentialById(UUID credentialId) {
        return credentialRepository.findById(credentialId);
    }

    @Transactional
public void deleteCredential(UUID credentialId) {
    Credential credential = credentialRepository.findById(credentialId)
            .orElseThrow(() -> new RuntimeException("Credential not found"));

    credentialRepository.delete(credential);
}

@Transactional
public CredentialResponse updateCredential(UUID credentialId, UUID ownerId, CreateCredentialRequest request) {
    Credential credential = credentialRepository.findById(credentialId)
            .orElseThrow(() -> new RuntimeException("Credential not found"));

    if (!credential.getLegacyOwner().getId().equals(ownerId)) {
        throw new RuntimeException("Unauthorized: Credential does not belong to owner");
    }

    credential.setTitle(request.getTitle());
    credential.setUsernameOrCardNumber(request.getUsernameOrCardNumber());
    credential.setNotes(request.getNotes());
    credential.setCategory(request.getCategory());
    credential.setUpdatedAt(LocalDateTime.now());

    // Only update password and key if provided
    if (request.getPasswordOrPin() != null && !request.getPasswordOrPin().isBlank()) {
        credential.setPasswordOrPin(request.getPasswordOrPin());
    }

    if (request.getEncryptedKey() != null && !request.getEncryptedKey().isBlank()) {
        credential.setEncryptedKey(request.getEncryptedKey());
    }

    // Update trustees
    List<User> trustees = request.getTrusteeIds() != null
            ? userRepository.findAllById(request.getTrusteeIds())
            : new ArrayList<>();
    credential.setLinkedTrustees(trustees);

    Credential saved = credentialRepository.save(credential);
    return toResponse(saved);
}


    
}
