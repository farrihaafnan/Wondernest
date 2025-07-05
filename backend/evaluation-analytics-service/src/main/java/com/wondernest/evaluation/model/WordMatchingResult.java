package com.wondernest.evaluation.model;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "word_matching")
public class WordMatchingResult {
    @Id
    @GeneratedValue
    private UUID id;

    @Column(name = "child_id", nullable = false)
    private UUID childId;

    @Column(nullable = false)
    private int score;

    @Column(name = "attempted_at", insertable = false, updatable = false)
    private LocalDateTime attemptedAt;

    @Column(name = "letter_range", nullable = false)
    private String letterRange;

    // Getters and setters
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public UUID getChildId() { return childId; }
    public void setChildId(UUID childId) { this.childId = childId; }
    public int getScore() { return score; }
    public void setScore(int score) { this.score = score; }
    public LocalDateTime getAttemptedAt() { return attemptedAt; }
    public void setAttemptedAt(LocalDateTime attemptedAt) { this.attemptedAt = attemptedAt; }
    public String getLetterRange() { return letterRange; }
    public void setLetterRange(String letterRange) { this.letterRange = letterRange; }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        WordMatchingResult that = (WordMatchingResult) o;
        return score == that.score &&
                java.util.Objects.equals(id, that.id) &&
                java.util.Objects.equals(childId, that.childId) &&
                java.util.Objects.equals(letterRange, that.letterRange) &&
                java.util.Objects.equals(attemptedAt, that.attemptedAt);
    }

    @Override
    public int hashCode() {
        return java.util.Objects.hash(id, childId, letterRange, score, attemptedAt);
    }

    @Override
    public String toString() {
        return "WordMatchingResult{" +
                "id=" + id +
                ", childId=" + childId +
                ", letterRange='" + letterRange + '\'' +
                ", score=" + score +
                ", attemptedAt=" + attemptedAt +
                '}';
    }
} 