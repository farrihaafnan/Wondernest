package com.wondernest.userlearning.controller;

import com.wondernest.userlearning.dto.AvgScoresDto;
import com.wondernest.userlearning.service.ProgressService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.UUID;

@RestController
@RequestMapping("/api/progress")
@CrossOrigin(origins = {"http://localhost", "http://localhost:80", "http://localhost:3000"})
public class ProgressController {
    @Autowired
    private ProgressService progressService;

    @GetMapping("/{childId}/avg-scores")
    public ResponseEntity<AvgScoresDto> getAvgScores(@PathVariable UUID childId) {
        AvgScoresDto avgScores = progressService.getAvgScores(childId);
        System.out.println("[DEBUG] Returning avgScores: " + avgScores.getWordMatchingAvg() + ", " + avgScores.getSentenceCorrectionAvg());
        return ResponseEntity.ok(avgScores);
    }
} 