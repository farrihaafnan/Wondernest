package com.wondernest.userlearning.dto;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

public class SentenceLearningResponseTest {
    @Test
    public void testSettersAndGetters() {
        SentenceLearningResponse resp = new SentenceLearningResponse();
        resp.setImageUrl("img");
        resp.setFeedback("fb");
        resp.setCorrect(true);
        resp.setCorrectedSentence("corr");
        resp.setImageDescription("desc");
        assertEquals("img", resp.getImageUrl());
        assertEquals("fb", resp.getFeedback());
        assertTrue(resp.isCorrect());
        assertEquals("corr", resp.getCorrectedSentence());
        assertEquals("desc", resp.getImageDescription());
    }
} 