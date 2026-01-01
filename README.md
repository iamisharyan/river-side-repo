# CP Performance Tracker

A production-ready personal web application for tracking and improving competitive programming performance on Codeforces.

## 🚀 Features

### Core Features

#### Codeforces Integration
- **Handle Persistence**: Store your Codeforces handle (localStorage)
- **Real-time Data**: Fetch user info, rating history, and submissions via official Codeforces API
- **Rate Limiting**: Built-in API rate limiting (2s between requests)
- **Caching**: Intelligent 5-minute cache to reduce API calls

#### Dashboard Analytics
- **Rating Graph**: Interactive, zoomable rating progression chart with color-coded rank tiers
- **Problem Statistics**: Comprehensive breakdown by:
  - Difficulty levels
  - Problem tags
  - Solved vs attempted problems
  - Tag-wise accuracy
- **Contest Performance**: Detailed analytics for each contest including:
  - Rank and rating changes
  - Recent contest history
  - Performance trends

#### Activity Heatmaps (Data-Driven)
- **GitHub-Style Heatmap**: Real submission activity visualization
- **Daily Tracking**: Color-coded cells based on daily submission count
- **Contest Participation**: Visual timeline of contest participation
- **Yearly View**: Select different years to view historical data

#### Contest Calendar
- **Upcoming Contests**: Codeforces contest list with IST timezone
- **Attendance Tracking**: Mark contests as attended/skipped
- **Contest Details**: Duration, start time, and contest information
- **Recent History**: View past contests

### Additional Features (15+)

1. **Rating Prediction**: ML-based prediction for next contest rating
2. **Streak Tracking**: Current and longest daily coding streaks
3. **Problem Success Rate**: Overall accuracy percentage
4. **Weak Tag Analysis**: Identify areas needing improvement (< 50% accuracy)
5. **Strong Tag Identification**: Highlight your strengths (> 75% accuracy)
6. **Recent Submissions Viewer**: Last 10 submissions with verdict
7. **Export Analytics**: Download statistics as CSV
8. **Dark Mode**: Full dark theme optimized for long coding sessions
9. **Responsive Design**: Desktop-first, mobile-compatible
10. **Activity Insights**: AI-powered suggestions based on your activity
11. **Timezone Support**: Multiple timezone options (default IST)
12. **Contest Reminders**: Enable/disable notifications
13. **Cache Management**: Clear cache for fresh data
14. **Data Privacy**: All data stored locally, no external tracking
15. **Keyboard Navigation**: Accessible navigation system

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **State Management**: Zustand
- **Date Utilities**: date-fns
- **Notifications**: react-hot-toast
- **Icons**: lucide-react

## 📦 Installation

```bash
# Clone the repository
git clone <repo-url>
cd river-side-repo

# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## 🎯 Usage

1. **First Time Setup**:
   - Enter your Codeforces handle on the home page
   - Application verifies the handle and saves it
   - Automatically fetches and displays your data

2. **Dashboard Navigation**:
   - **Overview**: Quick stats, rating chart, recent contests
   - **Analytics**: Detailed problem statistics, weak/strong tags
   - **Calendar**: Upcoming and past contests
   - **Activity**: Heatmaps and streak tracking
   - **Settings**: Preferences, timezone, data management

3. **Data Refresh**:
   - Data is cached for 5 minutes
   - Clear cache in Settings to force refresh
   - Change handle to switch accounts

## 📊 Architecture

```
/app
  /dashboard         - Main dashboard page
  layout.tsx         - Root layout with dark theme
  page.tsx          - Landing page with handle input
  globals.css       - Global styles

/components
  /dashboard         - Dashboard-specific components
  Heatmap.tsx       - GitHub-style activity heatmap
  RatingChart.tsx   - Rating progression chart
  ProblemStatsView.tsx - Problem statistics
  LoadingSpinner.tsx - Loading indicator

/lib
  codeforces-api.ts - API service with rate limiting
  store.ts          - Zustand state management

/utils
  analytics.ts      - Data processing utilities

/types
  codeforces.ts     - TypeScript type definitions
```

## 🔒 Security & Privacy

- No user authentication required
- All data cached locally (localStorage)
- No external data sharing
- API calls only to official Codeforces endpoints
- No tracking or analytics

## 🎨 Design Philosophy

- **Dark Mode First**: Optimized for extended coding sessions
- **Minimal & Clean**: No portfolio-style fluff
- **Production Ready**: No placeholder UI or fake data
- **Performance Optimized**: Caching, code splitting, lazy loading
- **Responsive**: Desktop-first with mobile support

## 📝 API Rate Limits

Codeforces API has rate limits:
- 1 request per 2 seconds (implemented)
- 5-minute cache reduces API calls
- Parallel requests handled sequentially

## 🔮 Future Enhancements

- AI assistant for personalized practice plans
- Problem recommendation engine
- Compare with other users
- Virtual contest tracking
- PDF export for analytics
- TLE Eliminators calendar integration
- WebSocket for live contest updates

## 📄 License

Private utility for personal use.

## 🙏 Credits

- Data from [Codeforces API](https://codeforces.com/apiHelp)
- Built with modern web technologies
