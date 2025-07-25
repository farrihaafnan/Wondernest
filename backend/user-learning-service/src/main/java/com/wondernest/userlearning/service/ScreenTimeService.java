package com.wondernest.userlearning.service;

import com.wondernest.userlearning.dto.ScreenTimeSummaryDto;
import com.wondernest.userlearning.model.ScreenTimeLog;
import com.wondernest.userlearning.repository.ScreenTimeLogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
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
     * Get average screen time per day for each activity for this week and last week (Sat-Fri)
     */
    public Map<String, Map<String, Double>> getWeeklyActivityAverages(UUID childId) {
        // Get today and find the most recent Saturday
        LocalDate today = LocalDate.now(ZoneId.systemDefault());
        LocalDate thisSat = today.with(DayOfWeek.SATURDAY);
        if (today.getDayOfWeek().getValue() < DayOfWeek.SATURDAY.getValue()) {
            thisSat = thisSat.minusWeeks(1);
        }
        LocalDate lastSat = thisSat.minusWeeks(1);
        LocalDate lastLastSat = thisSat.minusWeeks(2);

        // Fetch all logs from lastLastSat (inclusive) to today (inclusive)
        LocalDateTime from = lastLastSat.atStartOfDay();
        LocalDateTime to = today.plusDays(1).atStartOfDay();
        List<ScreenTimeLog> logs = screenTimeLogRepository.findByChildIdAndLoggedAtBetween(childId, from, to);

        // Map: week -> activity -> [totalSeconds, daysWithData]
        Map<String, Map<String, int[]>> weekActivityTotals = new HashMap<>();
        weekActivityTotals.put("thisWeek", new HashMap<>());
        weekActivityTotals.put("lastWeek", new HashMap<>());

        // Helper: for each log, determine which week and which day
        for (ScreenTimeLog log : logs) {
            LocalDate logDate = log.getLoggedAt().toLocalDate();
            String weekKey = null;
            if (!logDate.isBefore(thisSat) && !logDate.isAfter(thisSat.plusDays(6))) {
                weekKey = "thisWeek";
            } else if (!logDate.isBefore(lastSat) && !logDate.isAfter(lastSat.plusDays(6))) {
                weekKey = "lastWeek";
            }
            if (weekKey == null) continue;
            String activity = log.getActivityType();
            Map<String, int[]> activityMap = weekActivityTotals.get(weekKey);
            if (!activityMap.containsKey(activity)) {
                activityMap.put(activity, new int[8]); // [totalSeconds, day0, day1, ..., day6]
            }
            activityMap.get(activity)[0] += log.getScreenTimeSeconds();
            int dayIdx = logDate.getDayOfWeek().getValue() % 7; // Saturday=0, Sunday=1, ..., Friday=6
            activityMap.get(activity)[dayIdx + 1] += log.getScreenTimeSeconds();
        }

        // Calculate averages
        Map<String, Map<String, Double>> result = new HashMap<>();
        for (String week : weekActivityTotals.keySet()) {
            Map<String, Double> activityAverages = new HashMap<>();
            for (Map.Entry<String, int[]> entry : weekActivityTotals.get(week).entrySet()) {
                int[] arr = entry.getValue();
                double avg = 0;
                int daysWithData = 0;
                for (int i = 1; i <= 7; i++) {
                    if (arr[i] > 0) daysWithData++;
                }
                avg = daysWithData > 0 ? (arr[0] / (double) daysWithData) : 0;
                activityAverages.put(entry.getKey(), avg);
            }
            result.put(week, activityAverages);
        }
        return result;
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
