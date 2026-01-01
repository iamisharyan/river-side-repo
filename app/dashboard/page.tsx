'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/lib/store';
import DashboardNav from '@/components/dashboard/DashboardNav';
import OverviewTab from '@/components/dashboard/OverviewTab';
import AnalyticsTab from '@/components/dashboard/AnalyticsTab';
import CalendarTab from '@/components/dashboard/CalendarTab';
import ActivityTab from '@/components/dashboard/ActivityTab';
import SettingsTab from '@/components/dashboard/SettingsTab';
import LoadingSpinner from '@/components/LoadingSpinner';
import { getUserInfo, getRatingHistory, getUserSubmissions } from '@/lib/codeforces-api';
import toast from 'react-hot-toast';

export default function DashboardPage() {
  const router = useRouter();
  const { handle, setUserInfo, setRatingHistory, setSubmissions } = useAppStore();
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!handle) {
      router.push('/');
      return;
    }

    const loadData = async () => {
      try {
        setLoading(true);
        
        // Fetch all data in parallel for better performance
        const [userInfo, ratingHistory, submissions] = await Promise.all([
          getUserInfo(handle),
          getRatingHistory(handle),
          getUserSubmissions(handle),
        ]);

        setUserInfo(userInfo);
        setRatingHistory(ratingHistory);
        setSubmissions(submissions);
        
        toast.success('Data loaded successfully!');
      } catch (error) {
        console.error('Failed to load data:', error);
        toast.error('Failed to load data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [handle, router, setUserInfo, setRatingHistory, setSubmissions]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-slate-400">Loading your data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950">
      <DashboardNav activeTab={activeTab} onTabChange={setActiveTab} />
      
      <main className="md:ml-64 min-h-screen">
        <div className="p-6 md:p-8 mt-16 md:mt-0">
          {activeTab === 'overview' && <OverviewTab />}
          {activeTab === 'analytics' && <AnalyticsTab />}
          {activeTab === 'calendar' && <CalendarTab />}
          {activeTab === 'activity' && <ActivityTab />}
          {activeTab === 'settings' && <SettingsTab />}
        </div>
      </main>
    </div>
  );
}
