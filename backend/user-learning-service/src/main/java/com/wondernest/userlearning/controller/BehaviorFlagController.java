package com.wondernest.userlearning.controller;

import com.wondernest.userlearning.dto.BehaviorFlagDto;
import com.wondernest.userlearning.model.BehaviorFlag;
import com.wondernest.userlearning.model.Child;
import com.wondernest.userlearning.repository.ChildRepository;
import com.wondernest.userlearning.service.BehaviorFlagService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/behavior-flags")
@CrossOrigin(origins = {"http://localhost", "http://localhost:80", "http://localhost:3000"})
public class BehaviorFlagController {

    @Autowired
    private BehaviorFlagService behaviorFlagService;

    @Autowired
    private ChildRepository childRepository;

    /**
     * Get all behavior flags for a specific child
     */
    @GetMapping("/child/{childId}")
    public ResponseEntity<List<BehaviorFlagDto>> getBehaviorFlagsForChild(@PathVariable UUID childId) {
        try {
            System.out.println("[BehaviorFlag] Fetching behavior flags for child ID: " + childId);
            
            List<BehaviorFlag> flags = behaviorFlagService.getBehaviorFlagsForChild(childId);
            
            List<BehaviorFlagDto> flagDtos = flags.stream()
                .map(flag -> new BehaviorFlagDto(
                    flag.getId(),
                    flag.getChildId(),
                    flag.getActivityType(),
                    flag.getSubmittedText(),
                    flag.getOffensiveWords(),
                    flag.getFlaggedAt(),
                    flag.getIsSeen()
                ))
                .collect(Collectors.toList());
            
            System.out.println("[BehaviorFlag] Found " + flagDtos.size() + " behavior flags for child");
            
            return ResponseEntity.ok(flagDtos);
        } catch (Exception e) {
            System.err.println("[BehaviorFlag] Error fetching flags: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Check if a child has any behavior flags
     */
    @GetMapping("/child/{childId}/exists")
    public ResponseEntity<Boolean> hasBehaviorFlags(@PathVariable UUID childId) {
        try {
            boolean hasFlags = behaviorFlagService.hasBehaviorFlags(childId);
            return ResponseEntity.ok(hasFlags);
        } catch (Exception e) {
            System.err.println("[BehaviorFlag] Error checking flags existence: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Get count of behavior flags for a child
     */
    @GetMapping("/child/{childId}/count")
    public ResponseEntity<Long> getBehaviorFlagsCount(@PathVariable UUID childId) {
        try {
            Long count = behaviorFlagService.getBehaviorFlagsCount(childId);
            return ResponseEntity.ok(count);
        } catch (Exception e) {
            System.err.println("[BehaviorFlag] Error getting flags count: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Get behavior flags by activity type for a child
     */
    @GetMapping("/child/{childId}/activity/{activityType}")
    public ResponseEntity<List<BehaviorFlagDto>> getBehaviorFlagsByActivity(
            @PathVariable UUID childId, 
            @PathVariable String activityType) {
        try {
            List<BehaviorFlag> flags = behaviorFlagService.getBehaviorFlagsByActivity(childId, activityType);
            
            List<BehaviorFlagDto> flagDtos = flags.stream()
                .map(flag -> new BehaviorFlagDto(
                    flag.getId(),
                    flag.getChildId(),
                    flag.getActivityType(),
                    flag.getSubmittedText(),
                    flag.getOffensiveWords(),
                    flag.getFlaggedAt(),
                    flag.getIsSeen()
                ))
                .collect(Collectors.toList());
            
            return ResponseEntity.ok(flagDtos);
        } catch (Exception e) {
            System.err.println("[BehaviorFlag] Error fetching flags by activity: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Delete a specific behavior flag (for moderation purposes)
     */
    @DeleteMapping("/{flagId}")
    public ResponseEntity<Void> deleteBehaviorFlag(@PathVariable UUID flagId) {
        try {
            behaviorFlagService.deleteBehaviorFlag(flagId);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            System.err.println("[BehaviorFlag] Error deleting flag: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Get count of unseen behavior flags for children of a specific parent
     */
    @GetMapping("/parent/{parentId}/unseen/count")
    public ResponseEntity<Long> getUnseenBehaviorFlagsCount(@PathVariable UUID parentId) {
        try {
            Long count = behaviorFlagService.countUnseenBehaviorFlagsForParent(parentId);
            return ResponseEntity.ok(count);
        } catch (Exception e) {
            System.err.println("[BehaviorFlag] Error getting unseen flags count: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Get unseen behavior flags for children of a specific parent
     */
    @GetMapping("/parent/{parentId}/unseen")
    public ResponseEntity<List<BehaviorFlagDto>> getUnseenBehaviorFlagsForParent(@PathVariable UUID parentId) {
        try {
            System.out.println("[BehaviorFlag] Fetching unseen behavior flags for parent ID: " + parentId);
            
            List<BehaviorFlag> flags = behaviorFlagService.getUnseenBehaviorFlagsForParent(parentId);
            
            List<BehaviorFlagDto> flagDtos = flags.stream()
                .map(flag -> {
                    // Fetch child name
                    String childName = childRepository.findById(flag.getChildId())
                        .map(Child::getName)
                        .orElse("Unknown Child");
                    
                    return new BehaviorFlagDto(
                        flag.getId(),
                        flag.getChildId(),
                        childName,
                        flag.getActivityType(),
                        flag.getSubmittedText(),
                        flag.getOffensiveWords(),
                        flag.getFlaggedAt(),
                        flag.getIsSeen()
                    );
                })
                .collect(Collectors.toList());
            
            System.out.println("[BehaviorFlag] Found " + flagDtos.size() + " unseen behavior flags for parent");
            
            return ResponseEntity.ok(flagDtos);
        } catch (Exception e) {
            System.err.println("[BehaviorFlag] Error fetching unseen flags: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Mark behavior flags as seen by parent
     */
    @PutMapping("/mark-seen")
    public ResponseEntity<Void> markBehaviorFlagsAsSeen(@RequestBody List<UUID> flagIds) {
        try {
            System.out.println("[BehaviorFlag] Marking " + flagIds.size() + " flags as seen");
            behaviorFlagService.markBehaviorFlagsAsSeen(flagIds);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            System.err.println("[BehaviorFlag] Error marking flags as seen: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }
}
