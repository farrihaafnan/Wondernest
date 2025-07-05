package com.wondernest.userlearning.dto;

import org.junit.jupiter.api.Test;
import java.util.UUID;
import static org.junit.jupiter.api.Assertions.*;

public class SentenceLearningRequestTest {
    @Test
    public void testSettersAndGetters() {
        SentenceLearningRequest req = new SentenceLearningRequest();
        UUID id = UUID.randomUUID();
        req.setChildId(id);
        req.setChildName("name");
        req.setChildAge(8);
        req.setChildGender("girl");
        req.setSentence("sentence");
        req.setImageDescription("desc");
        assertEquals(id, req.getChildId());
        assertEquals("name", req.getChildName());
        assertEquals(8, req.getChildAge());
        assertEquals("girl", req.getChildGender());
        assertEquals("sentence", req.getSentence());
        assertEquals("desc", req.getImageDescription());
    }
} 