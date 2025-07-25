package com.wondernest.userlearning.dto;

public class SentenceLearningResponse {
    private String imageUrl;
    private String feedback;
    private boolean isCorrect;
    private String correctedSentence;
    private String imageDescription;
    private String inappropriateWordsWarning; // New field for warning message

    public SentenceLearningResponse() {}

    public SentenceLearningResponse(String imageUrl, String feedback, boolean isCorrect, String correctedSentence, String imageDescription) {
        this.imageUrl = imageUrl;
        this.feedback = feedback;
        this.isCorrect = isCorrect;
        this.correctedSentence = correctedSentence;
        this.imageDescription = imageDescription;
        this.inappropriateWordsWarning = null;
    }

    public SentenceLearningResponse(String imageUrl, String feedback, boolean isCorrect, String correctedSentence, String imageDescription, String inappropriateWordsWarning) {
        this.imageUrl = imageUrl;
        this.feedback = feedback;
        this.isCorrect = isCorrect;
        this.correctedSentence = correctedSentence;
        this.imageDescription = imageDescription;
        this.inappropriateWordsWarning = inappropriateWordsWarning;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public String getFeedback() {
        return feedback;
    }

    public void setFeedback(String feedback) {
        this.feedback = feedback;
    }

    public boolean isCorrect() {
        return isCorrect;
    }

    public void setCorrect(boolean correct) {
        isCorrect = correct;
    }

    public String getCorrectedSentence() {
        return correctedSentence;
    }

    public void setCorrectedSentence(String correctedSentence) {
        this.correctedSentence = correctedSentence;
    }

    public String getImageDescription() {
        return imageDescription;
    }

    public void setImageDescription(String imageDescription) {
        this.imageDescription = imageDescription;
    }

    public String getInappropriateWordsWarning() {
        return inappropriateWordsWarning;
    }

    public void setInappropriateWordsWarning(String inappropriateWordsWarning) {
        this.inappropriateWordsWarning = inappropriateWordsWarning;
    }
} 