package com.wondernest.evaluation.dto;

import org.junit.jupiter.api.Test;
import java.util.UUID;
import static org.junit.jupiter.api.Assertions.*;

public class SaveSentenceCorrectionRequestTest {
    @Test
    public void testSettersAndGetters() {
        SaveSentenceCorrectionRequest req = new SaveSentenceCorrectionRequest();
        UUID id = UUID.randomUUID();
        req.setChildId(id);
        req.setScore(7);
        assertEquals(id, req.getChildId());
        assertEquals(7, req.getScore());
    }
} 