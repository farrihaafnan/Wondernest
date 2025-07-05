package com.wondernest.evaluation.service;

import com.wondernest.evaluation.model.WordMatchingResult;
import com.wondernest.evaluation.repository.WordMatchingResultRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
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
    @InjectMocks
    private WordMatchingService wordMatchingService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    public void testGenerateWordImagePairs() {
        when(geminiService.generateWordForLetter(anyChar())).thenReturn("apple");
        List<Map<String, String>> pairs = wordMatchingService.generateWordImagePairs("A", 1);
        assertNotNull(pairs);
        assertFalse(pairs.isEmpty());
        assertEquals("apple", pairs.get(0).get("word"));
    }

    @Test
    public void testSaveResult() {
        UUID childId = UUID.randomUUID();
        String letterRange = "A-B";
        int score = 5;
        WordMatchingResult result = new WordMatchingResult();
        when(resultRepository.save(any())).thenReturn(result);
        WordMatchingResult saved = wordMatchingService.saveResult(childId, letterRange, score);
        assertNotNull(saved);
        verify(resultRepository, times(1)).save(any());
    }
} 