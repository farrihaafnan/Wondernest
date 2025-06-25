package com.wondernest.evaluation.repository;

import com.wondernest.evaluation.model.SentenceCorrection;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;
 
public interface SentenceCorrectionRepository extends JpaRepository<SentenceCorrection, UUID> {
} 