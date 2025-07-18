package com.wondernest.userlearning.service;

import com.wondernest.userlearning.model.PicturePuzzle;
import com.wondernest.userlearning.model.PuzzleAttempt;
import com.wondernest.userlearning.repository.PicturePuzzleRepository;
import com.wondernest.userlearning.repository.PuzzleAttemptRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class PuzzleService {
    @Autowired
    private PicturePuzzleRepository picturePuzzleRepository;
    @Autowired
    private PuzzleAttemptRepository puzzleAttemptRepository;

    public Optional<PicturePuzzle> getRandomUnsolvedPuzzle(UUID childId, int level) {
        List<PicturePuzzle> puzzles = picturePuzzleRepository.findByLevel(level);
        List<PuzzleAttempt> solvedAttempts = puzzleAttemptRepository.findByChildIdAndIsSolved(childId, 1);
        Set<UUID> solvedPuzzleIds = new HashSet<>();
        for (PuzzleAttempt attempt : solvedAttempts) {
            solvedPuzzleIds.add(attempt.getPuzzleId());
        }
        List<PicturePuzzle> unsolved = new ArrayList<>();
        for (PicturePuzzle puzzle : puzzles) {
            if (!solvedPuzzleIds.contains(puzzle.getId())) {
                unsolved.add(puzzle);
            }
        }
        if (unsolved.isEmpty()) return Optional.empty();
        Collections.shuffle(unsolved);
        return Optional.of(unsolved.get(0));
    }

    public PuzzleAttempt recordAttempt(UUID childId, UUID puzzleId, boolean solved) {
        Optional<PuzzleAttempt> existing = puzzleAttemptRepository.findByChildIdAndPuzzleId(childId, puzzleId);
        PuzzleAttempt attempt;
        if (existing.isPresent()) {
            attempt = existing.get();
            attempt.setAttempts(attempt.getAttempts() + 1);
            if (solved) attempt.setIsSolved(1);
        } else {
            attempt = new PuzzleAttempt();
            attempt.setChildId(childId);
            attempt.setPuzzleId(puzzleId);
            attempt.setAttempts(1);
            attempt.setIsSolved(solved ? 1 : 0);
        }
        return puzzleAttemptRepository.save(attempt);
    }
} 