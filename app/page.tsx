'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/lib/store';
import { User, TrendingUp, Calendar, Activity, Settings, BarChart3 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function HomePage() {
  const router = useRouter();
  const { handle, setHandle } = useAppStore();
  const [inputHandle, setInputHandle] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // If handle already exists, redirect to dashboard
    if (handle) {
      router.push('/dashboard');
    }
  }, [handle, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputHandle.trim()) {
      toast.error('Please enter a Codeforces handle');
      return;
    }

    setIsLoading(true);

    try {
      // Verify the handle exists by making a test API call
      const response = await fetch(`https://codeforces.com/api/user.info?handles=${inputHandle}`);
      const data = await response.json();

      if (data.status !== 'OK') {
        toast.error('Invalid Codeforces handle');
        setIsLoading(false);
        return;
      }

      // Save handle and redirect
      setHandle(inputHandle.trim());
      toast.success('Handle saved! Redirecting...');
      
      setTimeout(() => {
        router.push('/dashboard');
      }, 500);
    } catch (error) {
      toast.error('Failed to verify handle. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
            CP Performance Tracker
          </h1>
          <p className="text-xl text-slate-400">
            Track, analyze, and improve your competitive programming performance
          </p>
        </div>

        {/* Main Card */}
        <div className="max-w-2xl mx-auto">
          <div className="bg-slate-900 p-8 rounded-2xl border border-slate-800 shadow-2xl">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="handle" className="block text-sm font-medium mb-2">
                  Enter your Codeforces handle
                </label>
                <input
                  id="handle"
                  type="text"
                  value={inputHandle}
                  onChange={(e) => setInputHandle(e.target.value)}
                  placeholder="e.g., tourist, Petr, Benq"
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-slate-500"
                  disabled={isLoading}
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-700 disabled:cursor-not-allowed rounded-lg font-semibold transition-colors"
              >
                {isLoading ? 'Verifying...' : 'Get Started'}
              </button>
            </form>
          </div>

          {/* Features Grid */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-4">
            <FeatureCard
              icon={<TrendingUp className="w-6 h-6" />}
              title="Rating Analytics"
              description="Visualize your rating progress with detailed charts"
            />
            <FeatureCard
              icon={<BarChart3 className="w-6 h-6" />}
              title="Problem Statistics"
              description="Track solved problems by tags and difficulty"
            />
            <FeatureCard
              icon={<Activity className="w-6 h-6" />}
              title="Activity Heatmap"
              description="GitHub-style heatmap of your daily activity"
            />
            <FeatureCard
              icon={<Calendar className="w-6 h-6" />}
              title="Contest Calendar"
              description="Never miss a contest with integrated calendar"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="bg-slate-900 p-6 rounded-lg border border-slate-800 hover:border-slate-700 transition-colors">
      <div className="flex items-start gap-4">
        <div className="text-blue-500 mt-1">{icon}</div>
        <div>
          <h3 className="font-semibold mb-1">{title}</h3>
          <p className="text-sm text-slate-400">{description}</p>
        </div>
      </div>
    </div>
  );
}
