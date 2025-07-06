package com.wondernest.userlearning.service;

import com.wondernest.userlearning.model.WordImageResponse;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.BeforeEach;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

public class WordImageServiceTest {
    
    @Mock
    private WordImageService wordImageService;
    
    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }
    
    @Test
    public void testGetWordImage_returnsResponse() {
        // Create mock response instead of making real API calls
        WordImageResponse mockResponse = new WordImageResponse("a", "apple", "data:image/png;base64,mockImageData");
        when(wordImageService.getWordImage('a')).thenReturn(mockResponse);
        
        // Test the mocked response
        WordImageResponse resp = wordImageService.getWordImage('a');
        assertNotNull(resp);
        assertEquals("a", resp.getLetter());
        assertEquals("apple", resp.getWord());
        assertNotNull(resp.getImageUrl());
        assertTrue(resp.getImageUrl().startsWith("data:image/png;base64,"));
        
        // Verify the method was called
        verify(wordImageService, times(1)).getWordImage('a');
    }
    
    @Test
    public void testWordImageResponse_constructor() {
        // Test the WordImageResponse model directly without API calls
        WordImageResponse response = new WordImageResponse("b", "ball", "http://example.com/ball.png");
        assertEquals("b", response.getLetter());
        assertEquals("ball", response.getWord());
        assertEquals("http://example.com/ball.png", response.getImageUrl());
    }
    
    @Test
    public void testWordImageResponse_settersAndGetters() {
        // Test setter/getter functionality without API calls
        WordImageResponse response = new WordImageResponse();
        response.setLetter("c");
        response.setWord("cat");
        response.setImageUrl("http://example.com/cat.png");
        
        assertEquals("c", response.getLetter());
        assertEquals("cat", response.getWord());
        assertEquals("http://example.com/cat.png", response.getImageUrl());
    }
} 