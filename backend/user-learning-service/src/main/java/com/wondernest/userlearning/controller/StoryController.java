package com.wondernest.userlearning.controller;

import com.wondernest.userlearning.dto.StoryRequest;
import com.wondernest.userlearning.model.Story;
import com.wondernest.userlearning.repository.StoryRepository;
import com.wondernest.userlearning.service.StoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/story")
public class StoryController {

    @Autowired
    private StoryService storyService;

    @Autowired
    private StoryRepository storyRepository; // ✅ Fix: Add this line

    @PostMapping("/generate")
        public ResponseEntity<Map<String, String>> generateStory(@RequestBody StoryRequest request) {
        System.out.println("sending request");
        String story = storyService.generateStoryHtml(request);
        System.out.println(story);
        Map<String, String> response = new HashMap<>();
        response.put("story", story);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/list/{childId}")
    public ResponseEntity<List<Map<String, Object>>> getStoriesByChild(@PathVariable UUID childId) {
        List<Story> stories = storyService.getStoriesByChild(childId);
        List<Map<String, Object>> result = stories.stream().map(s -> {
            Map<String, Object> m = new HashMap<>();
            m.put("id", s.getId());
            m.put("prompt", s.getPrompt());
            return m;
        }).toList();
        return ResponseEntity.ok(result);
    }

    @GetMapping("/{id}")
    public ResponseEntity<String> getStoryHtml(@PathVariable UUID id) {
        return storyRepository.findById(id)
                .map(story -> ResponseEntity.ok(story.getStoryText()))
                .orElse(ResponseEntity.notFound().build());
    }
}
