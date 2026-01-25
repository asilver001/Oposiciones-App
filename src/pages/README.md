# Pages Directory

This directory contains all the page-level components for OpositaSmart, following a feature-based architecture.

## Structure

```
src/pages/
├── HomePage/           # Main home screen with SoftFortHome
│   ├── HomePage.jsx
│   └── index.js
├── StudyPage/          # Study session/test flow
│   ├── StudyPage.jsx
│   └── index.js
├── ActivityPage/       # Activity tracking and stats
│   ├── ActivityPage.jsx
│   └── index.js
└── index.js           # Central export for all pages
```

## Core Pages

### HomePage

Wraps the `SoftFortHome` component with proper data integration from Zustand stores and hooks.

**Features:**
- User greeting and streak display
- FortalezaVisual (topic fortress)
- Study session CTA
- Stats cards (streak, accuracy)
- Navigation to all main sections

**Usage:**
```jsx
import { HomePage } from '@/pages';
// or
import HomePage from '@/pages/HomePage';
```

### StudyPage

Handles the study session initialization and will integrate with HybridSession component.

**Features:**
- Question loading based on topic or random
- Session initialization from dailyGoal
- Loading states
- Empty states for no questions
- Placeholder for HybridSession integration

**Usage:**
```jsx
import { StudyPage } from '@/pages';

// Navigate with optional topic filter
navigate('/study', { state: { topicId: 1 } });
```

### ActivityPage

Wrapper for ActividadPage component with proper data integration.

**Features:**
- Study mode selection (swipeable tabs)
- Progress stats and charts
- Session history
- Dev mode for testing different user states

**Usage:**
```jsx
import { ActivityPage } from '@/pages';
```

## Data Flow

### HomePage
- **Stores**: `useUserStore` (userData, streakData, totalStats)
- **Hooks**: `useTopics` (topicsWithQuestions, getFortalezaData)
- **Navigation**: React Router navigate

### StudyPage
- **Stores**: `useStudyStore` (questions, setQuestions, resetSession), `useUserStore` (userData)
- **Data**: `allQuestions`, `getRandomQuestions`, `getQuestionsByTopic`
- **Location State**: Optional `topicId` from navigation

### ActivityPage
- **Stores**: `useUserStore` (totalStats, streakData)
- **Props**: Passes formatted data to ActividadPage
- **Dev Mode**: Enabled for testing user states

## Integration with Router

All pages are designed to work with React Router v6:

```jsx
import { HomePage, StudyPage, ActivityPage } from '@/pages';

// In your router setup
<Route path="/" element={<HomePage />} />
<Route path="/study" element={<StudyPage />} />
<Route path="/activity" element={<ActivityPage />} />
```

## Next Steps

1. **StudyPage**: Integrate HybridSession component for actual study flow
2. **ActivityPage**: Connect to real session history from backend
3. **HomePage**: Add more interactive features to FortalezaVisual
4. **All Pages**: Add loading states for async data fetching

## Related Components

- **Home**: `src/components/home/SoftFortHome.jsx`
- **Activity**: `src/components/activity/ActividadPage.jsx`
- **Study**: `src/components/study/HybridSession.jsx` (to be integrated)

## Stores Used

- **useUserStore**: User profile, streak, stats
- **useStudyStore**: Study session state
- **useNavigationStore**: App navigation state (if needed)

## Hooks Used

- **useTopics**: Topic data and progress from Supabase
- **useAuth**: Authentication state
- **useSpacedRepetition**: FSRS algorithm (to be integrated)
