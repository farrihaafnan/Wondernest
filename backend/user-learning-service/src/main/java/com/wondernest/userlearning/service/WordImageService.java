package com.wondernest.userlearning.service;

import com.wondernest.userlearning.model.WordImageResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.*;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

@Service
public class WordImageService {

    @Value("${openrouter.api.key}")
    private String openrouterApiKey;

    private static final String OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";
    private static final String OPENROUTER_MODEL = "mistralai/devstral-small:free";
    private static final String UNSPLASH_URL = "https://source.unsplash.com/400x300/?";

    public List<WordImageResponse> getWordImages(char start, char end) {
        List<WordImageResponse> result = new ArrayList<>();
        for (char c = start; c <= end; c++) {
            String word = getWordFromOpenRouter(c);
            String imageUrl = UNSPLASH_URL + word;
            result.add(new WordImageResponse(String.valueOf(c), word, imageUrl));
        }
        return result;
    }

    private String getWordFromOpenRouter(char letter) {
        try {
            String prompt = "Give me a single simple English word that starts with the letter '" + letter + "'. Only return the word, nothing else.";
            String requestBody = "{\n" +
                    "  \"model\": \"" + OPENROUTER_MODEL + "\",\n" +
                    "  \"messages\": [\n" +
                    "    {\"role\": \"user\", \"content\": \"" + prompt + "\"}\n" +
                    "  ],\n" +
                    "  \"max_tokens\": 5,\n" +
                    "  \"temperature\": 0.7\n" +
                    "}";

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(OPENROUTER_URL))
                    .header("Content-Type", "application/json")
                    .header("Authorization", "Bearer " + openrouterApiKey)
                    .POST(HttpRequest.BodyPublishers.ofString(requestBody))
                    .build();

            HttpClient client = HttpClient.newHttpClient();
            HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());

            System.out.println("OpenRouter response for letter " + letter + ": " + response.body());

            ObjectMapper mapper = new ObjectMapper();
            JsonNode root = mapper.readTree(response.body());
            JsonNode choices = root.path("choices");
            if (choices.isArray() && choices.size() > 0) {
                String word = choices.get(0)
                        .path("message")
                        .path("content")
                        .asText()
                        .replaceAll("[^A-Za-z]", "");
                return word.isEmpty() ? "Unknown" : word;
            } else {
                return "Unknown";
            }
        } catch (Exception e) {
            e.printStackTrace();
            return "Unknown";
        }
    }
} 