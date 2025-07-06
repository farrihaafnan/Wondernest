package com.wondernest.evaluation.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.wondernest.evaluation.config.TestSecurityConfig;
import com.wondernest.evaluation.dto.CheckRequest;
import com.wondernest.evaluation.dto.CheckResponse;
import com.wondernest.evaluation.dto.SaveSentenceCorrectionRequest;
import com.wondernest.evaluation.dto.SentenceResponse;
import com.wondernest.evaluation.model.SentenceCorrection;
import com.wondernest.evaluation.repository.SentenceCorrectionRepository;
import com.wondernest.evaluation.service.GeminiService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import java.util.List;
import java.util.UUID;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(SentenceEvaluationController.class)
@Import(TestSecurityConfig.class)
public class SentenceEvaluationControllerTest {
    @Autowired
    private MockMvc mockMvc;
    @MockBean
    private GeminiService geminiService;
    @MockBean
    private SentenceCorrectionRepository sentenceCorrectionRepository;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Test
    public void testCheckSentence() throws Exception {
        CheckRequest req = new CheckRequest();
        req.setOriginal("orig");
        req.setUserCorrection("corr");
        CheckResponse resp = new CheckResponse();
        resp.setCorrect(true);
        resp.setCorrectSentence("corr");
        resp.setFeedback("Good job!");
        when(geminiService.checkSentence(any())).thenReturn(resp);
        mockMvc.perform(post("/api/evaluation/check")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.isCorrect").value(true))
                .andExpect(jsonPath("$.feedback").value("Good job!"));
    }

    @Test
    public void testSaveSentenceCorrection() throws Exception {
        SaveSentenceCorrectionRequest req = new SaveSentenceCorrectionRequest();
        req.setChildId(UUID.randomUUID());
        req.setScore(5);
        SentenceCorrection saved = new SentenceCorrection();
        java.lang.reflect.Field idField = SentenceCorrection.class.getDeclaredField("id");
        idField.setAccessible(true);
        idField.set(saved, UUID.randomUUID());
        when(sentenceCorrectionRepository.save(any())).thenReturn(saved);
        mockMvc.perform(post("/api/evaluation/sentence-correction")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk());
    }
} 