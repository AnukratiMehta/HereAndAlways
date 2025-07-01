package com.hereandalways.payload.request;

import lombok.Data;
import java.util.UUID;

@Data
public class InviteTrusteeRequest {
    private UUID trusteeId; // existing user trustee (optional)
    private String email;   // for inviting an external trustee (optional)
    private String name;

}
