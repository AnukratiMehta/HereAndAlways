package com.hereandalways.payload.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import java.util.UUID;

@Data
@AllArgsConstructor
public class TrusteeResponse {
    private UUID trusteeId;
    private String trusteeName;
    private String trusteeEmail;
    private String status;
}
