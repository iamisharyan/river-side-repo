/**
 * Settings tab - User preferences and configuration
 */

'use client';

import { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { Moon, Sun, Bell, BellOff, Globe, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { clearCache } from '@/lib/codeforces-api';

export default function SettingsTab() {
  const {
    handle,
    darkMode,
    timezone,
    reminderEnabled,
    toggleDarkMode,
    setTimezone,
    toggleReminder,
    clearData,
  } = useAppStore();

  const [newHandle, setNewHandle] = useState(handle || '');

  const handleClearCache = () => {
    if (confirm('Are you sure you want to clear the cache? This will force fresh data on next load.')) {
      clearCache();
      toast.success('Cache cleared successfully!');
    }
  };

  const handleChangeHandle = async () => {
    if (!newHandle.trim()) {
      toast.error('Please enter a valid handle');
      return;
    }

    try {
      // Verify the handle
      const response = await fetch(`https://codeforces.com/api/user.info?handles=${newHandle}`);
      const data = await response.json();

      if (data.status !== 'OK') {
        toast.error('Invalid Codeforces handle');
        return;
      }

      // Clear old data and set new handle
      clearData();
      window.location.reload();
    } catch (error) {
      toast.error('Failed to verify handle');
    }
  };

  const timezones = [
    'Asia/Kolkata',
    'America/New_York',
    'America/Los_Angeles',
    'Europe/London',
    'Europe/Paris',
    'Asia/Tokyo',
    'Australia/Sydney',
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-slate-400 mt-1">Customize your experience</p>
      </div>

      {/* Account Settings */}
      <div className="bg-slate-900 p-6 rounded-lg border border-slate-800">
        <h3 className="text-lg font-semibold mb-4">Account</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Codeforces Handle</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={newHandle}
                onChange={(e) => setNewHandle(e.target.value)}
                className="flex-1 px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Your handle"
              />
              <button
                onClick={handleChangeHandle}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
              >
                Update
              </button>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Changing your handle will clear all cached data and reload the page
            </p>
          </div>
        </div>
      </div>

      {/* Appearance */}
      <div className="bg-slate-900 p-6 rounded-lg border border-slate-800">
        <h3 className="text-lg font-semibold mb-4">Appearance</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {darkMode ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
              <div>
                <p className="font-medium">Dark Mode</p>
                <p className="text-sm text-slate-400">Currently {darkMode ? 'enabled' : 'disabled'}</p>
              </div>
            </div>
            <button
              onClick={toggleDarkMode}
              className={`relative w-14 h-7 rounded-full transition-colors ${
                darkMode ? 'bg-blue-600' : 'bg-slate-700'
              }`}
            >
              <div
                className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform ${
                  darkMode ? 'translate-x-7' : ''
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Preferences */}
      <div className="bg-slate-900 p-6 rounded-lg border border-slate-800">
        <h3 className="text-lg font-semibold mb-4">Preferences</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2 flex items-center gap-2">
              <Globe className="w-4 h-4" />
              Timezone
            </label>
            <select
              value={timezone}
              onChange={(e) => {
                setTimezone(e.target.value);
                toast.success('Timezone updated!');
              }}
              className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {timezones.map((tz) => (
                <option key={tz} value={tz}>
                  {tz}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {reminderEnabled ? <Bell className="w-5 h-5" /> : <BellOff className="w-5 h-5" />}
              <div>
                <p className="font-medium">Contest Reminders</p>
                <p className="text-sm text-slate-400">Get notified about upcoming contests</p>
              </div>
            </div>
            <button
              onClick={() => {
                toggleReminder();
                toast.success(reminderEnabled ? 'Reminders disabled' : 'Reminders enabled');
              }}
              className={`relative w-14 h-7 rounded-full transition-colors ${
                reminderEnabled ? 'bg-blue-600' : 'bg-slate-700'
              }`}
            >
              <div
                className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform ${
                  reminderEnabled ? 'translate-x-7' : ''
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Data Management */}
      <div className="bg-slate-900 p-6 rounded-lg border border-slate-800">
        <h3 className="text-lg font-semibold mb-4">Data Management</h3>
        <div className="space-y-3">
          <button
            onClick={handleClearCache}
            className="w-full flex items-center justify-between p-4 bg-slate-800 hover:bg-slate-750 rounded-lg transition-colors"
          >
            <div className="flex items-center gap-3">
              <Trash2 className="w-5 h-5 text-yellow-500" />
              <div className="text-left">
                <p className="font-medium">Clear Cache</p>
                <p className="text-sm text-slate-400">Force refresh data from Codeforces API</p>
              </div>
            </div>
          </button>

          <button
            onClick={() => {
              if (confirm('Are you sure? This will clear all your data and logout.')) {
                clearData();
                window.location.href = '/';
              }
            }}
            className="w-full flex items-center justify-between p-4 bg-red-900/20 hover:bg-red-900/30 rounded-lg transition-colors border border-red-800/30"
          >
            <div className="flex items-center gap-3">
              <Trash2 className="w-5 h-5 text-red-500" />
              <div className="text-left">
                <p className="font-medium text-red-400">Clear All Data</p>
                <p className="text-sm text-slate-400">Remove all stored data and logout</p>
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* About */}
      <div className="bg-slate-900 p-6 rounded-lg border border-slate-800">
        <h3 className="text-lg font-semibold mb-4">About</h3>
        <p className="text-sm text-slate-400">
          CP Performance Tracker v1.0.0
          <br />
          A production-ready tool for tracking competitive programming performance
          <br />
          Built with Next.js, TypeScript, and Tailwind CSS
        </p>
      </div>
    </div>
  );
}
