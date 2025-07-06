package com.wondernest.userlearning.model;

import org.junit.jupiter.api.Test;
import java.util.UUID;
import static org.junit.jupiter.api.Assertions.*;

public class StoryTest {
    @Test
    public void testSettersAndGetters() {
        Story story = new Story();
        UUID id = UUID.randomUUID();
        story.setId(id);
        story.setPrompt("prompt");
        story.setStoryText("story text");
        story.setChildId(id);
        assertEquals(id, story.getId());
        assertEquals("prompt", story.getPrompt());
        assertEquals("story text", story.getStoryText());
        assertEquals(id, story.getChildId());
    }

    @Test
    public void testEqualsAndHashCode() {
        Story s1 = new Story();
        Story s2 = new Story();
        UUID id = UUID.randomUUID();
        s1.setId(id);
        s2.setId(id);
        assertEquals(s1, s2);
        assertEquals(s1.hashCode(), s2.hashCode());
    }

    @Test
    public void testToString() {
        Story story = new Story();
        story.setPrompt("test");
        assertTrue(story.toString().contains("test"));
    }
} 