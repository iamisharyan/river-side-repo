/**
 * Global state management using Zustand
 */

import { create } from 'zustand';
import type { CodeforcesUser, RatingChange, Submission } from '@/types/codeforces';

interface AppState {
  // User data
  handle: string | null;
  userInfo: CodeforcesUser | null;
  ratingHistory: RatingChange[];
  submissions: Submission[];
  
  // UI state
  darkMode: boolean;
  sidebarOpen: boolean;
  
  // Settings
  timezone: string;
  reminderEnabled: boolean;
  
  // Attended contests tracking
  attendedContests: Set<number>;
  skippedContests: Set<number>;
  
  // Notes for problems
  problemNotes: Map<string, string>;
  
  // Actions
  setHandle: (handle: string) => void;
  setUserInfo: (info: CodeforcesUser) => void;
  setRatingHistory: (history: RatingChange[]) => void;
  setSubmissions: (submissions: Submission[]) => void;
  toggleDarkMode: () => void;
  toggleSidebar: () => void;
  setTimezone: (timezone: string) => void;
  toggleReminder: () => void;
  markContestAttended: (contestId: number) => void;
  markContestSkipped: (contestId: number) => void;
  addProblemNote: (problemKey: string, note: string) => void;
  clearData: () => void;
}

// Helper functions for localStorage
const getStoredHandle = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('cf-handle');
};

const setStoredHandle = (handle: string | null): void => {
  if (typeof window === 'undefined') return;
  if (handle) {
    localStorage.setItem('cf-handle', handle);
  } else {
    localStorage.removeItem('cf-handle');
  }
};

export const useAppStore = create<AppState>((set) => ({
  // Initial state
  handle: getStoredHandle(),
  userInfo: null,
  ratingHistory: [],
  submissions: [],
  darkMode: true,
  sidebarOpen: true,
  timezone: 'Asia/Kolkata',
  reminderEnabled: true,
  attendedContests: new Set(),
  skippedContests: new Set(),
  problemNotes: new Map(),

  // Actions
  setHandle: (handle) => {
    setStoredHandle(handle);
    set({ handle });
  },
  
  setUserInfo: (userInfo) => set({ userInfo }),
  
  setRatingHistory: (ratingHistory) => set({ ratingHistory }),
  
  setSubmissions: (submissions) => set({ submissions }),
  
  toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),
  
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  
  setTimezone: (timezone) => set({ timezone }),
  
  toggleReminder: () => set((state) => ({ reminderEnabled: !state.reminderEnabled })),
  
  markContestAttended: (contestId) =>
    set((state) => {
      const attended = new Set(state.attendedContests);
      attended.add(contestId);
      const skipped = new Set(state.skippedContests);
      skipped.delete(contestId);
      return { attendedContests: attended, skippedContests: skipped };
    }),
  
  markContestSkipped: (contestId) =>
    set((state) => {
      const skipped = new Set(state.skippedContests);
      skipped.add(contestId);
      const attended = new Set(state.attendedContests);
      attended.delete(contestId);
      return { attendedContests: attended, skippedContests: skipped };
    }),
  
  addProblemNote: (problemKey, note) =>
    set((state) => {
      const notes = new Map(state.problemNotes);
      notes.set(problemKey, note);
      return { problemNotes: notes };
    }),
  
  clearData: () => {
    setStoredHandle(null);
    set({
      handle: null,
      userInfo: null,
      ratingHistory: [],
      submissions: [],
      attendedContests: new Set(),
      skippedContests: new Set(),
      problemNotes: new Map(),
    });
  },
}));
