# Pages Implementation Guide

## Overview

Three core pages have been created for OpositaSmart following the feature-based architecture:

1. **HomePage** - Main dashboard with SoftFortHome integration
2. **StudyPage** - Study session initialization and management
3. **ActivityPage** - Activity tracking and statistics

## Files Created

```
src/pages/
├── HomePage/
│   ├── HomePage.jsx       (57 lines)
│   └── index.js
├── StudyPage/
│   ├── StudyPage.jsx      (154 lines)
│   └── index.js
├── ActivityPage/
│   ├── ActivityPage.jsx   (45 lines)
│   └── index.js
├── index.js               (Central export)
└── README.md             (Documentation)
```

## Usage in Router

```jsx
import { HomePage, StudyPage, ActivityPage } from '@/pages';
// or using path alias
import { HomePage, StudyPage, ActivityPage } from 'src/pages';

// Router configuration
<Routes>
  <Route path="/" element={<HomePage />} />
  <Route path="/study" element={<StudyPage />} />
  <Route path="/activity" element={<ActivityPage />} />
</Routes>
```

## Page Details

### 1. HomePage

**Purpose**: Main dashboard integrating SoftFortHome component

**Data Sources**:
- `useUserStore`: User profile, streak, total stats
- `useTopics`: Topics with questions, fortaleza data

**Features**:
- User greeting with streak display
- FortalezaVisual showing topic progress
- Session CTA card
- Stats cards (streak, accuracy, level)
- Navigation to all sections

**Navigation Handlers**:
- `onStartSession()` → `/study`
- `onTopicSelect(topicId)` → `/study` with topic state
- `onSettingsClick()` → `/settings`
- `onProgressClick()` → `/activity`
- `onViewAllTopics()` → `/temas`

**Example**:
```jsx
<HomePage />
// Renders SoftFortHome with full data integration
```

### 2. StudyPage

**Purpose**: Initialize and manage study sessions

**Data Sources**:
- `useStudyStore`: Questions, session state
- `useUserStore`: Daily goal, user preferences
- `allQuestions`, `getRandomQuestions`: Question data

**Features**:
- Question loading with topic filtering
- Session initialization based on dailyGoal
- Loading and empty states
- Placeholder for HybridSession integration
- Quick stats display

**Navigation**:
```jsx
// Random questions
navigate('/study');

// Topic-specific questions
navigate('/study', { state: { topicId: 1 } });
```

**Integration Points**:
- `HybridSession` component (to be integrated)
- Question filtering by topic
- Session state management

### 3. ActivityPage

**Purpose**: Display activity statistics and study modes

**Data Sources**:
- `useUserStore`: Total stats, streak data
- Props formatted for ActividadPage component

**Features**:
- Study mode selection (swipeable tabs)
- Progress statistics grid
- Weekly activity chart
- Session history
- Dev mode for testing user states

**Dev Mode**:
```jsx
<ActivityPage />
// Dev mode enabled by default for testing
// Shows floating dice button to simulate user states
```

## Data Flow

### HomePage → StudyPage
```jsx
// From HomePage
<button onClick={() => navigate('/study', { state: { topicId: 1 } })}>
  Study Topic 1
</button>

// In StudyPage
const location = useLocation();
const topicId = location.state?.topicId; // undefined or topic ID
```

### StudyPage Session Lifecycle
```jsx
1. Mount → initSession()
2. Load questions (topic-specific or random)
3. setQuestions(sessionQuestions)
4. Render HybridSession (to be integrated)
5. Unmount → resetSession()
```

### ActivityPage Data Flow
```jsx
1. Get stats from useUserStore
2. Format for ActividadPage component
3. Pass weeklyData, sessionHistory, totalStats
4. Render with dev mode enabled
```

## Integration Checklist

- [x] HomePage wraps SoftFortHome
- [x] StudyPage initializes questions
- [x] ActivityPage wraps ActividadPage
- [x] All use Zustand stores
- [x] React Router navigation
- [x] Build compiles successfully
- [ ] HybridSession integration in StudyPage
- [ ] Backend session history in ActivityPage
- [ ] Real-time data sync

## Next Steps

### StudyPage Enhancement
```jsx
// Replace placeholder with HybridSession
import { HybridSession } from '../../components/study';

// In StudyPage render
{!isLoading && questions.length > 0 && (
  <HybridSession
    questions={questions}
    onComplete={(results) => {
      // Save results
      // Update stats
      // Navigate to results
    }}
  />
)}
```

### ActivityPage Enhancement
```jsx
// Fetch real session history
const { sessionHistory, loading } = useSessionHistory();

// Pass to ActividadPage
<ActividadPage
  sessionHistory={sessionHistory}
  loading={loading}
  // ... other props
/>
```

## Build Verification

```bash
# Build succeeded
npm run build
# ✓ 2437 modules transformed
# ✓ built in 5.88s

# All imports verified
# All default exports present
# React Router navigation ready
```

## Store Dependencies

### useUserStore
```javascript
{
  userData: { name, email, examDate, dailyGoal, oposicion },
  streakData: { current, longest, lastCompletedDate },
  totalStats: { totalQuestions, correctAnswers, totalTimeSpent }
}
```

### useStudyStore
```javascript
{
  questions: [],
  currentQuestion: 0,
  answers: {},
  setQuestions: (questions) => void,
  resetSession: () => void
}
```

### useTopics (hook)
```javascript
{
  topicsWithQuestions: Topic[],
  getFortalezaData: () => FortalezaItem[],
  loading: boolean
}
```

## Component Dependencies

- **HomePage**: `SoftFortHome`, `FortalezaVisual`, `TopBar`, `EmptyState`
- **StudyPage**: `HybridSession` (to be integrated), Lucide icons
- **ActivityPage**: `ActividadPage`, `EmptyState`

## Testing

All pages can be tested with:
- Dev mode in ActivityPage (user state simulation)
- Navigation between pages
- Topic selection from HomePage to StudyPage
- Empty states for new users

## Architecture Benefits

✅ **Separation of Concerns**: Pages handle routing, components handle UI
✅ **Reusability**: Components can be used in multiple pages
✅ **Maintainability**: Clear file structure and responsibilities
✅ **Scalability**: Easy to add new pages following the same pattern
✅ **Type Safety Ready**: Structure supports TypeScript migration

---

**Created**: 2026-01-25
**Status**: Ready for integration
**Build Status**: ✅ Passing
