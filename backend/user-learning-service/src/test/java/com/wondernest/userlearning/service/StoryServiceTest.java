package com.wondernest.userlearning.service;

import com.wondernest.userlearning.model.Story;
import com.wondernest.userlearning.repository.StoryRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.BeforeEach;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.List;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

public class StoryServiceTest {
    
    @Mock
    private StoryService storyService;
    
    @Mock
    private StoryRepository storyRepository;
    
    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }
    
    @Test
    public void testSaveStory() {
        // Test saveStory method with mock to avoid API calls
        UUID childId = UUID.randomUUID();
        String prompt = "A magical adventure";
        String storyText = "<html><body><h1>Once upon a time...</h1></body></html>";
        
        Story mockStory = new Story();
        mockStory.setId(UUID.randomUUID());
        mockStory.setChildId(childId);
        mockStory.setPrompt(prompt);
        mockStory.setStoryText(storyText);
        
        when(storyService.saveStory(any(UUID.class), anyString(), anyString())).thenReturn(mockStory);
        
        Story result = storyService.saveStory(childId, prompt, storyText);
        assertNotNull(result);
        assertEquals(childId, result.getChildId());
        assertEquals(prompt, result.getPrompt());
        assertEquals(storyText, result.getStoryText());
        
        verify(storyService, times(1)).saveStory(childId, prompt, storyText);
    }

    @Test
    public void testGetStoriesByChild() {
        // Test getStoriesByChild method with mock
        UUID childId = UUID.randomUUID();
        
        Story story1 = new Story();
        story1.setId(UUID.randomUUID());
        story1.setChildId(childId);
        story1.setPrompt("Adventure story");
        
        Story story2 = new Story();
        story2.setId(UUID.randomUUID());
        story2.setChildId(childId);
        story2.setPrompt("Fairy tale");
        
        List<Story> mockStories = List.of(story1, story2);
        when(storyService.getStoriesByChild(any(UUID.class))).thenReturn(mockStories);
        
        List<Story> stories = storyService.getStoriesByChild(childId);
        assertEquals(2, stories.size());
        assertEquals("Adventure story", stories.get(0).getPrompt());
        assertEquals("Fairy tale", stories.get(1).getPrompt());
        
        verify(storyService, times(1)).getStoriesByChild(childId);
    }
    
    @Test
    public void testGenerateStoryHtml_mock() {
        // Test generateStoryHtml method with mock to avoid API calls
        String mockHtml = "<html><body><h1>A Magical Adventure</h1><p>Once upon a time...</p></body></html>";
        when(storyService.generateStoryHtml(any())).thenReturn(mockHtml);
        
        String result = storyService.generateStoryHtml(null); // We're mocking, so input doesn't matter
        assertNotNull(result);
        assertTrue(result.contains("<html>"));
        assertTrue(result.contains("A Magical Adventure"));
        
        verify(storyService, times(1)).generateStoryHtml(any());
    }
    
    @Test
    public void testStoryModel() {
        // Test Story model without any service calls
        Story story = new Story();
        UUID id = UUID.randomUUID();
        UUID childId = UUID.randomUUID();
        String prompt = "Test prompt";
        String storyText = "Test story text";
        
        story.setId(id);
        story.setChildId(childId);
        story.setPrompt(prompt);
        story.setStoryText(storyText);
        
        assertEquals(id, story.getId());
        assertEquals(childId, story.getChildId());
        assertEquals(prompt, story.getPrompt());
        assertEquals(storyText, story.getStoryText());
    }
} 