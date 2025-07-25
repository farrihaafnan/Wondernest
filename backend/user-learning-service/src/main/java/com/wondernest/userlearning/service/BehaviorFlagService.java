package com.wondernest.userlearning.service;

import com.wondernest.userlearning.model.BehaviorFlag;
import com.wondernest.userlearning.repository.BehaviorFlagRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class BehaviorFlagService {

    @Autowired
    private BehaviorFlagRepository behaviorFlagRepository;

    @Autowired
    private OffensiveWordsDetectionService offensiveWordsDetectionService;

    /**
     * Check text for offensive content and flag if found
     * @param childId The child's ID
     * @param activityType The type of activity
     * @param submittedText The text submitted by the child
     * @return BehaviorFlag if offensive content found, null otherwise
     */
    @Transactional
    public BehaviorFlag checkAndFlagInappropriateContent(UUID childId, String activityType, String submittedText) {
        // Validate inputs
        if (childId == null) {
            System.out.println("[BehaviorFlag] Warning: childId is null, skipping behavior flag check");
            return null;
        }
        
        if (submittedText == null || submittedText.trim().isEmpty()) {
            System.out.println("[BehaviorFlag] Warning: submittedText is null or empty, skipping behavior flag check");
            return null;
        }
        
        try {
            List<String> detectedWords = offensiveWordsDetectionService.detectOffensiveWords(submittedText);
            
            if (!detectedWords.isEmpty()) {
                System.out.println("[BehaviorFlag] Detected offensive words: " + detectedWords + " in activity: " + activityType);
                
                BehaviorFlag flag = new BehaviorFlag(childId, activityType, submittedText, detectedWords);
                BehaviorFlag savedFlag = behaviorFlagRepository.save(flag);
                return savedFlag;
            }
        } catch (Exception e) {
            System.err.println("[BehaviorFlag] Error while checking inappropriate content: " + e.getMessage());
            e.printStackTrace();
            // Don't throw the exception to avoid breaking the main functionality
        }
        
        return null;
    }

    /**
     * Get all behavior flags for a specific child
     */
    public List<BehaviorFlag> getBehaviorFlagsForChild(UUID childId) {
        return behaviorFlagRepository.findByChildIdOrderByFlaggedAtDesc(childId);
    }

    /**
     * Check if a child has any behavior flags
     */
    public boolean hasBehaviorFlags(UUID childId) {
        return behaviorFlagRepository.existsByChildId(childId);
    }

    /**
     * Get count of behavior flags for a child
     */
    public Long getBehaviorFlagsCount(UUID childId) {
        return behaviorFlagRepository.countByChildId(childId);
    }

    /**
     * Get behavior flags by activity type for a child
     */
    public List<BehaviorFlag> getBehaviorFlagsByActivity(UUID childId, String activityType) {
        return behaviorFlagRepository.findByChildIdAndActivityTypeOrderByFlaggedAtDesc(childId, activityType);
    }

    /**
     * Delete a specific behavior flag (for moderation purposes)
     */
    @Transactional
    public void deleteBehaviorFlag(UUID flagId) {
        behaviorFlagRepository.deleteById(flagId);
    }

    /**
     * Get unseen behavior flags for children of a specific parent
     */
    public List<BehaviorFlag> getUnseenBehaviorFlagsForParent(UUID parentId) {
        return behaviorFlagRepository.findUnseenBehaviorFlagsByParentId(parentId);
    }

    /**
     * Count unseen behavior flags for children of a specific parent
     */
    public Long countUnseenBehaviorFlagsForParent(UUID parentId) {
        return behaviorFlagRepository.countUnseenBehaviorFlagsByParentId(parentId);
    }

    /**
     * Mark behavior flags as seen by parent
     */
    @Transactional
    public void markBehaviorFlagsAsSeen(List<UUID> flagIds) {
        if (flagIds != null && !flagIds.isEmpty()) {
            behaviorFlagRepository.markFlagsAsSeen(flagIds);
        }
    }
}
