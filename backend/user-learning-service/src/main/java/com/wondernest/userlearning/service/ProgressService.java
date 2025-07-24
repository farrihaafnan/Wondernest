package com.wondernest.userlearning.service;

import com.wondernest.userlearning.dto.AvgScoresDto;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.ResponseEntity;
import java.util.*;
import java.util.UUID;
import java.time.LocalDateTime;

@Service
public class ProgressService {
    private final RestTemplate restTemplate = new RestTemplate();

    public AvgScoresDto getAvgScores(UUID childId) {
        Double wordMatchingAvg = fetchAverageScore(childId, "word-matching");
        Double sentenceCorrectionAvg = fetchAverageScore(childId, "sentence-correction");
        return new AvgScoresDto(wordMatchingAvg, sentenceCorrectionAvg);
    }

    private Double fetchAverageScore(UUID childId, String type) {
        try {
            String url;
            String sinceParam = "&since=" + LocalDateTime.now().minusDays(7).toString();
            if (type.equals("word-matching")) {
                url = "http://localhost:8082/api/evaluation/word-matching/word-matching?childId=" + childId + sinceParam;
            } else if (type.equals("sentence-correction")) {
                url = "http://localhost:8082/api/evaluation/sentence-correction/by-child?childId=" + childId + sinceParam;
            } else {
                return null;
            }
            ResponseEntity<List> response = restTemplate.getForEntity(url, List.class);
            List<Map<String, Object>> results = response.getBody();
            System.out.println("[DEBUG] Raw results for " + type + " (" + childId + "): " + results);
            if (results == null || results.isEmpty()) return null;
            // No filtering by date, use all results
            double avg = results.stream()
                    .mapToInt(r -> {
                        Object scoreObj = r.get("score");
                        if (scoreObj instanceof Integer) return (Integer) scoreObj;
                        if (scoreObj instanceof Number) return ((Number) scoreObj).intValue();
                        if (scoreObj != null) return Integer.parseInt(scoreObj.toString());
                        return 0;
                    })
                    .average().orElse(Double.NaN);
            return Double.isNaN(avg) ? null : avg;
        } catch (Exception e) {
            return null;
        }
    }
} 