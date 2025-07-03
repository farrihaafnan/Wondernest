package com.wondernest.evaluation.controller;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.wondernest.evaluation.model.WordMatchingResult;
import com.wondernest.evaluation.service.WordMatchingService;

@RestController
@RequestMapping("/api/evaluation/word-matching")
@CrossOrigin(origins = "*")
public class WordMatchingController {
    private static final Logger logger = LoggerFactory.getLogger(WordMatchingController.class);
    private final WordMatchingService wordMatchingService;

    public WordMatchingController(WordMatchingService wordMatchingService) {
        this.wordMatchingService = wordMatchingService;
    }

    @GetMapping("/generate")
    public ResponseEntity<?> generateWordImagePairs(@RequestParam String letterRange) {
        logger.info("[WORD_MATCHING_GENERATE] Generating word-image pairs for range {}", letterRange);
        List<Map<String, String>> pairs = wordMatchingService.generateWordImagePairs(letterRange, 5);
        Collections.shuffle(pairs);
        List<String> words = pairs.stream().map(p -> p.get("word")).collect(Collectors.toList());
        List<String> images = pairs.stream().map(p -> p.get("imageUrl")).collect(Collectors.toList());
        Map<String, Object> response = new HashMap<>();
        response.put("words", words);
        response.put("images", images);
        response.put("correctPairs", pairs); // for answer checking (not for frontend)
        response.put("letterRange", letterRange);
        return ResponseEntity.ok(response);
    }

    public static class WordMatchingSubmitRequest {
        public UUID childId;
        public String letterRange;
        public List<String> userMatches;
        public List<String> correctWords;
        public int score;
    }

    public static class WordMatchingSubmitResponse {
        public int score;
        public List<Boolean> correct;
        public List<String> correctWords;
    }

    @PostMapping("/submit")
    public ResponseEntity<?> submitWordMatching(@RequestBody WordMatchingSubmitRequest request) {
        logger.info("[WORD_MATCHING_SUBMIT] childId={}, letterRange={}, score={}", request.childId, request.letterRange, request.score);
        try {
            WordMatchingResult saved = wordMatchingService.saveResult(request.childId, request.letterRange, request.score);
            List<Boolean> correct = new ArrayList<>();
            for (int i = 0; i < request.correctWords.size(); i++) {
                correct.add(request.userMatches.get(i).equalsIgnoreCase(request.correctWords.get(i)));
            }
            WordMatchingSubmitResponse resp = new WordMatchingSubmitResponse();
            resp.score = request.score;
            resp.correct = correct;
            resp.correctWords = request.correctWords;
            logger.info("[WORD_MATCHING_SUBMIT_SUCCESS] id={}", saved.getId());
            return ResponseEntity.ok(resp);
        } catch (Exception e) {
            logger.error("[WORD_MATCHING_SUBMIT_ERROR] childId={}, error={}", request.childId, e.getMessage());
            return ResponseEntity.status(500).body("Failed to save word matching result");
        }
    }

    @GetMapping("/proxy-image")
    public ResponseEntity<byte[]> proxyImage(@RequestParam String url) {
        try {
            HttpClient client = HttpClient.newHttpClient();
            HttpRequest request = HttpRequest.newBuilder().uri(URI.create(url)).build();
            HttpResponse<byte[]> response = client.send(request, HttpResponse.BodyHandlers.ofByteArray());
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.IMAGE_PNG);
            return ResponseEntity.ok().headers(headers).body(response.body());
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
} 