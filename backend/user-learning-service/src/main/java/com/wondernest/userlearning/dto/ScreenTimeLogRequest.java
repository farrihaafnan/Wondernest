package com.wondernest.userlearning.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.UUID;

public class ScreenTimeLogRequest {
    private UUID childId;
    private String activityType;
    private Integer screenTimeSeconds;

    // Constructors
    public ScreenTimeLogRequest() {}

    public ScreenTimeLogRequest(UUID childId, String activityType, Integer screenTimeSeconds) {
        this.childId = childId;
        this.activityType = activityType;
        this.screenTimeSeconds = screenTimeSeconds;
    }

    // Getters and Setters
    public UUID getChildId() {
        return childId;
    }

    @JsonProperty("childId")
    public void setChildId(String childIdString) {
        if (childIdString != null && !childIdString.isEmpty()) {
            this.childId = UUID.fromString(childIdString);
        }
    }

    public void setChildId(UUID childId) {
        this.childId = childId;
    }

    public String getActivityType() {
        return activityType;
    }

    public void setActivityType(String activityType) {
        this.activityType = activityType;
    }

    public Integer getScreenTimeSeconds() {
        return screenTimeSeconds;
    }

    public void setScreenTimeSeconds(Integer screenTimeSeconds) {
        this.screenTimeSeconds = screenTimeSeconds;
    }

    @Override
    public String toString() {
        return "ScreenTimeLogRequest{" +
                "childId=" + childId +
                ", activityType='" + activityType + '\'' +
                ", screenTimeSeconds=" + screenTimeSeconds +
                '}';
    }
}
