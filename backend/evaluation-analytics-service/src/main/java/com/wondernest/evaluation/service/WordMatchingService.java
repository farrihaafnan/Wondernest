package com.wondernest.evaluation.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.wondernest.evaluation.model.WordMatchingResult;
import com.wondernest.evaluation.repository.WordMatchingResultRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.net.URL;
import java.util.*;

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
                    "  \"model\": \"dall-e-3\",\n" +
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
                return imageUrl;
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
} 