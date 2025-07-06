package com.wondernest.userlearning.controller;

import com.wondernest.userlearning.dto.SentenceLearningRequest;
import com.wondernest.userlearning.dto.SentenceLearningResponse;
import com.wondernest.userlearning.service.SentenceLearningService;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import javax.sql.DataSource;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(SentenceLearningController.class)
@AutoConfigureMockMvc(addFilters = false)
public class SentenceLearningControllerTest {
    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private SentenceLearningService sentenceLearningService;

    @MockBean
    private DataSource dataSource;

    @Test
    public void testHealthEndpoint() throws Exception {
        mockMvc.perform(get("/api/sentence-learning/health"))
                .andExpect(status().isOk());
    }

    @Test
    public void testEvaluateSentence_businessLogic() throws Exception {
        SentenceLearningRequest req = new SentenceLearningRequest();
        req.setSentence("Hello world");
        SentenceLearningResponse resp = new SentenceLearningResponse(
            null, // imageUrl
            "Correct", // feedback
            true, // isCorrect
            "Hello world", // correctedSentence
            null // imageDescription
        );
        Mockito.when(sentenceLearningService.evaluateSentenceOnly(Mockito.any())).thenReturn(resp);

        mockMvc.perform(post("/api/sentence-learning/evaluate")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"sentence\":\"Hello world\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.feedback").value("Correct"))
                .andExpect(jsonPath("$.correct").value(true))
                .andExpect(jsonPath("$.correctedSentence").value("Hello world"));
    }
} 