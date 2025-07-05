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

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        WordImageResponse that = (WordImageResponse) o;
        return java.util.Objects.equals(letter, that.letter) &&
                java.util.Objects.equals(word, that.word) &&
                java.util.Objects.equals(imageUrl, that.imageUrl);
    }

    @Override
    public int hashCode() {
        return java.util.Objects.hash(letter, word, imageUrl);
    }

    @Override
    public String toString() {
        return "WordImageResponse{" +
                "letter='" + letter + '\'' +
                ", word='" + word + '\'' +
                ", imageUrl='" + imageUrl + '\'' +
                '}';
    }
} 