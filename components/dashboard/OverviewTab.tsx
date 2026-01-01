/**
 * Overview tab - Main dashboard view with key metrics
 */

'use client';

import { useAppStore } from '@/lib/store';
import RatingChart from '@/components/RatingChart';
import { Trophy, Award, Target, TrendingUp, Flame } from 'lucide-react';
import { calculateStreak, predictRating } from '@/utils/analytics';

export default function OverviewTab() {
  const { userInfo, ratingHistory, submissions } = useAppStore();

  if (!userInfo) {
    return <div>Loading...</div>;
  }

  const streak = calculateStreak(submissions);
  const predictedRating = predictRating(ratingHistory);
  const currentRating = userInfo.rating || 0;
  const maxRating = userInfo.maxRating || 0;
  
  // Count unique solved problems
  const solvedProblems = new Set(
    submissions
      .filter(s => s.verdict === 'OK')
      .map(s => `${s.problem.contestId}-${s.problem.index}`)
  ).size;

  // Recent contests (last 5)
  const recentContests = ratingHistory.slice(-5).reverse();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Welcome back, {userInfo.handle}!</h1>
        <p className="text-slate-400 mt-1">Here's your competitive programming overview</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={<Trophy className="w-6 h-6 text-yellow-500" />}
          label="Current Rating"
          value={currentRating}
          color="text-blue-500"
        />
        <StatCard
          icon={<Award className="w-6 h-6 text-purple-500" />}
          label="Max Rating"
          value={maxRating}
          color="text-purple-500"
        />
        <StatCard
          icon={<Target className="w-6 h-6 text-green-500" />}
          label="Problems Solved"
          value={solvedProblems}
          color="text-green-500"
        />
        <StatCard
          icon={<Flame className="w-6 h-6 text-orange-500" />}
          label="Current Streak"
          value={`${streak.current} days`}
          color="text-orange-500"
        />
      </div>

      {/* Rating Prediction */}
      {predictedRating && (
        <div className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 border border-blue-800/30 rounded-lg p-6">
          <div className="flex items-center gap-3">
            <TrendingUp className="w-6 h-6 text-blue-400" />
            <div>
              <p className="text-sm text-slate-400">Predicted Next Contest Rating</p>
              <p className="text-2xl font-bold text-blue-400">{predictedRating}</p>
              <p className="text-xs text-slate-500 mt-1">Based on recent performance trends</p>
            </div>
          </div>
        </div>
      )}

      {/* Rating Chart */}
      {ratingHistory.length > 0 && (
        <RatingChart ratingHistory={ratingHistory} />
      )}

      {/* Recent Contests */}
      <div className="bg-slate-900 p-6 rounded-lg border border-slate-800">
        <h3 className="text-lg font-semibold mb-4">Recent Contest Performance</h3>
        <div className="space-y-3">
          {recentContests.map((contest) => (
            <div
              key={contest.contestId}
              className="flex items-center justify-between p-4 bg-slate-800 rounded-lg hover:bg-slate-750 transition-colors"
            >
              <div className="flex-1">
                <p className="font-medium">{contest.contestName}</p>
                <p className="text-sm text-slate-400">
                  Rank: #{contest.rank}
                </p>
              </div>
              <div className="text-right">
                <p className={`text-lg font-bold ${
                  contest.newRating - contest.oldRating >= 0 ? 'text-green-500' : 'text-red-500'
                }`}>
                  {contest.newRating - contest.oldRating >= 0 ? '+' : ''}
                  {contest.newRating - contest.oldRating}
                </p>
                <p className="text-sm text-slate-400">{contest.newRating}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: string | number; color: string }) {
  return (
    <div className="bg-slate-900 p-6 rounded-lg border border-slate-800">
      <div className="flex items-center gap-3 mb-2">
        {icon}
        <p className="text-sm text-slate-400">{label}</p>
      </div>
      <p className={`text-2xl font-bold ${color}`}>{value}</p>
    </div>
  );
}
