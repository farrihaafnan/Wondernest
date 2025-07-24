package com.wondernest.userlearning.controller;

import com.wondernest.userlearning.dto.RecommendationDto;
import com.wondernest.userlearning.service.RecommendationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/recommendation")
@CrossOrigin(origins = {"http://localhost", "http://localhost:80", "http://localhost:3000"})
public class RecommendationController {
    @Autowired
    private RecommendationService recommendationService;

    @GetMapping("/{childId}")
    public ResponseEntity<List<RecommendationDto>> getRecommendations(@PathVariable UUID childId) {
        List<RecommendationDto> recommendations = recommendationService.getRecommendations(childId);
        return ResponseEntity.ok(recommendations);
    }
} 