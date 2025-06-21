package com.wondernest.userlearning.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.wondernest.userlearning.dto.SentenceLearningRequest;
import com.wondernest.userlearning.dto.SentenceLearningResponse;
import okhttp3.*;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.Base64;
import java.util.Random;

@Service
public class SentenceLearningService {

    private static final String GEMINI_API_KEY = "AIzaSyBMtAt_HvGPPnWd_CZLsbZ4UFsL_AGaefc";
    private static final String OPENAI_API_KEY = "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";
    private static final String GEMINI_ENDPOINT = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";
    private static final String DALL_E_ENDPOINT = "https://api.openai.com/v1/images/generations";

    private final OkHttpClient httpClient = new OkHttpClient.Builder()
            .connectTimeout(30, java.util.concurrent.TimeUnit.SECONDS)
            .readTimeout(60, java.util.concurrent.TimeUnit.SECONDS)
            .writeTimeout(30, java.util.concurrent.TimeUnit.SECONDS)
            .build();

    private final ObjectMapper objectMapper = new ObjectMapper();
    private final Random random = new Random();

    // Predefined kid-friendly topics for image generation
    private final String[] kidFriendlyTopics = {
        "cute red apple", "friendly orange cat", "colorful butterfly", "happy yellow banana",
        "playful brown dog", "bright red strawberry", "gentle white rabbit", "beautiful blue bird",
        "sweet purple grape", "adorable pink pig", "majestic orange tiger", "cute green frog",
        "friendly brown bear", "bright yellow sun", "beautiful rainbow", "happy orange fish",
        "cute white sheep", "playful brown monkey", "gentle gray elephant", "bright red tomato"
    };

    public SentenceLearningResponse generateImageAndEvaluateSentence(SentenceLearningRequest request) {
        try {
            // Generate a random kid-friendly image
            String imageDescription = getRandomKidFriendlyTopic();
            String imageUrl = generateImageUrl(imageDescription);
            
            // If no sentence is provided, just return the image
            if (request.getSentence() == null || request.getSentence().trim().isEmpty()) {
                return new SentenceLearningResponse(
                    imageUrl,
                    null,
                    false,
                    null,
                    imageDescription
                );
            }
            
            // Evaluate the sentence using Gemini
            String evaluationResult = evaluateSentence(request.getSentence(), imageDescription, request.getChildAge());
            
            // Parse the evaluation result
            SentenceEvaluation evaluation = parseEvaluationResult(evaluationResult);
            
            return new SentenceLearningResponse(
                imageUrl,
                evaluation.feedback,
                evaluation.isCorrect,
                evaluation.correctedSentence,
                imageDescription
            );
            
        } catch (IOException e) {
            e.printStackTrace();
            return new SentenceLearningResponse(
                null,
                "Sorry, there was an error processing your request. Please try again.",
                false,
                null,
                null
            );
        }
    }

    public SentenceLearningResponse evaluateSentenceOnly(SentenceLearningRequest request) {
        try {
            // Evaluate the sentence using Gemini with the provided image description
            String evaluationResult = evaluateSentence(request.getSentence(), request.getImageDescription(), request.getChildAge());
            
            // Parse the evaluation result
            SentenceEvaluation evaluation = parseEvaluationResult(evaluationResult);
            
            return new SentenceLearningResponse(
                null, // No new image URL needed
                evaluation.feedback,
                evaluation.isCorrect,
                evaluation.correctedSentence,
                request.getImageDescription()
            );
            
        } catch (IOException e) {
            e.printStackTrace();
            return new SentenceLearningResponse(
                null,
                "Sorry, there was an error processing your request. Please try again.",
                false,
                null,
                null
            );
        }
    }

    private String getRandomKidFriendlyTopic() {
        return kidFriendlyTopics[random.nextInt(kidFriendlyTopics.length)];
    }

    private String generateImageUrl(String prompt) throws IOException {
        String json = """
        {
          "prompt": "%s, cartoon style, kid friendly, colorful, simple background",
          "n": 1,
          "size": "512x512"
        }
        """.formatted(prompt);

        RequestBody body = RequestBody.create(json, MediaType.parse("application/json"));

        Request request = new Request.Builder()
                .url(DALL_E_ENDPOINT)
                .post(body)
                .addHeader("Authorization", "Bearer " + OPENAI_API_KEY)
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

    private String evaluateSentence(String sentence, String imageDescription, int childAge) throws IOException {
        String prompt = String.format(
            "You are a helpful teacher for a %d-year-old child. " +
            "The child is looking at an image of: %s. " +
            "The child wrote this sentence: \"%s\" " +
            "Please evaluate this sentence and respond in the following JSON format only: " +
            "{\"isCorrect\": true/false, \"feedback\": \"encouraging feedback message\", \"correctedSentence\": \"corrected version if needed, otherwise null\"} " +
            "Consider: " +
            "1. Grammar and spelling correctness " +
            "2. Whether the sentence actually describes the image " +
            "3. Age-appropriate language " +
            "4. Be encouraging and supportive in your feedback " +
            "5. If there are errors, provide a corrected version " +
            "6. If the sentence is correct, set correctedSentence to null",
            childAge, imageDescription, sentence
        );

        ObjectNode message = objectMapper.createObjectNode();
        message.put("text", prompt);

        ObjectNode parts = objectMapper.createObjectNode();
        parts.putArray("parts").add(message);

        ObjectNode root = objectMapper.createObjectNode();
        root.putArray("contents").add(parts);

        RequestBody body = RequestBody.create(
                objectMapper.writeValueAsString(root),
                MediaType.parse("application/json")
        );

        HttpUrl url = HttpUrl.parse(GEMINI_ENDPOINT).newBuilder()
                .addQueryParameter("key", GEMINI_API_KEY)
                .build();

        Request requestObj = new Request.Builder()
                .url(url)
                .post(body)
                .addHeader("Content-Type", "application/json")
                .build();

        try (Response response = httpClient.newCall(requestObj).execute()) {
            if (!response.isSuccessful()) {
                throw new IOException("Gemini API failed: " + response.code() + " - " + response.message());
            }

            String responseBody = response.body().string();
            JsonNode json = objectMapper.readTree(responseBody);

            return json.path("candidates")
                       .path(0)
                       .path("content")
                       .path("parts")
                       .path(0)
                       .path("text")
                       .asText("Error evaluating sentence");
        }
    }

    private SentenceEvaluation parseEvaluationResult(String evaluationResult) {
        try {
            // Try to parse as JSON first
            JsonNode json = objectMapper.readTree(evaluationResult);
            return new SentenceEvaluation(
                json.path("isCorrect").asBoolean(),
                json.path("feedback").asText(),
                json.path("correctedSentence").asText(null)
            );
        } catch (Exception e) {
            // If JSON parsing fails, provide a default response
            return new SentenceEvaluation(
                false,
                "I couldn't evaluate your sentence properly. Please try again!",
                null
            );
        }
    }

    private static class SentenceEvaluation {
        boolean isCorrect;
        String feedback;
        String correctedSentence;

        SentenceEvaluation(boolean isCorrect, String feedback, String correctedSentence) {
            this.isCorrect = isCorrect;
            this.feedback = feedback;
            this.correctedSentence = correctedSentence;
        }
    }
} 