package com.wondernest.userlearning.model;

import jakarta.persistence.*;
import java.util.UUID;

@Entity
@Table(name = "puzzle_attempts")
public class PuzzleAttempt {
    @Id
    @GeneratedValue
    private UUID id;

    @Column(name = "child_id", nullable = false)
    private UUID childId;

    @Column(name = "puzzle_id", nullable = false)
    private UUID puzzleId;

    @Column(nullable = false)
    private Integer attempts;

    @Column(name = "is_solved", nullable = false)
    private Integer isSolved;

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public UUID getChildId() { return childId; }
    public void setChildId(UUID childId) { this.childId = childId; }

    public UUID getPuzzleId() { return puzzleId; }
    public void setPuzzleId(UUID puzzleId) { this.puzzleId = puzzleId; }

    public Integer getAttempts() { return attempts; }
    public void setAttempts(Integer attempts) { this.attempts = attempts; }

    public Integer getIsSolved() { return isSolved; }
    public void setIsSolved(Integer isSolved) { this.isSolved = isSolved; }
} 