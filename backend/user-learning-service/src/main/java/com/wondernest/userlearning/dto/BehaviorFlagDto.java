package com.wondernest.userlearning.dto;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public class BehaviorFlagDto {
    private UUID id;
    private UUID childId;
    private String childName;
    private String activityType;
    private String submittedText;
    private List<String> offensiveWords;
    private LocalDateTime flaggedAt;
    private Boolean isSeen;
    private String displayActivityType;

    // Constructors
    public BehaviorFlagDto() {}

    public BehaviorFlagDto(UUID id, UUID childId, String activityType, String submittedText, 
                          List<String> offensiveWords, LocalDateTime flaggedAt) {
        this(id, childId, null, activityType, submittedText, offensiveWords, flaggedAt, false);
    }

    public BehaviorFlagDto(UUID id, UUID childId, String activityType, String submittedText, 
                          List<String> offensiveWords, LocalDateTime flaggedAt, Boolean isSeen) {
        this(id, childId, null, activityType, submittedText, offensiveWords, flaggedAt, isSeen);
    }

    public BehaviorFlagDto(UUID id, UUID childId, String childName, String activityType, String submittedText, 
                          List<String> offensiveWords, LocalDateTime flaggedAt, Boolean isSeen) {
        this.id = id;
        this.childId = childId;
        this.childName = childName;
        this.activityType = activityType;
        this.submittedText = submittedText;
        this.offensiveWords = offensiveWords;
        this.flaggedAt = flaggedAt;
        this.isSeen = isSeen;
        this.displayActivityType = getDisplayActivityType(activityType);
    }

    // Helper method to convert activity type to display name
    private String getDisplayActivityType(String activityType) {
        switch (activityType) {
            case "story_generation":
                return "Story Generation";
            case "sentence_learning":
                return "Sentence Learning";
            case "sentence_correction":
                return "Sentence Correction";
            case "word_flashcard":
                return "Word Flashcards";
            case "word_match":
                return "Word Matching";
            case "picture_puzzle":
                return "Picture Puzzles";
            default:
                return activityType;
        }
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

    public String getChildName() {
        return childName;
    }

    public void setChildName(String childName) {
        this.childName = childName;
    }

    public String getActivityType() {
        return activityType;
    }

    public void setActivityType(String activityType) {
        this.activityType = activityType;
        this.displayActivityType = getDisplayActivityType(activityType);
    }

    public String getSubmittedText() {
        return submittedText;
    }

    public void setSubmittedText(String submittedText) {
        this.submittedText = submittedText;
    }

    public List<String> getOffensiveWords() {
        return offensiveWords;
    }

    public void setOffensiveWords(List<String> offensiveWords) {
        this.offensiveWords = offensiveWords;
    }

    public LocalDateTime getFlaggedAt() {
        return flaggedAt;
    }

    public void setFlaggedAt(LocalDateTime flaggedAt) {
        this.flaggedAt = flaggedAt;
    }

    public String getDisplayActivityType() {
        return displayActivityType;
    }

    public void setDisplayActivityType(String displayActivityType) {
        this.displayActivityType = displayActivityType;
    }

    public Boolean getIsSeen() {
        return isSeen;
    }

    public void setIsSeen(Boolean isSeen) {
        this.isSeen = isSeen;
    }
}
