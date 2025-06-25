package com.wondernest.evaluation.dto;

import java.util.UUID;

public class SaveSentenceCorrectionRequest {
    private UUID childId;
    private int score;

    public UUID getChildId() { return childId; }
    public void setChildId(UUID childId) { this.childId = childId; }
    public int getScore() { return score; }
    public void setScore(int score) { this.score = score; }
} 