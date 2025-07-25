package com.wondernest.userlearning.repository;

import com.wondernest.userlearning.model.BehaviorFlag;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface BehaviorFlagRepository extends JpaRepository<BehaviorFlag, UUID> {

    /**
     * Find all behavior flags for a specific child
     */
    List<BehaviorFlag> findByChildIdOrderByFlaggedAtDesc(UUID childId);

    /**
     * Count total behavior flags for a child
     */
    @Query("SELECT COUNT(b) FROM BehaviorFlag b WHERE b.childId = :childId")
    Long countByChildId(@Param("childId") UUID childId);

    /**
     * Check if a child has any behavior flags
     */
    boolean existsByChildId(UUID childId);

    /**
     * Find behavior flags by activity type for a child
     */
    List<BehaviorFlag> findByChildIdAndActivityTypeOrderByFlaggedAtDesc(UUID childId, String activityType);

    /**
     * Find unseen behavior flags for children of a specific parent
     */
    @Query("SELECT b FROM BehaviorFlag b JOIN Child c ON b.childId = c.id WHERE c.parent.id = :parentId AND b.isSeen = false ORDER BY b.flaggedAt DESC")
    List<BehaviorFlag> findUnseenBehaviorFlagsByParentId(@Param("parentId") UUID parentId);

    /**
     * Count unseen behavior flags for children of a specific parent
     */
    @Query("SELECT COUNT(b) FROM BehaviorFlag b JOIN Child c ON b.childId = c.id WHERE c.parent.id = :parentId AND b.isSeen = false")
    Long countUnseenBehaviorFlagsByParentId(@Param("parentId") UUID parentId);

    /**
     * Mark behavior flags as seen
     */
    @Modifying
    @Query("UPDATE BehaviorFlag b SET b.isSeen = true WHERE b.id IN :flagIds")
    void markFlagsAsSeen(@Param("flagIds") List<UUID> flagIds);
}
