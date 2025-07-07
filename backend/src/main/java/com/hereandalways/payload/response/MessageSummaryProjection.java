package com.hereandalways.payload.response;

import java.util.UUID;

public interface MessageSummaryProjection {
    UUID getId();
    String getSubject();
}
