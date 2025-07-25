package com.wondernest.userlearning.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Entity
@Table(name = "behavior_flags")
public class BehaviorFlag {
    
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(name = "child_id", nullable = false)
    private UUID childId;

    @Column(name = "activity_type", nullable = false)
    private String activityType;

    @Column(name = "submitted_text", nullable = false, columnDefinition = "TEXT")
    private String submittedText;

    @Column(name = "offensive_words", nullable = false)
    private String offensiveWordsString;

    @Column(name = "flagged_at")
    private LocalDateTime flaggedAt;

    @Column(name = "is_seen", nullable = false)
    private Boolean isSeen = false;

    // Constructors
    public BehaviorFlag() {}

    public BehaviorFlag(UUID childId, String activityType, String submittedText, java.util.List<String> offensiveWords) {
        this.childId = childId;
        this.activityType = activityType;
        this.submittedText = submittedText;
        this.setOffensiveWords(offensiveWords);
        this.flaggedAt = LocalDateTime.now();
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

    public String getSubmittedText() {
        return submittedText;
    }

    public void setSubmittedText(String submittedText) {
        this.submittedText = submittedText;
    }

    public java.util.List<String> getOffensiveWords() {
        if (this.offensiveWordsString == null || this.offensiveWordsString.trim().isEmpty()) {
            return Arrays.asList();
        }
        return Arrays.stream(this.offensiveWordsString.split(","))
                .map(String::trim)
                .filter(s -> !s.isEmpty())
                .collect(Collectors.toList());
    }

    public void setOffensiveWords(java.util.List<String> offensiveWords) {
        if (offensiveWords == null || offensiveWords.isEmpty()) {
            this.offensiveWordsString = "";
        } else {
            this.offensiveWordsString = String.join(",", offensiveWords);
        }
    }

    public LocalDateTime getFlaggedAt() {
        return flaggedAt;
    }

    public void setFlaggedAt(LocalDateTime flaggedAt) {
        this.flaggedAt = flaggedAt;
    }

    public Boolean getIsSeen() {
        return isSeen;
    }

    public void setIsSeen(Boolean isSeen) {
        this.isSeen = isSeen;
    }

    @Override
    public String toString() {
        return "BehaviorFlag{" +
                "id=" + id +
                ", childId=" + childId +
                ", activityType='" + activityType + '\'' +
                ", submittedText='" + submittedText + '\'' +
                ", offensiveWords=" + getOffensiveWords() +
                ", flaggedAt=" + flaggedAt +
                '}';
    }
}
