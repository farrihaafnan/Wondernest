package com.wondernest.userlearning.controller;

import com.wondernest.userlearning.dto.SentenceLearningRequest;
import com.wondernest.userlearning.dto.SentenceLearningResponse;
import com.wondernest.userlearning.service.SentenceLearningService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.sql.DataSource;
import java.sql.Connection;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/sentence-learning")
public class SentenceLearningController {

    @Autowired
    private SentenceLearningService sentenceLearningService;
    
    @Autowired
    private DataSource dataSource;

    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> healthCheck() {
        Map<String, Object> response = new HashMap<>();
        try (Connection connection = dataSource.getConnection()) {
            response.put("status", "healthy");
            response.put("database", "connected");
            response.put("timestamp", System.currentTimeMillis());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("status", "unhealthy");
            response.put("database", "disconnected");
            response.put("error", e.getMessage());
            response.put("timestamp", System.currentTimeMillis());
            return ResponseEntity.status(503).body(response);
        }
    }

    @PostMapping("/generate-image")
    public ResponseEntity<SentenceLearningResponse> generateImage(@RequestBody SentenceLearningRequest request) {
        try {
            // Set empty sentence to just generate image
            request.setSentence("");
            SentenceLearningResponse response = sentenceLearningService.generateImageAndEvaluateSentence(request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body(
                new SentenceLearningResponse(
                    null,
                    "An error occurred while generating the image. Please try again.",
                    false,
                    null,
                    null
                )
            );
        }
    }

    @PostMapping("/evaluate")
    public ResponseEntity<SentenceLearningResponse> evaluateSentence(@RequestBody SentenceLearningRequest request) {
        try {
            SentenceLearningResponse response = sentenceLearningService.evaluateSentenceOnly(request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body(
                new SentenceLearningResponse(
                    null,
                    "An error occurred while processing your request. Please try again.",
                    false,
                    null,
                    null
                )
            );
        }
    }
} 