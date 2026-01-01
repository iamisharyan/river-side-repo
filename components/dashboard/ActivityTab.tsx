/**
 * Activity tab - Heatmaps and activity tracking
 */

'use client';

import { useState } from 'react';
import { useAppStore } from '@/lib/store';
import Heatmap from '@/components/Heatmap';
import { generateHeatmapData, calculateStreak } from '@/utils/analytics';
import { startOfYear, endOfYear, subYears } from 'date-fns';
import { Flame, TrendingUp, Calendar } from 'lucide-react';

export default function ActivityTab() {
  const { submissions, ratingHistory } = useAppStore();
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);

  const streak = calculateStreak(submissions);
  
  // Generate heatmap data for selected year
  const startDate = startOfYear(new Date(selectedYear, 0, 1));
  const endDate = endOfYear(new Date(selectedYear, 11, 31));
  const heatmapData = generateHeatmapData(submissions, startDate, endDate);

  // Contest participation heatmap
  const contestDates = ratingHistory.map(r => ({
    date: new Date(r.ratingUpdateTimeSeconds * 1000),
    contestName: r.contestName,
  }));

  // Calculate total submissions for the year
  const yearSubmissions = submissions.filter(s => {
    const date = new Date(s.creationTimeSeconds * 1000);
    return date.getFullYear() === selectedYear;
  }).length;

  // Calculate active days
  const activeDays = heatmapData.filter(d => d.count > 0).length;

  // Available years
  const availableYears = Array.from(
    new Set(submissions.map(s => new Date(s.creationTimeSeconds * 1000).getFullYear()))
  ).sort((a, b) => b - a);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Activity Tracking</h1>
        <p className="text-slate-400 mt-1">Monitor your daily coding activity and streaks</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-900 p-6 rounded-lg border border-slate-800">
          <div className="flex items-center gap-3 mb-2">
            <Flame className="w-6 h-6 text-orange-500" />
            <p className="text-sm text-slate-400">Current Streak</p>
          </div>
          <p className="text-3xl font-bold text-orange-500">{streak.current} days</p>
          <p className="text-xs text-slate-500 mt-1">Longest: {streak.longest} days</p>
        </div>

        <div className="bg-slate-900 p-6 rounded-lg border border-slate-800">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="w-6 h-6 text-blue-500" />
            <p className="text-sm text-slate-400">Submissions in {selectedYear}</p>
          </div>
          <p className="text-3xl font-bold text-blue-500">{yearSubmissions}</p>
          <p className="text-xs text-slate-500 mt-1">Avg: {(yearSubmissions / 365).toFixed(1)} per day</p>
        </div>

        <div className="bg-slate-900 p-6 rounded-lg border border-slate-800">
          <div className="flex items-center gap-3 mb-2">
            <Calendar className="w-6 h-6 text-green-500" />
            <p className="text-sm text-slate-400">Active Days</p>
          </div>
          <p className="text-3xl font-bold text-green-500">{activeDays}</p>
          <p className="text-xs text-slate-500 mt-1">{((activeDays / 365) * 100).toFixed(1)}% of year</p>
        </div>
      </div>

      {/* Year Selector */}
      <div className="flex items-center gap-4">
        <label className="text-sm font-medium">Select Year:</label>
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(Number(e.target.value))}
          className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {availableYears.map(year => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>
      </div>

      {/* Submission Heatmap */}
      <Heatmap data={heatmapData} year={selectedYear} />

      {/* Contest Participation Timeline */}
      <div className="bg-slate-900 p-6 rounded-lg border border-slate-800">
        <h3 className="text-lg font-semibold mb-4">Contest Participation ({selectedYear})</h3>
        <div className="space-y-2">
          {contestDates
            .filter(c => c.date.getFullYear() === selectedYear)
            .slice(0, 10)
            .map((contest, index) => (
              <div key={index} className="flex items-center gap-3 p-3 bg-slate-800 rounded-lg">
                <div className="w-2 h-2 bg-blue-500 rounded-full" />
                <div className="flex-1">
                  <p className="text-sm font-medium">{contest.contestName}</p>
                  <p className="text-xs text-slate-400">
                    {contest.date.toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric', 
                      year: 'numeric' 
                    })}
                  </p>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Activity Insights */}
      <div className="bg-gradient-to-r from-purple-900/20 to-blue-900/20 border border-purple-800/30 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">💡 Activity Insights</h3>
        <div className="space-y-2 text-sm">
          {streak.current === 0 && (
            <p className="text-yellow-400">⚠️ Your streak is at 0. Start solving to build momentum!</p>
          )}
          {streak.current > 0 && streak.current < 7 && (
            <p className="text-blue-400">🔥 Good start! Keep your streak alive for 7 days to build consistency.</p>
          )}
          {streak.current >= 7 && streak.current < 30 && (
            <p className="text-green-400">✨ Excellent! You're building strong habits. Aim for 30 days!</p>
          )}
          {streak.current >= 30 && (
            <p className="text-purple-400">🏆 Amazing streak! You're in the top tier of consistent coders.</p>
          )}
          {activeDays < 100 && (
            <p className="text-slate-400">Try to be active at least 100 days this year for consistent growth.</p>
          )}
          {activeDays >= 100 && activeDays < 200 && (
            <p className="text-slate-400">Great activity! You've been active {activeDays} days this year.</p>
          )}
          {activeDays >= 200 && (
            <p className="text-slate-400">Exceptional activity! {activeDays} active days shows true dedication.</p>
          )}
        </div>
      </div>
    </div>
  );
}
