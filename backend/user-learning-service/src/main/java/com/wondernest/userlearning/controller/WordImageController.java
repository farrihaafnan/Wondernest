package com.wondernest.userlearning.controller;

import com.wondernest.userlearning.model.WordImageResponse;
import com.wondernest.userlearning.service.WordImageService;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = {"http://localhost", "http://localhost:80", "http://localhost:3000", "http://localhost:8080", "http://localhost:8081"})
public class WordImageController {
    private final WordImageService service;

    public WordImageController(WordImageService service) {
        this.service = service;
    }

    @GetMapping("/word-image")
    public WordImageResponse getWordImage(@RequestParam char letter) {
        return service.getWordImage(letter);
    }
} 