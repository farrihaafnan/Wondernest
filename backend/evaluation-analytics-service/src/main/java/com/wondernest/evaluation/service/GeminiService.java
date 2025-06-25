//package com.wondernest.evaluation.service;
//
//import com.fasterxml.jackson.databind.JsonNode;
//import com.fasterxml.jackson.databind.ObjectMapper;
//import com.wondernest.evaluation.dto.CheckRequest;
//import com.wondernest.evaluation.dto.CheckResponse;
//import com.wondernest.evaluation.dto.SentenceResponse;
//import org.slf4j.Logger;
//import org.slf4j.LoggerFactory;
//import org.springframework.beans.factory.annotation.Value;
//import org.springframework.http.*;
//import org.springframework.stereotype.Service;
//import org.springframework.web.client.RestTemplate;
//
//import java.util.ArrayList;
//import java.util.List;
//
//@Service
//public class GeminiService {
//    private static final Logger logger = LoggerFactory.getLogger(GeminiService.class);
//
//    @Value("${gemini.api.key}")
//    private String geminiApiKey;
//
//    private static final String GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=";
//    private final RestTemplate restTemplate = new RestTemplate();
//    private final ObjectMapper objectMapper = new ObjectMapper();
//
//    public SentenceResponse generateIncorrectSentence() {
//        // Prompt Gemini to generate a grammatically incorrect sentence
//        String prompt = "Generate a short English sentence that is grammatically incorrect. Only return the sentence.";
//        String sentence = callGemini(prompt);
//        return new SentenceResponse(sentence);
//    }
//
//    public CheckResponse checkSentence(CheckRequest request) {
//        String prompt = String.format(
//            "The following sentence is incorrect: '%s'. The user tried to correct it as: '%s'. " +
//            "Is the user's correction correct? Reply with 'yes' or 'no'. If no, provide the correct sentence.",
//            request.getOriginal(), request.getUserCorrection()
//        );
//        String geminiReply = callGemini(prompt);
//        logger.info("Gemini reply: {}", geminiReply); // Log for debugging
//
//        String replyLower = geminiReply.trim().toLowerCase();
//        boolean isCorrect;
//        String correctSentence;
//        String feedback;
//
//        if (replyLower.startsWith("yes")) {
//            isCorrect = true;
//            correctSentence = request.getUserCorrection().trim();
//            feedback = "Correct!";
//        } else {
//            // Extract the correct sentence from Gemini's reply
//            correctSentence = extractCorrectSentenceFromGeminiReply(geminiReply);
//            if (correctSentence == null || correctSentence.isEmpty()) {
//                correctSentence = request.getUserCorrection().trim();
//            }
//            // Compare normalized user correction and correct sentence
//            String userCorrectionNorm = normalizeSentence(request.getUserCorrection());
//            String correctSentenceNorm = normalizeSentence(correctSentence);
//            isCorrect = userCorrectionNorm.equals(correctSentenceNorm);
//            feedback = isCorrect ? "Correct!" : "Incorrect. The correct sentence is: " + correctSentence;
//        }
//        return new CheckResponse(isCorrect, correctSentence, feedback);
//    }
//
//    // Helper to extract the correct sentence from Gemini's reply
//    private String extractCorrectSentenceFromGeminiReply(String reply) {
//        // Try to find after 'The correct sentence is:'
//        String lower = reply.toLowerCase();
//        int idx = lower.indexOf("the correct sentence is");
//        if (idx != -1) {
//            String after = reply.substring(idx + "the correct sentence is".length());
//            after = after.replaceAll("[:：]", "").trim();
//            // Remove quotes/backticks
//            after = after.replaceAll("[\"'`]+", "").trim();
//            // If there's a period at the end, keep it
//            if (!after.isEmpty()) return after;
//        }
//        // Try to find quoted sentence
//        int firstQuote = reply.indexOf("'");
//        int lastQuote = reply.lastIndexOf("'");
//        if (firstQuote != lastQuote && firstQuote != -1 && lastQuote != -1) {
//            String quoted = reply.substring(firstQuote + 1, lastQuote).trim();
//            if (!quoted.isEmpty()) return quoted;
//        }
//        // Try after colon
//        int colonIdx = reply.indexOf(":");
//        if (colonIdx != -1 && colonIdx + 1 < reply.length()) {
//            String afterColon = reply.substring(colonIdx + 1).replaceAll("[\"'`]+", "").trim();
//            if (!afterColon.isEmpty() && afterColon.length() < 200) return afterColon;
//        }
//        // Fallback: use the whole reply, cleaned
//        String cleaned = reply.replaceAll("[\"'`]+", "").trim();
//        // If reply starts with yes/no, remove it
//        cleaned = cleaned.replaceFirst("(?i)^(yes|no)[.:]*", "").trim();
//        // Use only the first line if multiple lines
//        if (cleaned.contains("\n")) cleaned = cleaned.split("\n")[0].trim();
//        return cleaned;
//    }
//
//    // Helper to normalize sentences for comparison
//    private String normalizeSentence(String s) {
//        if (s == null) return "";
//        // Lowercase, trim, collapse multiple spaces, remove all punctuation except apostrophes
//        String norm = s.trim().toLowerCase();
//        // Remove all punctuation except apostrophes
//        norm = norm.replaceAll("[^\\w' ]", "");
//        // Collapse multiple spaces
//        norm = norm.replaceAll("\\s+", " ");
//        // Remove trailing period or space
//        norm = norm.replaceAll("[. ]+$", "");
//        return norm;
//    }
//
//    public List<String> generateIncorrectSentences(int count) {
//        // Generate sentences one by one for better accuracy
//        List<String> sentences = new ArrayList<>();
//        int attempts = 0;
//        while (sentences.size() < count && attempts < count * 3) { // avoid infinite loop
//            SentenceResponse resp = generateIncorrectSentence();
//            String s = resp.getSentence();
//            if (s != null && !s.trim().isEmpty() && !sentences.contains(s.trim())) {
//                sentences.add(s.trim());
//            }
//            attempts++;
//        }
//        logger.info("Sentences returned (one by one): {}", sentences);
//        return sentences;
//    }
//
//    private String callGemini(String prompt) {
//        try {
//            String url = GEMINI_API_URL + geminiApiKey;
//            HttpHeaders headers = new HttpHeaders();
//            headers.setContentType(MediaType.APPLICATION_JSON);
//            String body = "{\"contents\":[{\"parts\":[{\"text\":\"" + prompt.replace("\"", "\\\"") + "\"}]}]}";
//            HttpEntity<String> entity = new HttpEntity<>(body, headers);
//            ResponseEntity<String> response = restTemplate.postForEntity(url, entity, String.class);
//            if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
//                JsonNode root = objectMapper.readTree(response.getBody());
//                JsonNode candidates = root.path("candidates");
//                if (candidates.isArray() && candidates.size() > 0) {
//                    JsonNode content = candidates.get(0).path("content");
//                    JsonNode parts = content.path("parts");
//                    if (parts.isArray() && parts.size() > 0) {
//                        return parts.get(0).path("text").asText();
//                    }
//                }
//            }
//            return "[Gemini API did not return a valid response]";
//        } catch (Exception e) {
//            return "[Gemini API error: " + e.getMessage() + "]";
//        }
//    }
//}








package com.wondernest.evaluation.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.wondernest.evaluation.dto.CheckRequest;
import com.wondernest.evaluation.dto.CheckResponse;
import com.wondernest.evaluation.dto.SentenceResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.List;

@Service
public class GeminiService {
    private static final Logger logger = LoggerFactory.getLogger(GeminiService.class);

    @Value("${gemini.api.key}")
    private String geminiApiKey;

    private static final String GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=";
    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    public SentenceResponse generateIncorrectSentence() {
        String prompt = "Generate a short English sentence that is grammatically incorrect. Only return the sentence.";
        String sentence = callGemini(prompt);
        return new SentenceResponse(sentence);
    }

    public CheckResponse checkSentence(CheckRequest request) {
        String prompt = String.format(
                "The following sentence is incorrect: '%s'. The user tried to correct it as: '%s'.\n" +
                        "Reply in JSON format: {\"isCorrect\": true/false, \"correctSentence\": \"...\"}.",
                request.getOriginal(), request.getUserCorrection()
        );

        String geminiReply = callGemini(prompt);
        logger.info("Gemini reply: {}", geminiReply);

        boolean isCorrect = false;
        String correctSentence = request.getUserCorrection();
        String feedback = "Incorrect.";

        try {
            // --------- STRIP TRIPLE BACKTICKS AND 'json' LABEL ----------
            String geminiReplyStripped = geminiReply
                    .replaceAll("(?s)```json", "")
                    .replaceAll("(?s)```", "")
                    .trim();

            // Check for Gemini API quota error
            if (geminiReplyStripped.contains("429 Too Many Requests")) {
                feedback = "[Gemini API quota exceeded. Please try again later or check your API usage.]";
                return new CheckResponse(false, correctSentence, feedback, request.getOriginal());
            }

            JsonNode json = objectMapper.readTree(geminiReplyStripped);
            isCorrect = json.path("isCorrect").asBoolean(false);
            correctSentence = json.path("correctSentence").asText().trim();
            if (isCorrect) {
                feedback = "Correct!";
            } else {
                // Compare normalized fallback if Gemini misflags
                String normUser = normalizeSentence(request.getUserCorrection());
                String normCorrect = normalizeSentence(correctSentence);
                isCorrect = normUser.equals(normCorrect);
                feedback = isCorrect ? "Correct!" : "Incorrect. The correct sentence is: " + correctSentence;
            }
        } catch (Exception e) {
            logger.error("Failed to parse Gemini JSON reply: {}", e.getMessage());
            feedback = "[Invalid response from Gemini: " + geminiReply + "]";
        }

        return new CheckResponse(isCorrect, correctSentence, feedback, request.getOriginal());
    }

    private String normalizeSentence(String s) {
        if (s == null) return "";
        String norm = s.trim().toLowerCase();
        norm = norm.replaceAll("[^\\w' ]", "");
        norm = norm.replaceAll("\\s+", " ");
        return norm.replaceAll("[. ]+$", "");
    }

    public List<String> generateIncorrectSentences(int count) {
        List<String> sentences = new ArrayList<>();
        int attempts = 0;
        while (sentences.size() < count && attempts < count * 3) {
            SentenceResponse resp = generateIncorrectSentence();
            String s = resp.getSentence();
            if (s != null && !s.trim().isEmpty() && !sentences.contains(s.trim())) {
                sentences.add(s.trim());
            }
            attempts++;
        }
        logger.info("Sentences returned: {}", sentences);
        return sentences;
    }

    private String callGemini(String prompt) {
        try {
            String url = GEMINI_API_URL + geminiApiKey;
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            String body = "{\"contents\":[{\"parts\":[{\"text\":\"" + prompt.replace("\"", "\\\"") + "\"}]}]}";
            HttpEntity<String> entity = new HttpEntity<>(body, headers);
            ResponseEntity<String> response = restTemplate.postForEntity(url, entity, String.class);
            if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
                JsonNode root = objectMapper.readTree(response.getBody());
                JsonNode text = root.path("candidates").get(0).path("content").path("parts").get(0).path("text");
                return text.asText();
            }
            return "{\"isCorrect\": false, \"correctSentence\": \"[Gemini returned an invalid response]\"}";
        } catch (Exception e) {
            return "{\"isCorrect\": false, \"correctSentence\": \"[Gemini API error: " + e.getMessage() + "]\"}";
        }
    }

    public String generateWordForLetter(char letter) {
        String prompt = "Give me a single simple English word (for a word matching test of a child, please give a valid word so that its image can be generated for matching, possibly a noun ) that starts with the letter '" + letter + "'. Only return the word, nothing else.";
        String word = callGemini(prompt);
        if (word == null) return "";
        // Clean up the word: remove non-letters, trim, and capitalize
        word = word.replaceAll("[^A-Za-z]", "").trim();
        if (word.isEmpty()) return "";
        return word.substring(0, 1).toUpperCase() + word.substring(1).toLowerCase();
    }
}
