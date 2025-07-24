package com.wondernest.userlearning.service;

import com.wondernest.userlearning.dto.RecommendationDto;
import com.wondernest.userlearning.repository.ScreenTimeLogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.ResponseEntity;

import java.util.*;
import java.util.stream.Collectors;
import java.util.UUID;
import java.util.concurrent.ThreadLocalRandom;

@Service
public class RecommendationService {
    @Autowired
    private ScreenTimeLogRepository screenTimeLogRepository;

    private final RestTemplate restTemplate = new RestTemplate();
    private static final String EVAL_SERVICE_BASE = "http://evaluation-analytics-service:8082/api";
    private static final Set<String> EXCLUDED_ACTIVITIES = Set.of("word_match", "sentence_correction");

    public List<RecommendationDto> getRecommendations(UUID childId) {
        List<RecommendationDto> recommendations = new ArrayList<>();

        // 1. Skill-based: Word Matching and Sentence Correction
        Double avgWordMatch = fetchAverageScoreFromEvalService(childId, "word-matching");
        Double avgSentenceCorrection = fetchAverageScoreFromEvalService(childId, "sentence-correction");
        boolean hasWordMatch = avgWordMatch != null;
        boolean hasSentenceCorrection = avgSentenceCorrection != null;
        List<String> skillTasks = Arrays.asList("word_match", "sentence_correction");
        if (!hasWordMatch && !hasSentenceCorrection) {
            // Neither played, pick one randomly
            String pick = skillTasks.get(ThreadLocalRandom.current().nextInt(skillTasks.size()));
            String display = pick.equals("word_match") ? "Word Matching" : "Sentence Correction";
            recommendations.add(new RecommendationDto(pick, display, "Not attempted yet. Try this activity!"));
        } else if (!hasWordMatch) {
            recommendations.add(new RecommendationDto("word_match", "Word Matching", "Not attempted yet. Try this activity!"));
        } else if (!hasSentenceCorrection) {
            recommendations.add(new RecommendationDto("sentence_correction", "Sentence Correction", "Not attempted yet. Try this activity!"));
        } else if (avgSentenceCorrection < avgWordMatch) {
            recommendations.add(new RecommendationDto("sentence_correction", "Sentence Correction", "Lowest average score among skill tasks."));
        } else {
            recommendations.add(new RecommendationDto("word_match", "Word Matching", "Lowest average score among skill tasks."));
        }

        // 2. Time-based: Recommend two unplayed activities if any, else two with lowest screen time
        List<String> timeTasks = Arrays.asList("word_flashcard", "sentence_learning", "story_generation", "picture_puzzle");
        List<Object[]> summary = screenTimeLogRepository.findScreenTimeSummaryByChildId(childId, java.time.LocalDateTime.now().minusDays(30));
        Map<String, Long> timeMap = new HashMap<>();
        for (Object[] arr : summary) {
            String activityType = (String) arr[0];
            Long totalTime = (Long) arr[1];
            timeMap.put(activityType, totalTime);
        }
        List<String> unplayed = new ArrayList<>();
        for (String t : timeTasks) {
            if (!timeMap.containsKey(t)) unplayed.add(t);
        }
        if (unplayed.size() >= 2) {
            Collections.shuffle(unplayed);
            for (int i = 0; i < 2; i++) {
                String t = unplayed.get(i);
                recommendations.add(new RecommendationDto(t, getDisplayNameForActivity(t), "Not attempted yet. Try this activity!"));
            }
        } else if (unplayed.size() == 1) {
            String t = unplayed.get(0);
            recommendations.add(new RecommendationDto(t, getDisplayNameForActivity(t), "Not attempted yet. Try this activity!"));
            // Add one with lowest screen time among the rest
            List<String> played = new ArrayList<>(timeTasks);
            played.removeAll(unplayed);
            played.sort(Comparator.comparingLong(timeMap::get));
            if (!played.isEmpty()) {
                String t2 = played.get(0);
                recommendations.add(new RecommendationDto(t2, getDisplayNameForActivity(t2), "Lowest screen time: " + timeMap.get(t2) + " seconds"));
            }
        } else {
            // All played, pick two with lowest screen time
            List<String> played = new ArrayList<>(timeTasks);
            played.sort(Comparator.comparingLong(timeMap::get));
            for (int i = 0; i < Math.min(2, played.size()); i++) {
                String t = played.get(i);
                recommendations.add(new RecommendationDto(t, getDisplayNameForActivity(t), "Lowest screen time: " + timeMap.get(t) + " seconds"));
            }
        }
        return recommendations;
    }

    private Double fetchAverageScoreFromEvalService(UUID childId, String type) {
        try {
            String url;
            if (type.equals("word-matching")) {
                url = "http://localhost:8082/api/evaluation/word-matching/word-matching?childId=" + childId;
            } else if (type.equals("sentence-correction")) {
                url = "http://localhost:8082/api/evaluation/sentence-correction/by-child?childId=" + childId;
            } else {
                return null;
            }
            ResponseEntity<List> response = restTemplate.getForEntity(url, List.class);
            List<Map<String, Object>> results = response.getBody();
            System.out.println("[DEBUG] RecommendationService fetched from " + url + ": " + results);
            if (results == null || results.isEmpty()) return null;
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
            System.out.println("[DEBUG] RecommendationService error: " + e.getMessage());
            return null;
        }
    }

    private String getDisplayNameForActivity(String activityType) {
        switch (activityType) {
            case "word_flashcard": return "Word Flashcards";
            case "picture_puzzle": return "Picture Puzzles";
            case "story_generation": return "Story Generation";
            case "sentence_learning": return "Sentence Learning";
            default: return activityType;
        }
    }
} 