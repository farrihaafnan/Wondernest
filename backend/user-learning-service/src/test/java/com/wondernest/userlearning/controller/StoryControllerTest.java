package com.wondernest.userlearning.controller;

import com.wondernest.userlearning.dto.StoryRequest;
import com.wondernest.userlearning.model.Story;
import com.wondernest.userlearning.repository.StoryRepository;
import com.wondernest.userlearning.service.StoryService;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import java.util.*;
import static org.mockito.ArgumentMatchers.any;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(StoryController.class)
@AutoConfigureMockMvc(addFilters = false)
public class StoryControllerTest {
    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private StoryRepository storyRepository;

    @MockBean
    private StoryService storyService;

    @Test
    public void testGenerateStory_businessLogic() throws Exception {
        Mockito.when(storyService.generateStoryHtml(any())).thenReturn("Once upon a time...");
        mockMvc.perform(post("/api/story/generate")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"prompt\":\"A prompt\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.story").value("Once upon a time..."));
    }

    @Test
    public void testGetStoriesByChild_businessLogic() throws Exception {
        UUID mockChildId = UUID.randomUUID();
        Story story = new Story();
        story.setId(UUID.randomUUID());
        story.setPrompt("A prompt");
        Mockito.when(storyService.getStoriesByChild(any(UUID.class))).thenReturn(List.of(story));
        mockMvc.perform(get("/api/story/list/" + mockChildId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].prompt").value("A prompt"));
    }

    @Test
    public void testGetStoryHtml_businessLogic() throws Exception {
        UUID mockId = UUID.randomUUID();
        Story story = new Story();
        story.setId(mockId);
        story.setStoryText("<p>Story HTML</p>");
        Mockito.when(storyRepository.findById(mockId)).thenReturn(Optional.of(story));
        mockMvc.perform(get("/api/story/" + mockId))
                .andExpect(status().isOk())
                .andExpect(content().string("<p>Story HTML</p>"));
    }
} 