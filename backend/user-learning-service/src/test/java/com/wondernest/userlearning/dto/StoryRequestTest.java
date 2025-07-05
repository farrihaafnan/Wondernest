package com.wondernest.userlearning.dto;

import org.junit.jupiter.api.Test;
import java.util.UUID;
import static org.junit.jupiter.api.Assertions.*;

public class StoryRequestTest {
    @Test
    public void testSettersAndGetters() {
        StoryRequest req = new StoryRequest();
        UUID id = UUID.randomUUID();
        req.setChildId(id);
        req.setPrompt("prompt");
        req.setChildName("name");
        req.setChildAge(7);
        req.setChildGender("boy");
        assertEquals(id, req.getChildId());
        assertEquals("prompt", req.getPrompt());
        assertEquals("name", req.getChildName());
        assertEquals(7, req.getChildAge());
        assertEquals("boy", req.getChildGender());
    }
} 