package com.wondernest.userlearning.service;

import org.springframework.stereotype.Service;

import java.util.*;
import java.util.regex.Pattern;

@Service
public class OffensiveWordsDetectionService {

    // List of offensive words to detect
    private static final Set<String> OFFENSIVE_WORDS = new HashSet<>(Arrays.asList(
        // Mild inappropriate words
        "stupid", "dumb", "idiot", "fool", "moron", "jerk", "hate", "kill", "die", "dead",
        "shut up", "shutup", "damn", "hell", "crap", "suck", "sucks", "loser", "ugly","crapy",
        
        // Strong profanity (basic examples - can be expanded)
        "fuck", "shit", "bitch", "ass", "asshole", "bastard", "piss", "damn", "fucking",
        
        // Bullying related words
        "fat", "fatty", "skinny", "weird", "freak", "nerd", "geek", "loser", "stupid",
        
        // Violence related
        "punch", "hit", "fight", "attack", "hurt", "pain", "blood", "weapon", "gun", "knife",
        
        // Inappropriate content
        "sex", "sexy", "naked", "nude", "boobs", "penis", "vagina",
        
        // Discrimination related
        "racist", "retard", "retarded", "gay", "fag", "faggot",
        
        // Common variations and shortcuts
        "wtf", "stfu", "omfg", "fck", "sht", "btch", "dmn"
    ));

    // Patterns for leetspeak and common substitutions
    private static final Map<Character, String> SUBSTITUTIONS = new HashMap<>();
    static {
        SUBSTITUTIONS.put('4', "a");
        SUBSTITUTIONS.put('3', "e");
        SUBSTITUTIONS.put('1', "i");
        SUBSTITUTIONS.put('0', "o");
        SUBSTITUTIONS.put('5', "s");
        SUBSTITUTIONS.put('@', "a");
        SUBSTITUTIONS.put('!', "i");
        SUBSTITUTIONS.put('$', "s");
    }

    /**
     * Detect offensive words in a given text
     * @param text The text to analyze
     * @return List of detected offensive words
     */
    public List<String> detectOffensiveWords(String text) {
        if (text == null || text.trim().isEmpty()) {
            return Collections.emptyList();
        }

        List<String> detectedWords = new ArrayList<>();
        String normalizedText = normalizeText(text);
        
        // Check for exact matches
        for (String offensiveWord : OFFENSIVE_WORDS) {
            if (containsWord(normalizedText, offensiveWord)) {
                if (!detectedWords.contains(offensiveWord)) {
                    detectedWords.add(offensiveWord);
                }
            }
        }

        return detectedWords;
    }

    /**
     * Check if the text contains inappropriate content
     * @param text The text to check
     * @return true if inappropriate content is detected
     */
    public boolean hasInappropriateContent(String text) {
        return !detectOffensiveWords(text).isEmpty();
    }

    /**
     * Normalize text for better detection
     * - Convert to lowercase
     * - Replace common substitutions (leetspeak)
     * - Remove extra spaces and punctuation
     */
    private String normalizeText(String text) {
        String normalized = text.toLowerCase();
        
        // Replace common substitutions
        for (Map.Entry<Character, String> sub : SUBSTITUTIONS.entrySet()) {
            normalized = normalized.replace(sub.getKey(), sub.getValue().charAt(0));
        }
        
        // Remove punctuation except spaces
        normalized = normalized.replaceAll("[^\\w\\s]", " ");
        
        // Remove extra spaces
        normalized = normalized.replaceAll("\\s+", " ").trim();
        
        return normalized;
    }

    /**
     * Check if text contains a specific word as a whole word
     */
    private boolean containsWord(String text, String word) {
        // Create word boundary pattern
        String pattern = "\\b" + Pattern.quote(word) + "\\b";
        return Pattern.compile(pattern, Pattern.CASE_INSENSITIVE).matcher(text).find();
    }

    /**
     * Get the current list of offensive words (for testing/debugging)
     */
    public Set<String> getOffensiveWordsList() {
        return new HashSet<>(OFFENSIVE_WORDS);
    }

    /**
     * Add custom offensive words (for configuration)
     */
    public void addOffensiveWords(String... words) {
        for (String word : words) {
            if (word != null && !word.trim().isEmpty()) {
                OFFENSIVE_WORDS.add(word.toLowerCase().trim());
            }
        }
    }
}
