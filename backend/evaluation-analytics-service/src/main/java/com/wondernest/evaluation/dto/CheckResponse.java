package com.wondernest.evaluation.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public class CheckResponse {
    @JsonProperty("isCorrect")
    private boolean isCorrect;
    private String correctSentence;
    private String feedback;
    private String original;

    public CheckResponse() {}
    public CheckResponse(boolean isCorrect, String correctSentence, String feedback, String original) {
        this.isCorrect = isCorrect;
        this.correctSentence = correctSentence;
        this.feedback = feedback;
        this.original = original;
    }
    @JsonProperty("isCorrect")
    public boolean isCorrect() { return isCorrect; }
    public void setCorrect(boolean correct) { isCorrect = correct; }
    public String getCorrectSentence() { return correctSentence; }
    public void setCorrectSentence(String correctSentence) { this.correctSentence = correctSentence; }
    public String getFeedback() { return feedback; }
    public void setFeedback(String feedback) { this.feedback = feedback; }
    public String getOriginal() { return original; }
    public void setOriginal(String original) { this.original = original; }
} 