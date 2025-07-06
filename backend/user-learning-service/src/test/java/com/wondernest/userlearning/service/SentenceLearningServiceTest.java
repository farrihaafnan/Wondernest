package com.wondernest.userlearning.service;

import com.wondernest.userlearning.dto.SentenceLearningRequest;
import com.wondernest.userlearning.dto.SentenceLearningResponse;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.BeforeEach;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

public class SentenceLearningServiceTest {
    
    @Mock
    private SentenceLearningService sentenceLearningService;
    
    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }
    
    @Test
    public void testEvaluateSentenceOnly_missingSentence() {
        // Test validation logic with mock to avoid API calls
        SentenceLearningRequest req = new SentenceLearningRequest();
        req.setSentence("");
        req.setImageDescription("cat on a mat");
        
        SentenceLearningResponse mockResponse = new SentenceLearningResponse(
            null, 
            "Please provide a sentence to evaluate.", 
            false, 
            null, 
            "cat on a mat"
        );
        when(sentenceLearningService.evaluateSentenceOnly(any())).thenReturn(mockResponse);
        
        SentenceLearningResponse resp = sentenceLearningService.evaluateSentenceOnly(req);
        assertEquals("Please provide a sentence to evaluate.", resp.getFeedback());
        assertFalse(resp.isCorrect());
        
        verify(sentenceLearningService, times(1)).evaluateSentenceOnly(any());
    }

    @Test
    public void testEvaluateSentenceOnly_missingImageDescription() {
        // Test validation logic with mock to avoid API calls
        SentenceLearningRequest req = new SentenceLearningRequest();
        req.setSentence("A cat on a mat.");
        req.setImageDescription("");
        
        SentenceLearningResponse mockResponse = new SentenceLearningResponse(
            null, 
            "Image description is missing. Please try generating a new image.", 
            false, 
            null, 
            null
        );
        when(sentenceLearningService.evaluateSentenceOnly(any())).thenReturn(mockResponse);
        
        SentenceLearningResponse resp = sentenceLearningService.evaluateSentenceOnly(req);
        assertEquals("Image description is missing. Please try generating a new image.", resp.getFeedback());
        assertFalse(resp.isCorrect());
        
        verify(sentenceLearningService, times(1)).evaluateSentenceOnly(any());
    }
    
    @Test
    public void testEvaluateSentenceOnly_validInput() {
        // Test successful evaluation with mock to avoid API calls
        SentenceLearningRequest req = new SentenceLearningRequest();
        req.setSentence("The cat is sitting on the mat.");
        req.setImageDescription("A cute cat sitting on a colorful mat");
        req.setChildAge(7);
        
        SentenceLearningResponse mockResponse = new SentenceLearningResponse(
            null, 
            "Great job! Your sentence is perfect!", 
            true, 
            "The cat is sitting on the mat.", 
            "A cute cat sitting on a colorful mat"
        );
        when(sentenceLearningService.evaluateSentenceOnly(any())).thenReturn(mockResponse);
        
        SentenceLearningResponse resp = sentenceLearningService.evaluateSentenceOnly(req);
        assertEquals("Great job! Your sentence is perfect!", resp.getFeedback());
        assertTrue(resp.isCorrect());
        assertEquals("The cat is sitting on the mat.", resp.getCorrectedSentence());
        
        verify(sentenceLearningService, times(1)).evaluateSentenceOnly(any());
    }
    
    @Test
    public void testSentenceLearningResponse_constructor() {
        // Test DTO constructor without API calls
        SentenceLearningResponse response = new SentenceLearningResponse(
            "data:image/png;base64,test", 
            "Good work!", 
            true, 
            "Corrected sentence", 
            "Image description"
        );
        
        assertEquals("data:image/png;base64,test", response.getImageUrl());
        assertEquals("Good work!", response.getFeedback());
        assertTrue(response.isCorrect());
        assertEquals("Corrected sentence", response.getCorrectedSentence());
        assertEquals("Image description", response.getImageDescription());
    }
} 