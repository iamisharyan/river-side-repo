/**
 * Codeforces API Service
 * Handles all API calls to Codeforces with rate limiting and caching
 */

import type {
  CodeforcesAPIResponse,
  CodeforcesUser,
  RatingChange,
  Submission,
  Contest,
} from '@/types/codeforces';

const BASE_URL = 'https://codeforces.com/api';
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
const RATE_LIMIT_DELAY = 2000; // 2 seconds between requests

// Simple in-memory cache
const cache = new Map<string, { data: any; timestamp: number }>();

// Rate limiting
let lastRequestTime = 0;

/**
 * Delays execution to respect rate limits
 */
async function rateLimit(): Promise<void> {
  const now = Date.now();
  const timeSinceLastRequest = now - lastRequestTime;
  
  if (timeSinceLastRequest < RATE_LIMIT_DELAY) {
    await new Promise(resolve => 
      setTimeout(resolve, RATE_LIMIT_DELAY - timeSinceLastRequest)
    );
  }
  
  lastRequestTime = Date.now();
}

/**
 * Generic fetch with caching and rate limiting
 */
async function fetchWithCache<T>(
  url: string,
  useCache: boolean = true
): Promise<T> {
  // Check cache first
  if (useCache && cache.has(url)) {
    const cached = cache.get(url)!;
    if (Date.now() - cached.timestamp < CACHE_DURATION) {
      return cached.data as T;
    }
    cache.delete(url);
  }

  // Rate limit
  await rateLimit();

  // Fetch data
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(`API request failed: ${response.statusText}`);
  }

  const json: CodeforcesAPIResponse<T> = await response.json();

  if (json.status !== 'OK') {
    throw new Error(json.comment || 'API request failed');
  }

  // Cache the result
  if (useCache) {
    cache.set(url, { data: json.result, timestamp: Date.now() });
  }

  return json.result;
}

/**
 * Fetches user information
 */
export async function getUserInfo(handle: string): Promise<CodeforcesUser> {
  const url = `${BASE_URL}/user.info?handles=${handle}`;
  const users = await fetchWithCache<CodeforcesUser[]>(url);
  return users[0];
}

/**
 * Fetches user rating history
 */
export async function getRatingHistory(handle: string): Promise<RatingChange[]> {
  const url = `${BASE_URL}/user.rating?handle=${handle}`;
  return fetchWithCache<RatingChange[]>(url);
}

/**
 * Fetches user submissions
 */
export async function getUserSubmissions(
  handle: string,
  from: number = 1,
  count: number = 10000
): Promise<Submission[]> {
  const url = `${BASE_URL}/user.status?handle=${handle}&from=${from}&count=${count}`;
  return fetchWithCache<Submission[]>(url);
}

/**
 * Fetches contest list
 */
export async function getContestList(gym: boolean = false): Promise<Contest[]> {
  const url = `${BASE_URL}/contest.list?gym=${gym}`;
  return fetchWithCache<Contest[]>(url);
}

/**
 * Fetches contest standings
 */
export async function getContestStandings(
  contestId: number,
  handle?: string
): Promise<any> {
  const handleParam = handle ? `&handles=${handle}` : '';
  const url = `${BASE_URL}/contest.standings?contestId=${contestId}${handleParam}&from=1&count=1`;
  return fetchWithCache<any>(url, false); // Don't cache standings as they update
}

/**
 * Clears the cache (useful for forcing fresh data)
 */
export function clearCache(): void {
  cache.clear();
}

/**
 * Gets cache statistics
 */
export function getCacheStats(): { size: number; keys: string[] } {
  return {
    size: cache.size,
    keys: Array.from(cache.keys()),
  };
}
