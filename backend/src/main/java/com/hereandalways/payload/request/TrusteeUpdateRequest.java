package com.hereandalways.payload.request;

import lombok.Data;

import java.util.List;
import java.util.UUID;

@Data
public class TrusteeUpdateRequest {
    private String name;
    private String email;
    private List<UUID> messageIdsToRemove;
    private List<UUID> assetIdsToRemove;
}
