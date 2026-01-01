// Codeforces API Types

export interface CodeforcesUser {
  handle: string;
  email?: string;
  vkId?: string;
  openId?: string;
  firstName?: string;
  lastName?: string;
  country?: string;
  city?: string;
  organization?: string;
  contribution: number;
  rank?: string;
  rating?: number;
  maxRank?: string;
  maxRating?: number;
  lastOnlineTimeSeconds: number;
  registrationTimeSeconds: number;
  friendOfCount: number;
  avatar: string;
  titlePhoto: string;
}

export interface RatingChange {
  contestId: number;
  contestName: string;
  handle: string;
  rank: number;
  ratingUpdateTimeSeconds: number;
  oldRating: number;
  newRating: number;
}

export interface Submission {
  id: number;
  contestId?: number;
  creationTimeSeconds: number;
  relativeTimeSeconds: number;
  problem: Problem;
  author: Party;
  programmingLanguage: string;
  verdict?: string;
  testset: string;
  passedTestCount: number;
  timeConsumedMillis: number;
  memoryConsumedBytes: number;
}

export interface Problem {
  contestId?: number;
  problemsetName?: string;
  index: string;
  name: string;
  type: string;
  points?: number;
  rating?: number;
  tags: string[];
}

export interface Party {
  contestId?: number;
  members: Member[];
  participantType: string;
  teamId?: number;
  teamName?: string;
  ghost: boolean;
  room?: number;
  startTimeSeconds?: number;
}

export interface Member {
  handle: string;
  name?: string;
}

export interface Contest {
  id: number;
  name: string;
  type: string;
  phase: string;
  frozen: boolean;
  durationSeconds: number;
  startTimeSeconds?: number;
  relativeTimeSeconds?: number;
  preparedBy?: string;
  websiteUrl?: string;
  description?: string;
  difficulty?: number;
  kind?: string;
  icpcRegion?: string;
  country?: string;
  city?: string;
  season?: string;
}

export interface CodeforcesAPIResponse<T> {
  status: string;
  result: T;
  comment?: string;
}

// Application-specific types

export interface ProblemStats {
  total: number;
  solved: number;
  attempted: number;
  byDifficulty: Record<string, number>;
  byTag: Record<string, { solved: number; total: number; accuracy: number }>;
}

export interface ContestPerformance {
  contestId: number;
  contestName: string;
  rank: number;
  problemsSolved: number;
  ratingChange: number;
  newRating: number;
  date: number;
  problemDetails?: ProblemDetail[];
}

export interface ProblemDetail {
  index: string;
  name: string;
  solved: boolean;
  timeTaken?: number;
  wrongAttempts: number;
}

export interface HeatmapData {
  date: string;
  count: number;
  level: number;
}

export interface StreakData {
  current: number;
  longest: number;
  lastActivity: number;
}

export interface UserSettings {
  handle: string;
  timezone: string;
  reminderEnabled: boolean;
  darkMode: boolean;
}
