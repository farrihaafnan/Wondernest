package com.wondernest.evaluation.service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Random;
import java.util.Set;
import java.util.UUID;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.TemporalAdjusters;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.wondernest.evaluation.model.WordMatchingResult;
import com.wondernest.evaluation.repository.WordMatchingResultRepository;

@Service
public class WordMatchingService {
    @Value("${openai.api.key}")
    private String openaiApiKey;

    private final WordMatchingResultRepository resultRepository;
    private final GeminiService geminiService;

    public WordMatchingService(WordMatchingResultRepository resultRepository, GeminiService geminiService) {
        this.resultRepository = resultRepository;
        this.geminiService = geminiService;
    }

    public List<Map<String, String>> generateWordImagePairs(String letterRange, int count) {
        List<Map<String, String>> result = new ArrayList<>();
        Set<String> usedWords = new HashSet<>();
        char start = Character.toUpperCase(letterRange.charAt(0));
        char end = Character.toUpperCase(letterRange.charAt(letterRange.length() - 1));
        Random random = new Random();
        int attempts = 0;
        while (result.size() < count && attempts < count * 5) { // avoid infinite loop
            char letter = (char) (start + random.nextInt(end - start + 1));
            String word = geminiService.generateWordForLetter(letter);
            if (word.isEmpty() || usedWords.contains(word.toLowerCase())) {
                attempts++;
                continue;
            }
            usedWords.add(word.toLowerCase());
            String imageUrl = generateImageWithDalle(word);
            Map<String, String> pair = new HashMap<>();
            pair.put("word", word);
            pair.put("imageUrl", imageUrl);
            result.add(pair);
            attempts++;
        }
        Collections.shuffle(result);
        return result;
    }

    private String generateImageWithDalle(String word) {
        try {
            String prompt = "A simple, clear photo of a " + word + ", white background, no text, no watermark.";
            String requestBody = "{\n" +
                    "  \"model\": \"dall-e-2\",\n" +
                    "  \"prompt\": \"" + prompt + "\",\n" +
                    "  \"n\": 1,\n" +
                    "  \"size\": \"256x256\"\n" +
                    "}";
            System.out.println("[DALL-E] Prompt: " + prompt);
            System.out.println("[DALL-E] Request Body: " + requestBody);

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create("https://api.openai.com/v1/images/generations"))
                    .header("Content-Type", "application/json")
                    .header("Authorization", "Bearer " + openaiApiKey)
                    .POST(HttpRequest.BodyPublishers.ofString(requestBody))
                    .build();

            HttpClient client = HttpClient.newHttpClient();
            HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
            System.out.println("[DALL-E] Response Status: " + response.statusCode());
            System.out.println("[DALL-E] Response Body: " + response.body());

            ObjectMapper mapper = new ObjectMapper();
            JsonNode root = mapper.readTree(response.body());
            JsonNode data = root.path("data");
            if (data.isArray() && data.size() > 0) {
                String imageUrl = data.get(0).path("url").asText();
                System.out.println("[DALL-E] Image URL: " + imageUrl);

                // Download the image and encode as base64
                try {
                    java.net.URL url = new java.net.URL(imageUrl);
                    java.io.InputStream in = url.openStream();
                    byte[] imageBytes = in.readAllBytes();
                    in.close();
                    String base64 = java.util.Base64.getEncoder().encodeToString(imageBytes);
                    return "data:image/png;base64," + base64;
                } catch (Exception ex) {
                    System.out.println("[DALL-E] Error downloading or encoding image: " + ex.getMessage());
                    ex.printStackTrace();
                    return "https://via.placeholder.com/400x300?text=No+Image";
                }
            } else {
                System.out.println("[DALL-E] No image data returned, using placeholder.");
                return "https://via.placeholder.com/400x300?text=No+Image";
            }
        } catch (Exception e) {
            System.out.println("[DALL-E] Exception: " + e.getMessage());
            e.printStackTrace();
            return "https://via.placeholder.com/400x300?text=Error";
        }
    }

    public WordMatchingResult saveResult(UUID childId, String letterRange, int score) {
        WordMatchingResult result = new WordMatchingResult();
        result.setChildId(childId);
        result.setLetterRange(letterRange);
        result.setScore(score);
        return resultRepository.save(result);
    }

    public Map<String, Map<String, Double>> getWeeklyAveragesByRange(UUID childId) {
        // Define the five ranges
        String[] ranges = {"A-E", "F-J", "K-O", "P-T", "U-Z"};
        Map<String, Map<String, Double>> result = new HashMap<>();
        LocalDate today = LocalDate.now();
        // Find the most recent Saturday (or today if today is Saturday)
        LocalDate thisSaturday = today.with(java.time.DayOfWeek.SATURDAY);
        if (today.getDayOfWeek() != java.time.DayOfWeek.SATURDAY && today.isBefore(thisSaturday)) {
            thisSaturday = thisSaturday.minusWeeks(1);
        }
        LocalDate nextSaturday = thisSaturday.plusWeeks(1);
        LocalDate lastSaturday = thisSaturday.minusWeeks(1);
        LocalDateTime thisWeekStart = thisSaturday.atStartOfDay();
        LocalDateTime nextWeekStart = nextSaturday.atStartOfDay();
        LocalDateTime lastWeekStart = lastSaturday.atStartOfDay();
        LocalDateTime thisWeekEnd = nextWeekStart.minusSeconds(1);
        LocalDateTime lastWeekEnd = thisWeekStart.minusSeconds(1);
        for (String range : ranges) {
            // This week
            List<WordMatchingResult> thisWeekResults = resultRepository.findByChildIdAndLetterRangeAndAttemptedAtBetween(
                childId, range, thisWeekStart, thisWeekEnd);
            double thisWeekAvg = thisWeekResults.isEmpty() ? 0.0 : thisWeekResults.stream().mapToInt(WordMatchingResult::getScore).average().orElse(0.0);
            // Last week
            List<WordMatchingResult> lastWeekResults = resultRepository.findByChildIdAndLetterRangeAndAttemptedAtBetween(
                childId, range, lastWeekStart, lastWeekEnd);
            double lastWeekAvg = lastWeekResults.isEmpty() ? 0.0 : lastWeekResults.stream().mapToInt(WordMatchingResult::getScore).average().orElse(0.0);
            Map<String, Double> rangeMap = new HashMap<>();
            rangeMap.put("thisWeek", thisWeekAvg);
            rangeMap.put("lastWeek", lastWeekAvg);
            result.put(range, rangeMap);
        }
        return result;
    }
} 