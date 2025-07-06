package com.wondernest.userlearning.controller;

import com.wondernest.userlearning.model.WordImageResponse;
import com.wondernest.userlearning.service.WordImageService;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(WordImageController.class)
@AutoConfigureMockMvc(addFilters = false)
public class WordImageControllerTest {
    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private WordImageService wordImageService;

    @Test
    public void testGetWordImage() throws Exception {
        mockMvc.perform(get("/api/word-image").param("letter", "a"))
                .andExpect(status().isOk());
    }

    @Test
    public void testGetWordImage_businessLogic() throws Exception {
        WordImageResponse response = new WordImageResponse();
        response.setWord("Apple");
        response.setImageUrl("http://example.com/apple.png");
        Mockito.when(wordImageService.getWordImage('a')).thenReturn(response);
        mockMvc.perform(get("/api/word-image").param("letter", "a"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.word").value("Apple"))
                .andExpect(jsonPath("$.imageUrl").value("http://example.com/apple.png"));
    }
} 