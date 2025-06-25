package com.wondernest.evaluation.dto;

public class CheckRequest {
    private String original;
    private String userCorrection;

    public CheckRequest() {}
    public CheckRequest(String original, String userCorrection) {
        this.original = original;
        this.userCorrection = userCorrection;
    }
    public String getOriginal() { return original; }
    public void setOriginal(String original) { this.original = original; }
    public String getUserCorrection() { return userCorrection; }
    public void setUserCorrection(String userCorrection) { this.userCorrection = userCorrection; }
} 