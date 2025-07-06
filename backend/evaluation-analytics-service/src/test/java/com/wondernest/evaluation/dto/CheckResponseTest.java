package com.wondernest.evaluation.dto;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

public class CheckResponseTest {
    @Test
    public void testSettersAndGetters() {
        CheckResponse resp = new CheckResponse();
        resp.setCorrect(true);
        resp.setCorrectSentence("corr");
        resp.setFeedback("fb");
        resp.setOriginal("orig");
        assertTrue(resp.isCorrect());
        assertEquals("corr", resp.getCorrectSentence());
        assertEquals("fb", resp.getFeedback());
        assertEquals("orig", resp.getOriginal());
    }

    @Test
    public void testJsonPropertyIsCorrect() throws Exception {
        CheckResponse resp = new CheckResponse(true, "corr", "fb", "orig");
        ObjectMapper mapper = new ObjectMapper();
        String json = mapper.writeValueAsString(resp);
        assertTrue(json.contains("isCorrect"));
    }
} 