package com.wondernest.userlearning.service;

import com.wondernest.userlearning.model.Story;
import com.wondernest.userlearning.repository.StoryRepository;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.List;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;

public class StoryServiceTest {
    @Test
    public void testSaveStory() {
        StoryRepository repo = Mockito.mock(StoryRepository.class);
        StoryService service = new StoryService();
        ReflectionTestUtils.setField(service, "storyRepository", repo);
        Story story = new Story();
        Mockito.when(repo.save(Mockito.any())).thenReturn(story);
        Story result = service.saveStory(UUID.randomUUID(), "prompt", "storyText");
        assertNotNull(result);
    }

    @Test
    public void testGetStoriesByChild() {
        StoryRepository repo = Mockito.mock(StoryRepository.class);
        StoryService service = new StoryService();
        ReflectionTestUtils.setField(service, "storyRepository", repo);
        UUID childId = UUID.randomUUID();
        Mockito.when(repo.findByChildId(childId)).thenReturn(List.of(new Story()));
        List<Story> stories = service.getStoriesByChild(childId);
        assertEquals(1, stories.size());
    }
} 