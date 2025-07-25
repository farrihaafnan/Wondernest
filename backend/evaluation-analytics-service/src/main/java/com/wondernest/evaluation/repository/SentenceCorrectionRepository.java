package com.wondernest.evaluation.repository;

import com.wondernest.evaluation.model.SentenceCorrection;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;
import java.time.LocalDateTime;
import java.util.List;
 
public interface SentenceCorrectionRepository extends JpaRepository<SentenceCorrection, UUID> {
    List<SentenceCorrection> findByChildIdAndAttemptedAtBetween(UUID childId, LocalDateTime from, LocalDateTime to);
} 