package com.wondernest.userlearning.dto;

public class ScreenTimeSummaryDto {
    private String activityType;
    private String displayName;
    private Long totalTimeSeconds;
    private String formattedTime;

    // Constructors
    public ScreenTimeSummaryDto() {}

    public ScreenTimeSummaryDto(String activityType, Long totalTimeSeconds) {
        this.activityType = activityType;
        this.totalTimeSeconds = totalTimeSeconds;
        this.displayName = getDisplayNameForActivity(activityType);
        this.formattedTime = formatTime(totalTimeSeconds);
    }

    // Helper method to format time
    private String formatTime(Long totalSeconds) {
        if (totalSeconds == null || totalSeconds == 0) {
            return "0m 0s";
        }
        
        long hours = totalSeconds / 3600;
        long minutes = (totalSeconds % 3600) / 60;
        long seconds = totalSeconds % 60;
        
        if (hours > 0) {
            return String.format("%dh %dm %ds", hours, minutes, seconds);
        } else if (minutes > 0) {
            return String.format("%dm %ds", minutes, seconds);
        } else {
            return String.format("%ds", seconds);
        }
    }

    // Helper method to get display name for activity
    private String getDisplayNameForActivity(String activityType) {
        switch (activityType) {
            case "word_flashcard":
                return "Word Flashcards";
            case "picture_puzzle":
                return "Picture Puzzles";
            case "story_generation":
                return "Story Generation";
            case "sentence_learning":
                return "Sentence Learning";
            case "word_match":
                return "Word Matching";
            case "sentence_correction":
                return "Sentence Correction";
            default:
                return activityType;
        }
    }

    // Getters and Setters
    public String getActivityType() {
        return activityType;
    }

    public void setActivityType(String activityType) {
        this.activityType = activityType;
        this.displayName = getDisplayNameForActivity(activityType);
    }

    public String getDisplayName() {
        return displayName;
    }

    public void setDisplayName(String displayName) {
        this.displayName = displayName;
    }

    public Long getTotalTimeSeconds() {
        return totalTimeSeconds;
    }

    public void setTotalTimeSeconds(Long totalTimeSeconds) {
        this.totalTimeSeconds = totalTimeSeconds;
        this.formattedTime = formatTime(totalTimeSeconds);
    }

    public String getFormattedTime() {
        return formattedTime;
    }

    public void setFormattedTime(String formattedTime) {
        this.formattedTime = formattedTime;
    }
}
