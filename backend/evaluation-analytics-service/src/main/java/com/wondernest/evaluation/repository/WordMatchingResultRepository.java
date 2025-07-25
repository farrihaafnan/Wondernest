package com.wondernest.evaluation.repository;

import com.wondernest.evaluation.model.WordMatchingResult;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;
import java.time.LocalDateTime;
import java.util.List;

public interface WordMatchingResultRepository extends JpaRepository<WordMatchingResult, UUID> {
    List<WordMatchingResult> findByChildIdAndAttemptedAtBetween(UUID childId, LocalDateTime from, LocalDateTime to);
    List<WordMatchingResult> findByChildIdAndLetterRangeAndAttemptedAtBetween(UUID childId, String letterRange, LocalDateTime from, LocalDateTime to);
} 