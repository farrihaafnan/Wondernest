package com.wondernest.evaluation.dto;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

public class SentenceResponseTest {
    @Test
    public void testSettersAndGetters() {
        SentenceResponse resp = new SentenceResponse();
        resp.setSentence("test");
        assertEquals("test", resp.getSentence());
    }
} 