import { useEffect, useRef } from 'react';
import { USER_LEARNING_API_BASE_URL } from '../apiConfig';

interface UseScreenTimeTrackerOptions {
  childId: string;
  activityType: 'word_flashcard' | 'picture_puzzle' | 'story_generation' | 'sentence_learning' | 'word_match' | 'sentence_correction';
  isActive: boolean;
}

export const useScreenTimeTracker = ({ childId, activityType, isActive }: UseScreenTimeTrackerOptions) => {
  const startTimeRef = useRef<number | null>(null);
  const totalTimeRef = useRef<number>(0);

  useEffect(() => {
    if (isActive && !startTimeRef.current && childId) {
      // Start tracking
      startTimeRef.current = Date.now();
      console.log(`[ScreenTime] Started tracking ${activityType} for child ${childId}`);
    } else if (!isActive && startTimeRef.current) {
      // Stop tracking and accumulate time
      const sessionTime = Math.floor((Date.now() - startTimeRef.current) / 1000);
      totalTimeRef.current += sessionTime;
      startTimeRef.current = null;
      console.log(`[ScreenTime] Session ended: ${sessionTime}s for ${activityType}`);
      
      // Log immediately when session ends
      if (sessionTime > 0 && childId) {
        logScreenTime(childId, activityType, sessionTime);
      }
    }
  }, [isActive, childId, activityType]);

  useEffect(() => {
    // Cleanup on unmount or when childId/activityType changes
    return () => {
      if (startTimeRef.current && childId) {
        const sessionTime = Math.floor((Date.now() - startTimeRef.current) / 1000);
        console.log(`[ScreenTime] Component unmount: ${sessionTime}s for ${activityType}`);
        startTimeRef.current = null;
        
        // Log the session time on unmount
        if (sessionTime > 0) {
          logScreenTime(childId, activityType, sessionTime);
        }
      }
    };
  }, [childId, activityType]);

  const logScreenTime = async (childId: string, activityType: string, screenTimeSeconds: number) => {
    try {
      const token = sessionStorage.getItem('token');
      if (!token || !childId || screenTimeSeconds <= 0) return;

      console.log(`[ScreenTime] Logging ${screenTimeSeconds}s for ${activityType} (child: ${childId})`);

      const response = await fetch(`${USER_LEARNING_API_BASE_URL}/api/screen-time/log`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          childId,
          activityType,
          screenTimeSeconds
        }),
      });

      if (response.ok) {
        console.log(`[ScreenTime] Successfully logged ${screenTimeSeconds}s for ${activityType}`);
      } else {
        console.error(`[ScreenTime] Failed to log: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      console.error('[ScreenTime] Failed to log screen time:', error);
    }
  };

  const getCurrentSessionTime = () => {
    if (startTimeRef.current) {
      return Math.floor((Date.now() - startTimeRef.current) / 1000);
    }
    return 0;
  };

  const getTotalTime = () => {
    return totalTimeRef.current + getCurrentSessionTime();
  };

  return {
    getCurrentSessionTime,
    getTotalTime
  };
};
