package com.wondernest.userlearning.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.wondernest.userlearning.model.WordImageResponse;
import okhttp3.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.Base64;

@Service
public class WordImageService {
    @Value("${gemini.api.key}")
    private String geminiApiKey;
    @Value("${openai.api.key}")
    private String openaiApiKey;
    @Value("${gemini.endpoint:https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent}")
    private String geminiEndpoint;
    @Value("${dall_e.endpoint:https://api.openai.com/v1/images/generations}")
    private String dallEEndpoint;

    private final OkHttpClient httpClient = new OkHttpClient.Builder()
            .connectTimeout(30, java.util.concurrent.TimeUnit.SECONDS)
            .readTimeout(60, java.util.concurrent.TimeUnit.SECONDS)
            .writeTimeout(30, java.util.concurrent.TimeUnit.SECONDS)
            .build();

    private final ObjectMapper objectMapper = new ObjectMapper();

    public WordImageResponse getWordImage(char letter) {
        try {
            String word = null;
            int attempts = 0;
            while (attempts < 3) {
                word = generateWordWithGemini(letter);
                // Only accept words that are likely to be visual/concrete nouns (simple heuristic)
                if (word != null && !word.equalsIgnoreCase("Unknown") && word.matches("[A-Za-z]{2,}")) {
                    // Optionally, filter out known abstract words (add more as needed)
                    String[] abstractWords = {"kind", "love", "idea", "hope", "peace", "truth", "bravery", "honor", "justice", "wisdom", "courage", "freedom", "joy", "trust", "faith", "dream", "thought", "belief", "power", "strength", "beauty"};
                    boolean isAbstract = false;
                    for (String abs : abstractWords) {
                        if (word.equalsIgnoreCase(abs)) {
                            isAbstract = true;
                            break;
                        }
                    }
                    if (!isAbstract) break;
                }
                attempts++;
                word = null;
            }
            if (word == null) word = "Unknown";
            String imageUrl = generateImageWithDalle(word);
            return new WordImageResponse(String.valueOf(letter), word, imageUrl);
        } catch (Exception e) {
            e.printStackTrace();
            return new WordImageResponse(String.valueOf(letter), "Unknown", "https://via.placeholder.com/400x300?text=Error");
        }
    }

    private String generateWordWithGemini(char letter) throws IOException {
        String prompt = "Give me a single simple English noun that starts with the letter '" + letter + "'. Only return a concrete, visual noun that can be easily pictured, like 'cat', 'apple', 'car', etc. Do not return abstract words like 'love', 'kind', 'idea', etc. Only return the word, nothing else.";
        // Build Gemini request body
        String json = """
        {
          \"contents\": [
            {
              \"parts\": [
                { \"text\": \"%s\" }
              ]
            }
          ]
        }
        """.formatted(prompt);

        RequestBody body = RequestBody.create(json, MediaType.parse("application/json"));
        HttpUrl url = HttpUrl.parse(geminiEndpoint).newBuilder()
                .addQueryParameter("key", geminiApiKey)
                .build();
        Request request = new Request.Builder()
                .url(url)
                .post(body)
                .addHeader("Content-Type", "application/json")
                .build();

        try (Response response = httpClient.newCall(request).execute()) {
            if (!response.isSuccessful()) {
                throw new IOException("Gemini API failed: " + response.code() + " - " + response.message());
            }
            String responseBody = response.body().string();
            JsonNode jsonNode = objectMapper.readTree(responseBody);
            if (!jsonNode.has("candidates") || jsonNode.get("candidates").size() == 0) {
                throw new IOException("No candidates in Gemini response");
            }
            String text = jsonNode.path("candidates")
                    .path(0)
                    .path("content")
                    .path("parts")
                    .path(0)
                    .path("text")
                    .asText("");
            text = text.replaceAll("[^A-Za-z]", "");
            return text.isEmpty() ? "Unknown" : text;
        }
    }

    private String generateImageWithDalle(String word) throws IOException {
        String prompt = "A simple, clear photo of a " + word + ", white background, no text, no watermark.";
        String json = """
        {
          \"model\": \"dall-e-2\",
          \"prompt\": \"%s\",
          \"n\": 1,
          \"size\": \"256x256\"
        }
        """.formatted(prompt);

        RequestBody body = RequestBody.create(json, MediaType.parse("application/json"));
        Request request = new Request.Builder()
                .url(dallEEndpoint)
                .post(body)
                .addHeader("Authorization", "Bearer " + openaiApiKey)
                .addHeader("Content-Type", "application/json")
                .build();

        try (Response response = httpClient.newCall(request).execute()) {
            if (!response.isSuccessful()) {
                throw new IOException("Failed to call DALL·E: " + response.code() + " - " + response.message());
            }
            String responseBody = response.body().string();
            JsonNode jsonNode = objectMapper.readTree(responseBody);
            String imageUrl = jsonNode.path("data").path(0).path("url").asText();
            // Download the image and convert to Base64
            Request imageRequest = new Request.Builder().url(imageUrl).build();
            try (Response imageResponse = httpClient.newCall(imageRequest).execute()) {
                if (!imageResponse.isSuccessful()) {
                    throw new IOException("Failed to download image: " + imageResponse.code());
                }
                byte[] imageBytes = imageResponse.body().bytes();
                String base64 = Base64.getEncoder().encodeToString(imageBytes);
                return "data:image/png;base64," + base64;
            }
        }
    }
} 