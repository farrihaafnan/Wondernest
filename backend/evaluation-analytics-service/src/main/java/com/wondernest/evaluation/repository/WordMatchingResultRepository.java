package com.wondernest.evaluation.repository;

import com.wondernest.evaluation.model.WordMatchingResult;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;

public interface WordMatchingResultRepository extends JpaRepository<WordMatchingResult, UUID> {
} 