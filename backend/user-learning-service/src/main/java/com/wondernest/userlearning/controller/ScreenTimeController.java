package com.wondernest.userlearning.controller;

import com.wondernest.userlearning.dto.ScreenTimeLogRequest;
import com.wondernest.userlearning.dto.ScreenTimeSummaryDto;
import com.wondernest.userlearning.model.ScreenTimeLog;
import com.wondernest.userlearning.service.ScreenTimeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/screen-time")
@CrossOrigin(origins = {"http://localhost", "http://localhost:80", "http://localhost:3000"})
public class ScreenTimeController {

    @Autowired
    private ScreenTimeService screenTimeService;

    /**
     * Log screen time for a child's activity
     */
    @PostMapping("/log")
    public ResponseEntity<ScreenTimeLog> logScreenTime(@RequestBody ScreenTimeLogRequest request) {
        try {
            System.out.println("[ScreenTime] Received request - Child ID: " + request.getChildId() + 
                             ", Activity: " + request.getActivityType() + 
                             ", Time: " + request.getScreenTimeSeconds() + "s");
            
            ScreenTimeLog log = screenTimeService.logScreenTime(
                request.getChildId(),
                request.getActivityType(),
                request.getScreenTimeSeconds()
            );
            
            System.out.println("[ScreenTime] Successfully saved log with ID: " + log.getId());
            return ResponseEntity.ok(log);
        } catch (Exception e) {
            System.err.println("[ScreenTime] Error saving screen time: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Get screen time summary for a child in the last 7 days
     */
    @GetMapping("/summary/{childId}")
    public ResponseEntity<List<ScreenTimeSummaryDto>> getScreenTimeSummary(@PathVariable UUID childId) {
        try {
            System.out.println("[ScreenTime] Fetching summary for child ID: " + childId);
            
            List<ScreenTimeSummaryDto> summary = screenTimeService.getScreenTimeSummary(childId);
            
            System.out.println("[ScreenTime] Found " + summary.size() + " activity types with recorded time");
            for (ScreenTimeSummaryDto dto : summary) {
                System.out.println("  - " + dto.getActivityType() + ": " + dto.getTotalTimeSeconds() + "s");
            }
            
            return ResponseEntity.ok(summary);
        } catch (Exception e) {
            System.err.println("[ScreenTime] Error fetching summary: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Get detailed screen time logs for a child in the last 7 days
     */
    @GetMapping("/detailed/{childId}")
    public ResponseEntity<List<ScreenTimeLog>> getDetailedScreenTimeLogs(@PathVariable UUID childId) {
        try {
            List<ScreenTimeLog> logs = screenTimeService.getDetailedScreenTimeLogs(childId);
            return ResponseEntity.ok(logs);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Manually trigger cleanup of old screen time logs (for testing)
     */
    @PostMapping("/cleanup")
    public ResponseEntity<String> manualCleanup() {
        try {
            screenTimeService.manualCleanup();
            return ResponseEntity.ok("Old screen time logs cleaned up successfully");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("Failed to cleanup old logs");
        }
    }
}
