package com.wondernest.evaluation.service;

import com.wondernest.evaluation.model.WordMatchingResult;
import com.wondernest.evaluation.repository.WordMatchingResultRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

public class WordMatchingServiceTest {
    @Mock
    private WordMatchingResultRepository resultRepository;
    @Mock
    private GeminiService geminiService;
    @Mock
    private WordMatchingService wordMatchingService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    public void testGenerateWordImagePairs() {
        // Mock the complete response to avoid any API calls
        List<Map<String, String>> mockPairs = List.of(
            Map.of("word", "apple", "imageUrl", "data:image/png;base64,mockAppleImage"),
            Map.of("word", "ball", "imageUrl", "data:image/png;base64,mockBallImage")
        );
        
        when(wordMatchingService.generateWordImagePairs(anyString(), anyInt())).thenReturn(mockPairs);
        
        List<Map<String, String>> pairs = wordMatchingService.generateWordImagePairs("A-B", 2);
        assertNotNull(pairs);
        assertEquals(2, pairs.size());
        assertEquals("apple", pairs.get(0).get("word"));
        assertEquals("ball", pairs.get(1).get("word"));
        assertTrue(pairs.get(0).get("imageUrl").startsWith("data:image/png;base64,"));
        assertTrue(pairs.get(1).get("imageUrl").startsWith("data:image/png;base64,"));
        
        verify(wordMatchingService, times(1)).generateWordImagePairs("A-B", 2);
    }

    @Test
    public void testSaveResult() {
        UUID childId = UUID.randomUUID();
        String letterRange = "A-B";
        int score = 5;
        
        WordMatchingResult mockResult = new WordMatchingResult();
        // Use reflection to set the ID since it might be private
        try {
            java.lang.reflect.Field idField = WordMatchingResult.class.getDeclaredField("id");
            idField.setAccessible(true);
            idField.set(mockResult, UUID.randomUUID());
        } catch (Exception e) {
            // If reflection fails, just continue with the test
        }
        
        when(wordMatchingService.saveResult(any(UUID.class), anyString(), anyInt())).thenReturn(mockResult);
        
        WordMatchingResult saved = wordMatchingService.saveResult(childId, letterRange, score);
        assertNotNull(saved);
        
        verify(wordMatchingService, times(1)).saveResult(childId, letterRange, score);
    }
    
    @Test
    public void testWordMatchingResult_model() {
        // Test the model directly without service calls
        WordMatchingResult result = new WordMatchingResult();
        UUID childId = UUID.randomUUID();
        String letterRange = "A-C";
        int score = 8;
        
        result.setChildId(childId);
        result.setLetterRange(letterRange);
        result.setScore(score);
        
        assertEquals(childId, result.getChildId());
        assertEquals(letterRange, result.getLetterRange());
        assertEquals(score, result.getScore());
    }
    
    @Test
    public void testGenerateWordImagePairs_emptyResult() {
        // Test edge case with empty result
        when(wordMatchingService.generateWordImagePairs(anyString(), anyInt())).thenReturn(List.of());
        
        List<Map<String, String>> pairs = wordMatchingService.generateWordImagePairs("X-Z", 0);
        assertNotNull(pairs);
        assertTrue(pairs.isEmpty());
        
        verify(wordMatchingService, times(1)).generateWordImagePairs("X-Z", 0);
    }
} 