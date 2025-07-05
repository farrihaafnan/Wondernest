package com.wondernest.userlearning.service;

import com.wondernest.userlearning.model.WordImageResponse;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

public class WordImageServiceTest {
    @Test
    public void testGetWordImage_returnsResponse() {
        WordImageService service = new WordImageService();
        WordImageResponse resp = service.getWordImage('a');
        assertNotNull(resp);
        assertEquals("a", resp.getLetter());
        assertNotNull(resp.getWord());
        assertNotNull(resp.getImageUrl());
    }
} 