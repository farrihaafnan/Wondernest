package com.wondernest.userlearning.service;

import com.wondernest.userlearning.dto.ScreenTimeSummaryDto;
import com.wondernest.userlearning.model.ScreenTimeLog;
import com.wondernest.userlearning.repository.ScreenTimeLogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class ScreenTimeService {

    @Autowired
    private ScreenTimeLogRepository screenTimeLogRepository;

    /**
     * Log screen time for a child's activity
     */
    @Transactional
    public ScreenTimeLog logScreenTime(UUID childId, String activityType, Integer screenTimeSeconds) {
        ScreenTimeLog log = new ScreenTimeLog(childId, activityType, screenTimeSeconds);
        return screenTimeLogRepository.save(log);
    }

    /**
     * Get screen time summary for a child in the last 7 days
     */
    public List<ScreenTimeSummaryDto> getScreenTimeSummary(UUID childId) {
        LocalDateTime sevenDaysAgo = LocalDateTime.now().minusDays(7);
        List<Object[]> results = screenTimeLogRepository.findScreenTimeSummaryByChildId(childId, sevenDaysAgo);
        
        List<ScreenTimeSummaryDto> summary = new ArrayList<>();
        for (Object[] result : results) {
            String activityType = (String) result[0];
            Long totalSeconds = (Long) result[1];
            summary.add(new ScreenTimeSummaryDto(activityType, totalSeconds));
        }
        
        return summary;
    }

    /**
     * Get detailed screen time logs for a child in the last 7 days
     */
    public List<ScreenTimeLog> getDetailedScreenTimeLogs(UUID childId) {
        LocalDateTime sevenDaysAgo = LocalDateTime.now().minusDays(7);
        return screenTimeLogRepository.findByChildIdAndLoggedAtAfter(childId, sevenDaysAgo);
    }

    /**
     * Scheduled task to clean up old screen time logs (runs daily at 2:00 AM)
     */
    @Scheduled(cron = "0 0 2 * * *")
    @Transactional
    public void cleanupOldScreenTimeLogs() {
        LocalDateTime sevenDaysAgo = LocalDateTime.now().minusDays(7);
        screenTimeLogRepository.deleteOldScreenTimeLogs(sevenDaysAgo);
        System.out.println("Cleaned up screen time logs older than 7 days at: " + LocalDateTime.now());
    }

    /**
     * Manually trigger cleanup (for testing purposes)
     */
    @Transactional
    public void manualCleanup() {
        LocalDateTime sevenDaysAgo = LocalDateTime.now().minusDays(7);
        screenTimeLogRepository.deleteOldScreenTimeLogs(sevenDaysAgo);
    }
}
