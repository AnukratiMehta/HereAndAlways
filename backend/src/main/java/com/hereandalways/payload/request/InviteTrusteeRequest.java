package com.hereandalways.payload.request;

import lombok.Data;
import java.util.UUID;

@Data
public class InviteTrusteeRequest {
    private UUID trusteeId; 
    private String email;   
    private String name;

}
