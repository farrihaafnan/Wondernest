package com.wondernest.userlearning.dto;

public class RecommendationDto {
    private String activityType;
    private String displayName;
    private String reason;

    public RecommendationDto() {}

    public RecommendationDto(String activityType, String displayName, String reason) {
        this.activityType = activityType;
        this.displayName = displayName;
        this.reason = reason;
    }

    public String getActivityType() {
        return activityType;
    }

    public void setActivityType(String activityType) {
        this.activityType = activityType;
    }

    public String getDisplayName() {
        return displayName;
    }

    public void setDisplayName(String displayName) {
        this.displayName = displayName;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }
} 