package com.wondernest.userlearning.controller;

import com.wondernest.userlearning.model.PicturePuzzle;
import com.wondernest.userlearning.model.PuzzleAttempt;
import com.wondernest.userlearning.service.PuzzleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/puzzle")
@CrossOrigin(origins = {"http://localhost", "http://localhost:80", "http://localhost:3000"})
public class PuzzleController {
    @Autowired
    private PuzzleService puzzleService;

    @GetMapping("/random")
    public ResponseEntity<?> getRandomPuzzle(@RequestParam UUID childId, @RequestParam int level) {
        Optional<PicturePuzzle> puzzle = puzzleService.getRandomUnsolvedPuzzle(childId, level);
        if (puzzle.isEmpty()) {
            return ResponseEntity.ok(Map.of("message", "No unsolved puzzles available for this child and level."));
        }
        return ResponseEntity.ok(puzzle.get());
    }

    @PostMapping("/attempt")
    public ResponseEntity<?> recordAttempt(@RequestBody Map<String, Object> payload) {
        UUID childId = UUID.fromString((String) payload.get("childId"));
        UUID puzzleId = UUID.fromString((String) payload.get("puzzleId"));
        boolean solved = Boolean.TRUE.equals(payload.get("solved"));
        PuzzleAttempt attempt = puzzleService.recordAttempt(childId, puzzleId, solved);
        return ResponseEntity.ok(attempt);
    }
} 