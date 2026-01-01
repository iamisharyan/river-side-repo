/**
 * Analytics tab - Detailed problem and performance analytics
 */

'use client';

import { useAppStore } from '@/lib/store';
import ProblemStatsView from '@/components/ProblemStatsView';
import { calculateProblemStats } from '@/utils/analytics';
import { Search, FileText, Download } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';

export default function AnalyticsTab() {
  const { submissions, ratingHistory } = useAppStore();
  const [searchQuery, setSearchQuery] = useState('');

  const stats = calculateProblemStats(submissions);

  const handleExportCSV = () => {
    try {
      // Create CSV content
      let csv = 'Type,Value\n';
      csv += `Total Problems,${stats.total}\n`;
      csv += `Solved Problems,${stats.solved}\n`;
      csv += `Success Rate,${((stats.solved / stats.total) * 100).toFixed(2)}%\n\n`;
      
      csv += 'Tag,Solved,Total,Accuracy\n';
      Object.entries(stats.byTag).forEach(([tag, data]) => {
        csv += `${tag},${data.solved},${data.total},${data.accuracy.toFixed(2)}%\n`;
      });

      // Download
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `analytics-${Date.now()}.csv`;
      a.click();
      
      toast.success('Analytics exported successfully!');
    } catch (error) {
      toast.error('Failed to export analytics');
    }
  };

  // Weak tags analysis (tags with < 50% accuracy)
  const weakTags = Object.entries(stats.byTag)
    .filter(([_, data]) => data.accuracy < 50 && data.total >= 3)
    .sort((a, b) => a[1].accuracy - b[1].accuracy)
    .slice(0, 5);

  // Strong tags (tags with > 75% accuracy)
  const strongTags = Object.entries(stats.byTag)
    .filter(([_, data]) => data.accuracy > 75 && data.total >= 3)
    .sort((a, b) => b[1].accuracy - a[1].accuracy)
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Analytics</h1>
          <p className="text-slate-400 mt-1">Deep dive into your performance</p>
        </div>
        <button
          onClick={handleExportCSV}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
        >
          <Download className="w-4 h-4" />
          Export CSV
        </button>
      </div>

      {/* AI Insights Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Weak Tags */}
        <div className="bg-red-900/10 border border-red-800/30 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4 text-red-400">⚠️ Areas for Improvement</h3>
          {weakTags.length > 0 ? (
            <div className="space-y-2">
              {weakTags.map(([tag, data]) => (
                <div key={tag} className="flex items-center justify-between">
                  <span className="text-sm">{tag}</span>
                  <span className="text-sm text-red-400">{data.accuracy.toFixed(1)}%</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-400">No weak areas identified. Keep practicing!</p>
          )}
        </div>

        {/* Strong Tags */}
        <div className="bg-green-900/10 border border-green-800/30 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4 text-green-400">✓ Your Strengths</h3>
          {strongTags.length > 0 ? (
            <div className="space-y-2">
              {strongTags.map(([tag, data]) => (
                <div key={tag} className="flex items-center justify-between">
                  <span className="text-sm">{tag}</span>
                  <span className="text-sm text-green-400">{data.accuracy.toFixed(1)}%</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-400">Solve more problems to identify strengths</p>
          )}
        </div>
      </div>

      {/* Problem Statistics */}
      <ProblemStatsView stats={stats} />

      {/* Recent Submissions */}
      <div className="bg-slate-900 p-6 rounded-lg border border-slate-800">
        <h3 className="text-lg font-semibold mb-4">Recent Submissions</h3>
        <div className="space-y-2">
          {submissions.slice(0, 10).map((sub) => (
            <div
              key={sub.id}
              className="flex items-center justify-between p-3 bg-slate-800 rounded-lg hover:bg-slate-750 transition-colors"
            >
              <div className="flex-1">
                <p className="font-medium">{sub.problem.name}</p>
                <p className="text-sm text-slate-400">
                  {sub.problem.index} • {sub.problem.rating || 'N/A'}
                </p>
              </div>
              <div className="text-right">
                <span
                  className={`px-3 py-1 rounded text-sm font-medium ${
                    sub.verdict === 'OK'
                      ? 'bg-green-900/30 text-green-400'
                      : 'bg-red-900/30 text-red-400'
                  }`}
                >
                  {sub.verdict || 'UNKNOWN'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
