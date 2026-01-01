/**
 * GitHub-style activity heatmap component
 * Shows daily submission activity with color intensity based on count
 */

import { format, startOfWeek, startOfYear, endOfYear, eachWeekOfInterval } from 'date-fns';
import type { HeatmapData } from '@/types/codeforces';

interface HeatmapProps {
  data: HeatmapData[];
  year: number;
}

export default function Heatmap({ data, year }: HeatmapProps) {
  const startDate = startOfYear(new Date(year, 0, 1));
  const endDate = endOfYear(new Date(year, 11, 31));
  
  const weeks = eachWeekOfInterval(
    { start: startDate, end: endDate },
    { weekStartsOn: 0 }
  );

  const dataMap = new Map(data.map((d) => [d.date, d]));

  const getLevelColor = (level: number): string => {
    const colors = [
      'bg-slate-800',      // level 0: no activity
      'bg-green-900',      // level 1: 1-2 submissions
      'bg-green-700',      // level 2: 3-5 submissions
      'bg-green-500',      // level 3: 6-9 submissions
      'bg-green-400',      // level 4: 10+ submissions
    ];
    return colors[level] || colors[0];
  };

  return (
    <div className="bg-slate-900 p-6 rounded-lg border border-slate-800">
      <h3 className="text-lg font-semibold mb-4">Activity Heatmap {year}</h3>
      
      <div className="flex gap-1">
        {weeks.map((weekStart, weekIndex) => (
          <div key={weekIndex} className="flex flex-col gap-1">
            {[0, 1, 2, 3, 4, 5, 6].map((dayOffset) => {
              const date = new Date(weekStart);
              date.setDate(date.getDate() + dayOffset);
              
              if (date.getFullYear() !== year) {
                return <div key={dayOffset} className="w-3 h-3" />;
              }

              const dateStr = format(date, 'yyyy-MM-dd');
              const dayData = dataMap.get(dateStr);
              const level = dayData?.level || 0;
              const count = dayData?.count || 0;

              return (
                <div
                  key={dayOffset}
                  className={`w-3 h-3 rounded-sm ${getLevelColor(level)} hover:ring-2 hover:ring-white cursor-pointer transition-all`}
                  title={`${dateStr}: ${count} submissions`}
                />
              );
            })}
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2 mt-4 text-sm text-slate-400">
        <span>Less</span>
        <div className="flex gap-1">
          {[0, 1, 2, 3, 4].map((level) => (
            <div
              key={level}
              className={`w-3 h-3 rounded-sm ${getLevelColor(level)}`}
            />
          ))}
        </div>
        <span>More</span>
      </div>
    </div>
  );
}
