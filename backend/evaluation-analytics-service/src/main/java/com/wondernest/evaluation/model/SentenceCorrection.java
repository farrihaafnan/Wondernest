package com.wondernest.evaluation.model;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "sentence_correction")
public class SentenceCorrection {
    @Id
    @GeneratedValue
    private UUID id;

    @Column(name = "child_id", nullable = false)
    private UUID childId;

    @Column(nullable = false)
    private int score;

    @Column(name = "attempted_at", insertable = false, updatable = false)
    private LocalDateTime attemptedAt;

    // Getters and setters
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public UUID getChildId() { return childId; }
    public void setChildId(UUID childId) { this.childId = childId; }
    public int getScore() { return score; }
    public void setScore(int score) { this.score = score; }
    public LocalDateTime getAttemptedAt() { return attemptedAt; }
    public void setAttemptedAt(LocalDateTime attemptedAt) { this.attemptedAt = attemptedAt; }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        SentenceCorrection that = (SentenceCorrection) o;
        return score == that.score &&
                java.util.Objects.equals(id, that.id) &&
                java.util.Objects.equals(childId, that.childId) &&
                java.util.Objects.equals(attemptedAt, that.attemptedAt);
    }

    @Override
    public int hashCode() {
        return java.util.Objects.hash(id, childId, score, attemptedAt);
    }

    @Override
    public String toString() {
        return "SentenceCorrection{" +
                "id=" + id +
                ", childId=" + childId +
                ", score=" + score +
                ", attemptedAt=" + attemptedAt +
                '}';
    }
} 