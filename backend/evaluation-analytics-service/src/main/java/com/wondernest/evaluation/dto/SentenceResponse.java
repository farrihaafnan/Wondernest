package com.wondernest.evaluation.dto;

public class SentenceResponse {
    private String sentence;
 
    public SentenceResponse() {}
    public SentenceResponse(String sentence) { this.sentence = sentence; }
    public String getSentence() { return sentence; }
    public void setSentence(String sentence) { this.sentence = sentence; }
} 