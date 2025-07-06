package com.wondernest.evaluation.service;

import com.wondernest.evaluation.dto.CheckRequest;
import com.wondernest.evaluation.dto.CheckResponse;
import com.wondernest.evaluation.dto.SentenceResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.RestTemplate;
import java.util.List;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

public class GeminiServiceTest {
    @InjectMocks
    private GeminiService geminiService;
    @Mock
    private RestTemplate restTemplate;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    public void testGenerateIncorrectSentence() {
        // This test will just check that a SentenceResponse is returned
        GeminiService service = new GeminiService();
        SentenceResponse resp = service.generateIncorrectSentence();
        assertNotNull(resp);
        assertNotNull(resp.getSentence());
    }

    @Test
    public void testCheckSentence_Correct() {
        GeminiService service = new GeminiService();
        CheckRequest req = new CheckRequest();
        req.setOriginal("She go to school.");
        req.setUserCorrection("She goes to school.");
        CheckResponse resp = service.checkSentence(req);
        assertNotNull(resp);
        assertNotNull(resp.getFeedback());
    }

    @Test
    public void testGenerateIncorrectSentences() {
        GeminiService service = new GeminiService();
        List<String> sentences = service.generateIncorrectSentences(3);
        assertNotNull(sentences);
        assertTrue(sentences.size() <= 3);
    }
} 