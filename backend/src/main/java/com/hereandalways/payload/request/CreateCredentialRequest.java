package com.hereandalways.payload.request;

import java.util.List;

import com.hereandalways.models.enums.VaultCategory;

import lombok.Data;

import java.util.UUID;


@Data
public class CreateCredentialRequest {
    private String title;
    private String usernameOrCardNumber;
    private String passwordOrPin;
    private String notes;
    private VaultCategory category;
    private List<UUID> trusteeIds;
    private String encryptedKey;

}

