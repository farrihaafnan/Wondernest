package com.wondernest.userlearning.repository;

import com.wondernest.userlearning.model.Story;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import java.util.UUID;
import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
public class StoryRepositoryTest {
    @Autowired
    private StoryRepository storyRepository;

    @Test
    public void testSaveAndFindById() {
        Story story = new Story();
        story.setPrompt("prompt");
        story.setStoryText("story text");
        story.setChildId(UUID.randomUUID());
        Story saved = storyRepository.save(story);
        assertNotNull(saved.getId());
        Story found = storyRepository.findById(saved.getId()).orElse(null);
        assertNotNull(found);
        assertEquals("prompt", found.getPrompt());
    }
} 