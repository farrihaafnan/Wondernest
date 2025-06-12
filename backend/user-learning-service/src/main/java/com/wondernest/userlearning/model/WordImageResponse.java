package com.wondernest.userlearning.model;

public class WordImageResponse {
    private String letter;
    private String word;
    private String imageUrl;

    public WordImageResponse() {}

    public WordImageResponse(String letter, String word, String imageUrl) {
        this.letter = letter;
        this.word = word;
        this.imageUrl = imageUrl;
    }

    public String getLetter() { return letter; }
    public void setLetter(String letter) { this.letter = letter; }

    public String getWord() { return word; }
    public void setWord(String word) { this.word = word; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
} 