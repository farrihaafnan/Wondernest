package com.wondernest.userlearning.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.wondernest.userlearning.dto.StoryRequest;
import com.wondernest.userlearning.model.Story;
import com.wondernest.userlearning.repository.StoryRepository;

import okhttp3.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Value;

import java.io.IOException;
import java.util.Base64;
import java.util.List;
import java.util.UUID;


@Service
public class StoryService {

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
    @Autowired
    private StoryRepository storyRepository;
    @Autowired
    private BehaviorFlagService behaviorFlagService;

    public String generateStoryHtml(StoryRequest request) {
        try {
            // Check for inappropriate content in the prompt
            try {
                var behaviorFlag = behaviorFlagService.checkAndFlagInappropriateContent(
                    request.getChildId(), 
                    "story_generation", 
                    request.getPrompt()
                );
                
                // If inappropriate words detected, stop story generation
                if (behaviorFlag != null) {
                    return generateInappropriateContentResponse();
                }
            } catch (Exception e) {
                System.err.println("[StoryService] Error checking inappropriate content: " + e.getMessage());
                // Continue with normal processing even if behavior flag checking fails
            }
            
            String storyText = generateStoryText(request);
            String image1Url = generateImageUrl(request.getPrompt() + "cartoon scene");
            String image2Url = generateImageUrl("cute fantasy illustration of  " + request.getPrompt());
            String story= formatStoryHtml(request, storyText, image1Url, image2Url);
            saveStory(request.getChildId(), request.getPrompt(), story);
            return story;
        } catch (IOException e) {
            e.printStackTrace();
            return "<p>Error generating story. Please try again later.</p>";
        }
    }

    private String generateStoryText(StoryRequest request) throws IOException {
        String fullPrompt = String.format(
                "Write a short imaginative and age-appropriate story for a %d-year-old %s child named %s. " +
                        "Make the story fun, adventurous, and engaging. Prompt: \"%s\"",
                request.getChildAge(),
                request.getChildGender(),
                request.getChildName(),
                request.getPrompt()
        );

        // Safely build JSON payload using ObjectMapper
        ObjectNode message = objectMapper.createObjectNode();
        message.put("text", fullPrompt);

        ObjectNode parts = objectMapper.createObjectNode();
        parts.putArray("parts").add(message);

        ObjectNode root = objectMapper.createObjectNode();
        root.putArray("contents").add(parts);

        RequestBody body = RequestBody.create(
                objectMapper.writeValueAsString(root),
                MediaType.parse("application/json")
        );

        HttpUrl url = HttpUrl.parse(geminiEndpoint).newBuilder()
                .addQueryParameter("key", geminiApiKey)
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
                       .asText("Oops! No story was generated.");
        }
    }

    
private String generateImageUrl(String prompt) throws IOException {
    String json = """
    {
      "prompt": "%s",
      "n": 1,
      "size": "256x256"
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
        ObjectMapper mapper = new ObjectMapper();
        JsonNode jsonNode = mapper.readTree(responseBody);
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



   private String formatStoryHtml(StoryRequest req, String text, String img1, String img2) {
    String[] paragraphs = text.split("\n\n|\\r?\\n");

    StringBuilder html = new StringBuilder();
    html.append("<div style= line-height: 1.6; font-size: 18px;'>");
    html.append("<h2 style='color: #320a47;'>A Story for ").append(req.getChildName()).append("</h2>");

    for (int i = 0; i < paragraphs.length; ) {
        // Group 3 paragraphs for image1
        if (i == 2 && i + 3 <= paragraphs.length) {
            String combined = String.format(
                "<p>%s</p><p>%s</p><p>%s</p>",
                paragraphs[i].trim(),
                paragraphs[i + 1].trim(),
                paragraphs[i + 2].trim()
            );
            html.append("""
              <div style="display: flex; align-items: flex-start; gap: 24px; margin: 24px 0;">
                <div style="flex: 1; text-align: justify;">%s</div>
                <img src='%s' style='width: 40%%; max-width: 300px; height: auto; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);' />
              </div>
            """.formatted(combined, img1));
            i += 3; // Skip the grouped paragraphs
        }
        // Group 3 paragraphs for image2
        else if (i == paragraphs.length / 2 && i + 3 <= paragraphs.length) {
            String combined = String.format(
                "<p>%s</p><p>%s</p><p>%s</p>",
                paragraphs[i].trim(),
                paragraphs[i + 1].trim(),
                paragraphs[i + 2].trim()
            );
            html.append("""
              <div style="display: flex; align-items: flex-start; gap: 24px; margin: 24px 0;">
                <img src='%s' style='width: 40%%; max-width: 300px; height: auto; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);' />
                <div style="flex: 1; text-align: justify;">%s</div>
              </div>
            """.formatted(img2, combined));
            i += 3;
        }
        // Regular paragraph
        else {
            String para = paragraphs[i].trim();
            if (!para.isEmpty()) {
                html.append("<p style='text-align: justify;'>").append(para).append("</p>");
            }
            i++;
        }
    }

    html.append("</div>");
    return html.toString();
}





    public Story saveStory(UUID childId, String prompt, String storyText) {
        Story story = new Story();
        story.setChildId(childId);
        story.setPrompt(prompt);
        story.setStoryText(storyText);
        return storyRepository.save(story);
    }

    public List<Story> getStoriesByChild(UUID childId) {
        return storyRepository.findByChildId(childId);
    }

    private String generateInappropriateContentResponse() {
        return """
            <div style="text-align: center; padding: 40px; font-family: Arial, sans-serif; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border-radius: 15px; margin: 20px;">
                <div style="font-size: 60px; margin-bottom: 20px;">🚫</div>
                <h2 style="color: #ffeb3b; margin-bottom: 20px;">Oops! Inappropriate Words Detected</h2>
                <p style="font-size: 18px; margin-bottom: 15px; line-height: 1.6;">
                    We noticed some words in your prompt that aren't appropriate for story time.
                </p>
                <p style="font-size: 16px; margin-bottom: 20px; line-height: 1.6;">
                    Please try again with a different prompt using kind and friendly words! 
                    Remember, the best stories come from positive and creative ideas! ✨
                </p>
                <div style="background: rgba(255,255,255,0.1); padding: 15px; border-radius: 10px; margin-top: 20px;">
                    <p style="font-size: 14px; margin: 0;">
                        💡 <strong>Tip:</strong> Try prompts about adventures, magical places, friendly animals, or fun activities!
                    </p>
                </div>
            </div>
            """;
    }

}

