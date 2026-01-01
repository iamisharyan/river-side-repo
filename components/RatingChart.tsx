/**
 * Rating history chart component with zoom functionality
 */

'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { format } from 'date-fns';
import type { RatingChange } from '@/types/codeforces';

interface RatingChartProps {
  ratingHistory: RatingChange[];
}

export default function RatingChart({ ratingHistory }: RatingChartProps) {
  const chartData = ratingHistory.map((rating) => ({
    date: format(new Date(rating.ratingUpdateTimeSeconds * 1000), 'MMM dd, yyyy'),
    rating: rating.newRating,
    contest: rating.contestName,
    change: rating.newRating - rating.oldRating,
  }));

  const getRankColor = (rating: number): string => {
    if (rating >= 3000) return '#ff0000';
    if (rating >= 2400) return '#ff8c00';
    if (rating >= 2100) return '#aa00aa';
    if (rating >= 1900) return '#0000ff';
    if (rating >= 1600) return '#03a89e';
    if (rating >= 1400) return '#008000';
    if (rating >= 1200) return '#808080';
    return '#808080';
  };

  const maxRating = Math.max(...ratingHistory.map((r) => r.newRating));
  const currentRating = ratingHistory[ratingHistory.length - 1]?.newRating || 0;

  return (
    <div className="bg-slate-900 p-6 rounded-lg border border-slate-800">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Rating Progress</h3>
        <div className="flex items-center gap-4 text-sm">
          <span className="text-slate-400">
            Current: <span style={{ color: getRankColor(currentRating) }} className="font-bold">{currentRating}</span>
          </span>
          <span className="text-slate-400">
            Max: <span style={{ color: getRankColor(maxRating) }} className="font-bold">{maxRating}</span>
          </span>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis
            dataKey="date"
            stroke="#94a3b8"
            tick={{ fill: '#94a3b8', fontSize: 12 }}
          />
          <YAxis
            stroke="#94a3b8"
            tick={{ fill: '#94a3b8', fontSize: 12 }}
            domain={['dataMin - 100', 'dataMax + 100']}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1e293b',
              border: '1px solid #334155',
              borderRadius: '8px',
              color: '#f8fafc',
            }}
            formatter={(value: any, name: string) => {
              if (name === 'rating') return [value, 'Rating'];
              return [value, name];
            }}
            labelFormatter={(label) => `Contest: ${label}`}
          />
          {/* Reference lines for rating tiers */}
          <ReferenceLine y={1200} stroke="#808080" strokeDasharray="3 3" />
          <ReferenceLine y={1400} stroke="#008000" strokeDasharray="3 3" />
          <ReferenceLine y={1600} stroke="#03a89e" strokeDasharray="3 3" />
          <ReferenceLine y={1900} stroke="#0000ff" strokeDasharray="3 3" />
          <ReferenceLine y={2100} stroke="#aa00aa" strokeDasharray="3 3" />
          <ReferenceLine y={2400} stroke="#ff8c00" strokeDasharray="3 3" />
          
          <Line
            type="monotone"
            dataKey="rating"
            stroke="#3b82f6"
            strokeWidth={2}
            dot={{ fill: '#3b82f6', r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
