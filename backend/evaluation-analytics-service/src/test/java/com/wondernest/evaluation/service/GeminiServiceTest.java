package com.wondernest.evaluation.service;

import com.wondernest.evaluation.dto.CheckRequest;
import com.wondernest.evaluation.dto.CheckResponse;
import com.wondernest.evaluation.dto.SentenceResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import java.util.List;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

public class GeminiServiceTest {
    
    @Mock
    private GeminiService geminiService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    public void testGenerateIncorrectSentence() {
        // Mock the response instead of making real API calls
        SentenceResponse mockResponse = new SentenceResponse("She go to school everyday.");
        when(geminiService.generateIncorrectSentence()).thenReturn(mockResponse);
        
        SentenceResponse resp = geminiService.generateIncorrectSentence();
        assertNotNull(resp);
        assertNotNull(resp.getSentence());
        assertFalse(resp.getSentence().isEmpty());
        
        verify(geminiService, times(1)).generateIncorrectSentence();
    }

    @Test
    public void testCheckSentence_Correct() {
        // Mock the response instead of making real API calls
        CheckRequest req = new CheckRequest();
        req.setOriginal("She go to school.");
        req.setUserCorrection("She goes to school.");
        
        CheckResponse mockResponse = new CheckResponse(true, "She goes to school.", "Correct!", "She go to school.");
        when(geminiService.checkSentence(any(CheckRequest.class))).thenReturn(mockResponse);
        
        CheckResponse resp = geminiService.checkSentence(req);
        assertNotNull(resp);
        assertNotNull(resp.getFeedback());
        assertTrue(resp.isCorrect());
        assertEquals("She goes to school.", resp.getCorrectSentence());
        
        verify(geminiService, times(1)).checkSentence(any(CheckRequest.class));
    }

    @Test
    public void testGenerateIncorrectSentences() {
        // Mock the response instead of making real API calls
        List<String> mockSentences = List.of(
            "She go to school.",
            "He are playing football.",
            "They was happy."
        );
        when(geminiService.generateIncorrectSentences(anyInt())).thenReturn(mockSentences);
        
        List<String> sentences = geminiService.generateIncorrectSentences(3);
        assertNotNull(sentences);
        assertEquals(3, sentences.size());
        assertTrue(sentences.contains("She go to school."));
        assertTrue(sentences.contains("He are playing football."));
        assertTrue(sentences.contains("They was happy."));
        
        verify(geminiService, times(1)).generateIncorrectSentences(3);
    }
    
    @Test
    public void testCheckResponse_constructor() {
        // Test DTO constructors and getters without API calls
        CheckResponse response = new CheckResponse(true, "Correct sentence", "Great job!", "Original sentence");
        assertTrue(response.isCorrect());
        assertEquals("Correct sentence", response.getCorrectSentence());
        assertEquals("Great job!", response.getFeedback());
        assertEquals("Original sentence", response.getOriginal());
    }
    
    @Test
    public void testSentenceResponse_constructor() {
        // Test DTO constructors and getters without API calls
        SentenceResponse response = new SentenceResponse("Test sentence");
        assertEquals("Test sentence", response.getSentence());
    }
} 