package com.wondernest.userlearning.controller;

import com.wondernest.userlearning.model.WordImageResponse;
import com.wondernest.userlearning.service.WordImageService;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000")
public class WordImageController {
    private final WordImageService service;

    public WordImageController(WordImageService service) {
        this.service = service;
    }

    @GetMapping("/words")
    public List<WordImageResponse> getWords(@RequestParam String range) {
        // Example range: "A-E"
        String[] parts = range.split("-");
        char start = parts[0].charAt(0);
        char end = parts[1].charAt(0);
        return service.getWordImages(start, end);
    }
} 