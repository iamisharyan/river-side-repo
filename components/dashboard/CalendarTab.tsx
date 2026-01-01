/**
 * Calendar tab - Upcoming contests and calendar view
 */

'use client';

import { useState, useEffect } from 'react';
import { useAppStore } from '@/lib/store';
import { getContestList } from '@/lib/codeforces-api';
import type { Contest } from '@/types/codeforces';
import { format, fromUnixTime, addHours } from 'date-fns';
import { Calendar as CalendarIcon, Clock, CheckCircle, XCircle, Circle } from 'lucide-react';
import LoadingSpinner from '@/components/LoadingSpinner';
import toast from 'react-hot-toast';

export default function CalendarTab() {
  const { attendedContests, skippedContests, markContestAttended, markContestSkipped } = useAppStore();
  const [contests, setContests] = useState<Contest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadContests();
  }, []);

  const loadContests = async () => {
    try {
      setLoading(true);
      const allContests = await getContestList();
      
      // Filter to upcoming and recent contests
      const now = Date.now() / 1000;
      const filtered = allContests
        .filter(c => c.phase === 'BEFORE' || (c.startTimeSeconds && c.startTimeSeconds > now - 7 * 24 * 60 * 60))
        .sort((a, b) => (b.startTimeSeconds || 0) - (a.startTimeSeconds || 0));
      
      setContests(filtered);
    } catch (error) {
      console.error('Failed to load contests:', error);
      toast.error('Failed to load contests');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const upcomingContests = contests.filter(c => c.phase === 'BEFORE');
  const pastContests = contests.filter(c => c.phase !== 'BEFORE');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Contest Calendar</h1>
        <p className="text-slate-400 mt-1">Track upcoming contests and your participation</p>
      </div>

      {/* Upcoming Contests */}
      <div>
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <CalendarIcon className="w-5 h-5" />
          Upcoming Contests
        </h2>
        {upcomingContests.length > 0 ? (
          <div className="space-y-3">
            {upcomingContests.map((contest) => (
              <ContestCard
                key={contest.id}
                contest={contest}
                attended={attendedContests.has(contest.id)}
                skipped={skippedContests.has(contest.id)}
                onMarkAttended={() => markContestAttended(contest.id)}
                onMarkSkipped={() => markContestSkipped(contest.id)}
              />
            ))}
          </div>
        ) : (
          <div className="bg-slate-900 p-8 rounded-lg border border-slate-800 text-center">
            <p className="text-slate-400">No upcoming contests</p>
          </div>
        )}
      </div>

      {/* Recent Contests */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Recent Contests</h2>
        {pastContests.length > 0 ? (
          <div className="space-y-3">
            {pastContests.slice(0, 5).map((contest) => (
              <ContestCard
                key={contest.id}
                contest={contest}
                attended={attendedContests.has(contest.id)}
                skipped={skippedContests.has(contest.id)}
                onMarkAttended={() => markContestAttended(contest.id)}
                onMarkSkipped={() => markContestSkipped(contest.id)}
                isPast
              />
            ))}
          </div>
        ) : (
          <div className="bg-slate-900 p-8 rounded-lg border border-slate-800 text-center">
            <p className="text-slate-400">No recent contests</p>
          </div>
        )}
      </div>
    </div>
  );
}

interface ContestCardProps {
  contest: Contest;
  attended: boolean;
  skipped: boolean;
  onMarkAttended: () => void;
  onMarkSkipped: () => void;
  isPast?: boolean;
}

function ContestCard({ contest, attended, skipped, onMarkAttended, onMarkSkipped, isPast = false }: ContestCardProps) {
  const startTime = contest.startTimeSeconds 
    ? fromUnixTime(contest.startTimeSeconds)
    : new Date();
  
  // Convert to IST (UTC+5:30)
  const istTime = addHours(startTime, 5.5);
  
  const duration = contest.durationSeconds / 3600; // hours

  return (
    <div className="bg-slate-900 p-6 rounded-lg border border-slate-800 hover:border-slate-700 transition-colors">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <h3 className="font-semibold text-lg mb-2">{contest.name}</h3>
          
          <div className="space-y-1 text-sm text-slate-400">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>
                {format(istTime, 'PPpp')} IST
              </span>
            </div>
            <div className="flex items-center gap-2">
              <CalendarIcon className="w-4 h-4" />
              <span>Duration: {duration} hours</span>
            </div>
          </div>
        </div>

        {!isPast && (
          <div className="flex gap-2">
            <button
              onClick={onMarkAttended}
              className={`p-2 rounded-lg transition-colors ${
                attended
                  ? 'bg-green-900/30 text-green-400'
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
              }`}
              title="Mark as attending"
            >
              <CheckCircle className="w-5 h-5" />
            </button>
            <button
              onClick={onMarkSkipped}
              className={`p-2 rounded-lg transition-colors ${
                skipped
                  ? 'bg-red-900/30 text-red-400'
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
              }`}
              title="Mark as skipped"
            >
              <XCircle className="w-5 h-5" />
            </button>
          </div>
        )}

        {isPast && (attended || skipped) && (
          <div className="flex items-center gap-2">
            {attended && (
              <span className="px-3 py-1 bg-green-900/30 text-green-400 rounded-full text-sm">
                Attended
              </span>
            )}
            {skipped && (
              <span className="px-3 py-1 bg-red-900/30 text-red-400 rounded-full text-sm">
                Skipped
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
