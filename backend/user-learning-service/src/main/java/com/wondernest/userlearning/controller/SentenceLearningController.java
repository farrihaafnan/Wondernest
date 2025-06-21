package com.wondernest.userlearning.controller;

import com.wondernest.userlearning.dto.SentenceLearningRequest;
import com.wondernest.userlearning.dto.SentenceLearningResponse;
import com.wondernest.userlearning.service.SentenceLearningService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/sentence-learning")
public class SentenceLearningController {

    @Autowired
    private SentenceLearningService sentenceLearningService;

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