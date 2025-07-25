package com.wondernest.userlearning.repository;

import com.wondernest.userlearning.model.ScreenTimeLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Repository
public interface ScreenTimeLogRepository extends JpaRepository<ScreenTimeLog, UUID> {
    
    /**
     * Find screen time logs for a specific child in the last 7 days
     */
    @Query("SELECT s FROM ScreenTimeLog s WHERE s.childId = :childId AND s.loggedAt >= :sevenDaysAgo ORDER BY s.loggedAt DESC")
    List<ScreenTimeLog> findByChildIdAndLoggedAtAfter(@Param("childId") UUID childId, @Param("sevenDaysAgo") LocalDateTime sevenDaysAgo);

    /**
     * Get total screen time by activity type for a child in the last 7 days
     */
    @Query("SELECT s.activityType, SUM(s.screenTimeSeconds) FROM ScreenTimeLog s WHERE s.childId = :childId AND s.loggedAt >= :sevenDaysAgo GROUP BY s.activityType")
    List<Object[]> findScreenTimeSummaryByChildId(@Param("childId") UUID childId, @Param("sevenDaysAgo") LocalDateTime sevenDaysAgo);

    /**
     * Delete screen time logs older than 7 days
     */
    @Modifying
    @Transactional
    @Query("DELETE FROM ScreenTimeLog s WHERE s.loggedAt < :sevenDaysAgo")
    void deleteOldScreenTimeLogs(@Param("sevenDaysAgo") LocalDateTime sevenDaysAgo);

    /**
     * Find screen time logs for a specific child between two dates
     */
    @Query("SELECT s FROM ScreenTimeLog s WHERE s.childId = :childId AND s.loggedAt >= :from AND s.loggedAt < :to ORDER BY s.loggedAt ASC")
    List<ScreenTimeLog> findByChildIdAndLoggedAtBetween(@Param("childId") UUID childId, @Param("from") java.time.LocalDateTime from, @Param("to") java.time.LocalDateTime to);
}
