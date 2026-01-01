/**
 * Utility functions for data processing and analytics
 */

import type {
  Submission,
  ProblemStats,
  HeatmapData,
  StreakData,
  RatingChange,
} from '@/types/codeforces';
import { format, startOfDay, differenceInDays, eachDayOfInterval } from 'date-fns';

/**
 * Processes submissions to calculate problem statistics
 */
export function calculateProblemStats(submissions: Submission[]): ProblemStats {
  const problemMap = new Map<string, { solved: boolean; attempted: boolean }>();
  const tagStats = new Map<string, { solved: Set<string>; total: Set<string> }>();
  const difficultyStats = new Map<string, number>();

  submissions.forEach((sub) => {
    const problemKey = `${sub.problem.contestId || 'practice'}-${sub.problem.index}`;
    const isSolved = sub.verdict === 'OK';

    // Track unique problems
    if (!problemMap.has(problemKey)) {
      problemMap.set(problemKey, { solved: false, attempted: true });
    }
    
    if (isSolved) {
      problemMap.get(problemKey)!.solved = true;
    }

    // Track by difficulty
    if (sub.problem.rating) {
      const rating = sub.problem.rating.toString();
      difficultyStats.set(rating, (difficultyStats.get(rating) || 0) + (isSolved ? 1 : 0));
    }

    // Track by tags
    sub.problem.tags.forEach((tag) => {
      if (!tagStats.has(tag)) {
        tagStats.set(tag, { solved: new Set(), total: new Set() });
      }
      const stats = tagStats.get(tag)!;
      stats.total.add(problemKey);
      if (isSolved) {
        stats.solved.add(problemKey);
      }
    });
  });

  const solved = Array.from(problemMap.values()).filter((p) => p.solved).length;
  const attempted = problemMap.size;

  const byTag: Record<string, { solved: number; total: number; accuracy: number }> = {};
  tagStats.forEach((stats, tag) => {
    const solvedCount = stats.solved.size;
    const totalCount = stats.total.size;
    byTag[tag] = {
      solved: solvedCount,
      total: totalCount,
      accuracy: totalCount > 0 ? (solvedCount / totalCount) * 100 : 0,
    };
  });

  return {
    total: attempted,
    solved,
    attempted,
    byDifficulty: Object.fromEntries(difficultyStats),
    byTag,
  };
}

/**
 * Generates heatmap data from submissions
 */
export function generateHeatmapData(
  submissions: Submission[],
  startDate: Date,
  endDate: Date
): HeatmapData[] {
  const dailyCount = new Map<string, number>();

  // Count submissions per day
  submissions.forEach((sub) => {
    const date = format(
      new Date(sub.creationTimeSeconds * 1000),
      'yyyy-MM-dd'
    );
    dailyCount.set(date, (dailyCount.get(date) || 0) + 1);
  });

  // Generate data for all days in range
  const days = eachDayOfInterval({ start: startDate, end: endDate });
  
  return days.map((day) => {
    const dateStr = format(day, 'yyyy-MM-dd');
    const count = dailyCount.get(dateStr) || 0;
    
    // Calculate level (0-4) based on count
    let level = 0;
    if (count > 0) level = 1;
    if (count >= 3) level = 2;
    if (count >= 6) level = 3;
    if (count >= 10) level = 4;

    return {
      date: dateStr,
      count,
      level,
    };
  });
}

/**
 * Calculates streak information
 */
export function calculateStreak(submissions: Submission[]): StreakData {
  if (submissions.length === 0) {
    return { current: 0, longest: 0, lastActivity: 0 };
  }

  // Sort submissions by date
  const sorted = [...submissions].sort(
    (a, b) => b.creationTimeSeconds - a.creationTimeSeconds
  );

  const today = startOfDay(new Date());
  const lastActivity = sorted[0].creationTimeSeconds;

  // Get unique days with submissions
  const uniqueDays = new Set(
    sorted.map((sub) =>
      format(new Date(sub.creationTimeSeconds * 1000), 'yyyy-MM-dd')
    )
  );

  const sortedDays = Array.from(uniqueDays).sort().reverse();

  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 0;

  // Calculate current streak
  const lastSubmissionDay = startOfDay(new Date(sorted[0].creationTimeSeconds * 1000));
  const daysSinceLastSubmission = differenceInDays(today, lastSubmissionDay);

  if (daysSinceLastSubmission <= 1) {
    currentStreak = 1;
    for (let i = 1; i < sortedDays.length; i++) {
      const prevDay = new Date(sortedDays[i - 1]);
      const currDay = new Date(sortedDays[i]);
      const diff = differenceInDays(prevDay, currDay);
      
      if (diff === 1) {
        currentStreak++;
      } else {
        break;
      }
    }
  }

  // Calculate longest streak
  tempStreak = 1;
  for (let i = 1; i < sortedDays.length; i++) {
    const prevDay = new Date(sortedDays[i - 1]);
    const currDay = new Date(sortedDays[i]);
    const diff = differenceInDays(prevDay, currDay);
    
    if (diff === 1) {
      tempStreak++;
      longestStreak = Math.max(longestStreak, tempStreak);
    } else {
      tempStreak = 1;
    }
  }

  longestStreak = Math.max(longestStreak, currentStreak, tempStreak);

  return {
    current: currentStreak,
    longest: longestStreak,
    lastActivity,
  };
}

/**
 * Predicts rating for next contest based on recent performance
 */
export function predictRating(ratingHistory: RatingChange[]): number | null {
  if (ratingHistory.length < 3) return null;

  const recent = ratingHistory.slice(-5);
  const avgChange = recent.reduce((sum, r) => sum + (r.newRating - r.oldRating), 0) / recent.length;
  const lastRating = ratingHistory[ratingHistory.length - 1].newRating;

  return Math.round(lastRating + avgChange);
}

/**
 * Utility function for merging class names
 */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}
