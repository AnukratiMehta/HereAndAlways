package com.hereandalways.models.enums;

public enum ScheduleType {
    ABSOLUTE,                  // Exact timestamp
    IMMEDIATELY_AFTER_CONFIRMATION,
    RELATIVE_DAYS_AFTER_DEATH,
    RELATIVE_WEEKS_AFTER_DEATH,
    RELATIVE_MONTHS_AFTER_DEATH, 
    RELATIVE_YEARS_AFTER_DEATH,
}