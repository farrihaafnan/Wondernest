package com.wondernest.userlearning.model;

import jakarta.persistence.*;
import java.util.UUID;

@Entity
@Table(name = "stories")
public class Story {

    @Id
    @GeneratedValue
    private UUID id;

    @Column(name = "child_id", nullable = false)
    private UUID childId;

    @Column(name = "prompt", nullable = false)
    private String prompt;

    @Column(name = "story_text", columnDefinition = "TEXT")
    private String storyText;

    // --- Getters and Setters ---

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

    public String getPrompt() {
        return prompt;
    }

    public void setPrompt(String prompt) {
        this.prompt = prompt;
    }

    public String getStoryText() {
        return storyText;
    }

    public void setStoryText(String storyText) {
        this.storyText = storyText;
    }

    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Story story = (Story) o;
        return java.util.Objects.equals(id, story.id) &&
                java.util.Objects.equals(childId, story.childId) &&
                java.util.Objects.equals(prompt, story.prompt) &&
                java.util.Objects.equals(storyText, story.storyText);
    }

    public int hashCode() {
        return java.util.Objects.hash(id, childId, prompt, storyText);
    }

    public String toString() {
        return "Story{" +
                "id=" + id +
                ", childId=" + childId +
                ", prompt='" + prompt + '\'' +
                ", storyText='" + storyText + '\'' +
                '}';
    }
}

