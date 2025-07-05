package com.wondernest.evaluation.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.wondernest.evaluation.service.WordMatchingService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import org.springframework.context.annotation.Import;
import com.wondernest.evaluation.config.TestSecurityConfig;
import com.wondernest.evaluation.model.WordMatchingResult;
import static org.hamcrest.Matchers.hasItems;

@WebMvcTest(WordMatchingController.class)
@Import(TestSecurityConfig.class)
public class WordMatchingControllerTest {
    @Autowired
    private MockMvc mockMvc;
    @MockBean
    private WordMatchingService wordMatchingService;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Test
    public void testSubmitWordMatching() throws Exception {
        WordMatchingController.WordMatchingSubmitRequest req = new WordMatchingController.WordMatchingSubmitRequest();
        req.childId = UUID.randomUUID();
        req.letterRange = "A-C";
        req.userMatches = List.of("apple", "banana");
        req.correctWords = List.of("apple", "banana");
        req.score = 2;
        WordMatchingResult saved = new WordMatchingResult();
        java.lang.reflect.Field idField = WordMatchingResult.class.getDeclaredField("id");
        idField.setAccessible(true);
        idField.set(saved, UUID.randomUUID());
        when(wordMatchingService.saveResult(any(), any(), anyInt())).thenReturn(saved);
        mockMvc.perform(post("/api/evaluation/word-matching/submit")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.score").value(2))
                .andExpect(jsonPath("$.correct[0]").value(true));
    }

    @Test
    public void testGenerateWordImagePairs() throws Exception {
        when(wordMatchingService.generateWordImagePairs(anyString(), anyInt())).thenReturn(new java.util.ArrayList<>(List.of(
                Map.of("word", "apple", "imageUrl", "url1"),
                Map.of("word", "banana", "imageUrl", "url2")
        )));
        mockMvc.perform(get("/api/evaluation/word-matching/generate?letterRange=A-C"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.words", hasItems("apple", "banana")))
                .andExpect(jsonPath("$.images", hasItems("url1", "url2")));
    }
} 