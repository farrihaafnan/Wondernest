package com.wondernest.evaluation.controller;

import com.wondernest.evaluation.dto.CheckRequest;
import com.wondernest.evaluation.dto.CheckResponse;
import com.wondernest.evaluation.dto.SentenceResponse;
import com.wondernest.evaluation.dto.SaveSentenceCorrectionRequest;
import com.wondernest.evaluation.model.SentenceCorrection;
import com.wondernest.evaluation.repository.SentenceCorrectionRepository;
import com.wondernest.evaluation.service.GeminiService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/evaluation")
public class SentenceEvaluationController {
    private static final Logger logger = LoggerFactory.getLogger(SentenceEvaluationController.class);

    @Autowired
    private GeminiService geminiService;

    @Autowired
    private SentenceCorrectionRepository sentenceCorrectionRepository;

    @GetMapping("/sentence")
    public SentenceResponse getIncorrectSentence() {
        return geminiService.generateIncorrectSentence();
    }

    @PostMapping("/check")
    public CheckResponse checkSentence(@RequestBody CheckRequest request) {
        return geminiService.checkSentence(request);
    }

    @GetMapping("/sentences")
    public List<String> getIncorrectSentences(@RequestParam(defaultValue = "5") int count) {
        return geminiService.generateIncorrectSentences(count);
    }
//sentence-correction
    @GetMapping("/sentence-correction")
    public List<SentenceCorrectionDTO> getAllSentenceCorrections() {
        return sentenceCorrectionRepository.findAll().stream().map( SentenceCorrectionDTO::fromEntity ).toList();
    }

    @PostMapping("/sentence-correction")
    public ResponseEntity<?> saveSentenceCorrection(@RequestBody SaveSentenceCorrectionRequest request) {
        logger.info("[SENTENCE_CORRECTION_SAVE_ATTEMPT] childId={}, score={}", request.getChildId(), request.getScore());
        try {
            System.out.println("Saving sentence correction: childId=" + request.getChildId() + ", score=" + request.getScore());
            SentenceCorrection entity = new SentenceCorrection();
            entity.setChildId(request.getChildId());
            entity.setScore(request.getScore());
            SentenceCorrection saved = sentenceCorrectionRepository.save(entity);
            logger.info("[SENTENCE_CORRECTION_SAVE_SUCCESS] id={}", saved.getId());
            System.out.println("Saved with id: " + saved.getId());
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            logger.error("[SENTENCE_CORRECTION_SAVE_ERROR] childId={}, score={}, error={}", request.getChildId(), request.getScore(), e.getMessage(), e);
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Failed to save sentence correction: " + e.getMessage());
        }
    }
}

class SentenceCorrectionDTO {
    public String id;
    public String childId;
    public int score;
    public String attemptedAt;
    public static SentenceCorrectionDTO fromEntity(SentenceCorrection e) {
        SentenceCorrectionDTO dto = new SentenceCorrectionDTO();
        dto.id = e.getId() != null ? e.getId().toString() : null;
        dto.childId = e.getChildId() != null ? e.getChildId().toString() : null;
        dto.score = e.getScore();
        dto.attemptedAt = e.getAttemptedAt() != null ? e.getAttemptedAt().toString() : null;
        return dto;
    }
} 