package com.wondernest.userlearning.service;

import com.wondernest.userlearning.dto.SentenceLearningRequest;
import com.wondernest.userlearning.dto.SentenceLearningResponse;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

public class SentenceLearningServiceTest {
    @Test
    public void testEvaluateSentenceOnly_missingSentence() {
        SentenceLearningService service = new SentenceLearningService();
        SentenceLearningRequest req = new SentenceLearningRequest();
        req.setSentence("");
        req.setImageDescription("cat on a mat");
        SentenceLearningResponse resp = service.evaluateSentenceOnly(req);
        assertEquals("Please provide a sentence to evaluate.", resp.getFeedback());
        assertFalse(resp.isCorrect());
    }

    @Test
    public void testEvaluateSentenceOnly_missingImageDescription() {
        SentenceLearningService service = new SentenceLearningService();
        SentenceLearningRequest req = new SentenceLearningRequest();
        req.setSentence("A cat on a mat.");
        req.setImageDescription("");
        SentenceLearningResponse resp = service.evaluateSentenceOnly(req);
        assertEquals("Image description is missing. Please try generating a new image.", resp.getFeedback());
        assertFalse(resp.isCorrect());
    }
} 