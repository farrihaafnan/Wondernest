package com.wondernest.userlearning.dto;

public class AvgScoresDto {
    private Double wordMatchingAvg;
    private Double sentenceCorrectionAvg;

    public AvgScoresDto() {}
    public AvgScoresDto(Double wordMatchingAvg, Double sentenceCorrectionAvg) {
        this.wordMatchingAvg = wordMatchingAvg;
        this.sentenceCorrectionAvg = sentenceCorrectionAvg;
    }
    public Double getWordMatchingAvg() { return wordMatchingAvg; }
    public void setWordMatchingAvg(Double wordMatchingAvg) { this.wordMatchingAvg = wordMatchingAvg; }
    public Double getSentenceCorrectionAvg() { return sentenceCorrectionAvg; }
    public void setSentenceCorrectionAvg(Double sentenceCorrectionAvg) { this.sentenceCorrectionAvg = sentenceCorrectionAvg; }
} 