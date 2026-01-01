/**
 * Problem statistics component showing tags, difficulty distribution
 */

'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import type { ProblemStats } from '@/types/codeforces';

interface ProblemStatsProps {
  stats: ProblemStats;
}

export default function ProblemStatsView({ stats }: ProblemStatsProps) {
  // Prepare difficulty data
  const difficultyData = Object.entries(stats.byDifficulty)
    .map(([rating, count]) => ({
      rating: parseInt(rating),
      count,
    }))
    .sort((a, b) => a.rating - b.rating);

  // Prepare top tags data
  const tagData = Object.entries(stats.byTag)
    .sort((a, b) => b[1].solved - a[1].solved)
    .slice(0, 10)
    .map(([tag, data]) => ({
      tag,
      solved: data.solved,
      accuracy: Math.round(data.accuracy),
    }));

  const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#06b6d4', '#6366f1', '#84cc16', '#f97316', '#14b8a6'];

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-900 p-6 rounded-lg border border-slate-800">
          <p className="text-sm text-slate-400">Total Problems</p>
          <p className="text-3xl font-bold mt-2">{stats.total}</p>
        </div>
        <div className="bg-slate-900 p-6 rounded-lg border border-slate-800">
          <p className="text-sm text-slate-400">Solved</p>
          <p className="text-3xl font-bold mt-2 text-green-500">{stats.solved}</p>
        </div>
        <div className="bg-slate-900 p-6 rounded-lg border border-slate-800">
          <p className="text-sm text-slate-400">Success Rate</p>
          <p className="text-3xl font-bold mt-2 text-blue-500">
            {stats.total > 0 ? Math.round((stats.solved / stats.total) * 100) : 0}%
          </p>
        </div>
      </div>

      {/* Difficulty Distribution */}
      <div className="bg-slate-900 p-6 rounded-lg border border-slate-800">
        <h3 className="text-lg font-semibold mb-4">Problems by Difficulty</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={difficultyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis
              dataKey="rating"
              stroke="#94a3b8"
              tick={{ fill: '#94a3b8', fontSize: 12 }}
            />
            <YAxis
              stroke="#94a3b8"
              tick={{ fill: '#94a3b8', fontSize: 12 }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1e293b',
                border: '1px solid #334155',
                borderRadius: '8px',
                color: '#f8fafc',
              }}
            />
            <Bar dataKey="count" fill="#3b82f6" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Top Tags */}
      <div className="bg-slate-900 p-6 rounded-lg border border-slate-800">
        <h3 className="text-lg font-semibold mb-4">Top Problem Tags</h3>
        <div className="space-y-3">
          {tagData.map((item, index) => (
            <div key={item.tag}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium">{item.tag}</span>
                <span className="text-sm text-slate-400">
                  {item.solved} solved • {item.accuracy}% accuracy
                </span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2">
                <div
                  className="h-2 rounded-full transition-all"
                  style={{
                    width: `${item.accuracy}%`,
                    backgroundColor: COLORS[index % COLORS.length],
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
