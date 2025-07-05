package com.wondernest.userlearning.model;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

public class WordImageResponseTest {
    @Test
    public void testSettersAndGetters() {
        WordImageResponse resp = new WordImageResponse();
        resp.setWord("apple");
        resp.setImageUrl("url");
        assertEquals("apple", resp.getWord());
        assertEquals("url", resp.getImageUrl());
    }

    @Test
    public void testEqualsAndHashCode() {
        WordImageResponse w1 = new WordImageResponse();
        WordImageResponse w2 = new WordImageResponse();
        w1.setWord("a");
        w2.setWord("a");
        w1.setImageUrl("b");
        w2.setImageUrl("b");
        assertEquals(w1, w2);
        assertEquals(w1.hashCode(), w2.hashCode());
    }

    @Test
    public void testToString() {
        WordImageResponse resp = new WordImageResponse();
        resp.setWord("test");
        assertTrue(resp.toString().contains("test"));
    }
} 