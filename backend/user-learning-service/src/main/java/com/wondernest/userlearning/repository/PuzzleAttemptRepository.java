package com.wondernest.userlearning.repository;

import com.wondernest.userlearning.model.PuzzleAttempt;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface PuzzleAttemptRepository extends JpaRepository<PuzzleAttempt, UUID> {
    Optional<PuzzleAttempt> findByChildIdAndPuzzleId(UUID childId, UUID puzzleId);
    List<PuzzleAttempt> findByChildIdAndIsSolved(UUID childId, Integer isSolved);
} 