package com.wondernest.userlearning.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "screen_time_logs")
public class ScreenTimeLog {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(name = "child_id", nullable = false)
    private UUID childId;

    @Column(name = "activity_type", nullable = false)
    private String activityType;

    @Column(name = "screen_time_seconds", nullable = false)
    private Integer screenTimeSeconds;

    @Column(name = "logged_at", insertable = false, updatable = false)
    private LocalDateTime loggedAt;

    // Constructors
    public ScreenTimeLog() {}

    public ScreenTimeLog(UUID childId, String activityType, Integer screenTimeSeconds) {
        this.childId = childId;
        this.activityType = activityType;
        this.screenTimeSeconds = screenTimeSeconds;
    }

    // Getters and Setters
    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public UUID getChildId() {
        return childId;
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

    public LocalDateTime getLoggedAt() {
        return loggedAt;
    }

    public void setLoggedAt(LocalDateTime loggedAt) {
        this.loggedAt = loggedAt;
    }

    @Override
    public String toString() {
        return "ScreenTimeLog{" +
                "id=" + id +
                ", childId=" + childId +
                ", activityType='" + activityType + '\'' +
                ", screenTimeSeconds=" + screenTimeSeconds +
                ", loggedAt=" + loggedAt +
                '}';
    }
}
