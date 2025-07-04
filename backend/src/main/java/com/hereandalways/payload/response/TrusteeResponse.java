package com.hereandalways.payload.response;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Data
@AllArgsConstructor
public class TrusteeResponse {

    private UUID trusteeId;
    private String trusteeName;
    private String trusteeEmail;
    private String status;
    private LocalDateTime invitedAt;
    private List<String> linkedMessages;
    private List<String> linkedAssets;
}
