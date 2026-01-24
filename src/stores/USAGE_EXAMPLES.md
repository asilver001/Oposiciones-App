# Zustand Stores - Usage Examples

## Installation

Zustand is already installed: `zustand@^5.0.10`

## Importing Stores

```javascript
// Import individual stores
import { useNavigationStore } from './stores/useNavigationStore.js';
import { useUserStore } from './stores/useUserStore.js';
import { useStudyStore } from './stores/useStudyStore.js';

// Or use barrel export
import { useNavigationStore, useUserStore, useStudyStore } from './stores';
```

## useNavigationStore

Manages navigation state and modals.

### In React Components

```javascript
import { useNavigationStore } from './stores';

function MyComponent() {
  // Get specific state values
  const activeTab = useNavigationStore(state => state.activeTab);
  const showPremiumModal = useNavigationStore(state => state.showPremiumModal);

  // Get actions
  const setActiveTab = useNavigationStore(state => state.setActiveTab);
  const togglePremiumModal = useNavigationStore(state => state.togglePremiumModal);

  return (
    <div>
      <button onClick={() => setActiveTab('estudiar')}>
        Go to Study
      </button>
      <button onClick={togglePremiumModal}>
        Open Premium Modal
      </button>
    </div>
  );
}
```

### Available State & Actions

```javascript
// State
activeTab: 'inicio' | 'estudiar' | 'repaso' | 'progreso'
showPremiumModal: boolean
showSettingsModal: boolean
showProgressModal: boolean
showFeedbackPanel: boolean
premiumModalTrigger: string

// Actions
setActiveTab(tab)
togglePremiumModal()
toggleSettingsModal()
toggleProgressModal()
toggleFeedbackPanel()
closePremiumModal()
closeSettingsModal()
closeProgressModal()
closeFeedbackPanel()
setPremiumModalTrigger(trigger)
```

## useUserStore

Manages user data and stats with localStorage persistence.

### In React Components

```javascript
import { useUserStore } from './stores';

function ProfileComponent() {
  const userData = useUserStore(state => state.userData);
  const setUserData = useUserStore(state => state.setUserData);
  const isPremium = useUserStore(state => state.isPremium);
  const streakData = useUserStore(state => state.streakData);

  const updateName = (name) => {
    setUserData({ name });
  };

  return (
    <div>
      <p>Welcome, {userData.name}!</p>
      <p>Current streak: {streakData.current} days</p>
      {isPremium && <span>Premium User</span>}
    </div>
  );
}
```

### Available State & Actions

```javascript
// State
userData: {
  name: string
  email: string
  examDate: string
  dailyGoal: number
  dailyGoalMinutes: number
  accountCreated: boolean
  oposicion: string
}
streakData: {
  current: number
  longest: number
  lastCompletedDate: string | null
}
dailyTestsCount: number
isPremium: boolean
totalStats: {
  totalQuestions: number
  correctAnswers: number
  totalTimeSpent: number
}
onboardingComplete: boolean

// Actions
setUserData(data)
setStreakData(data)
incrementDailyTests()
resetDailyTests()
setPremium(value)
updateTotalStats(stats)
completeOnboarding()
resetUserData()
```

## useStudyStore

Manages study session state (not persisted).

### In React Components

```javascript
import { useStudyStore } from './stores';

function StudySession() {
  const currentQuestion = useStudyStore(state => state.currentQuestion);
  const selectedAnswer = useStudyStore(state => state.selectedAnswer);
  const questions = useStudyStore(state => state.questions);
  const answers = useStudyStore(state => state.answers);

  const selectAnswer = useStudyStore(state => state.selectAnswer);
  const submitAnswer = useStudyStore(state => state.submitAnswer);
  const nextQuestion = useStudyStore(state => state.nextQuestion);

  const currentQ = questions[currentQuestion];

  return (
    <div>
      <h3>{currentQ?.question}</h3>
      {currentQ?.options.map(opt => (
        <button
          key={opt}
          onClick={() => selectAnswer(opt)}
          className={selectedAnswer === opt ? 'selected' : ''}
        >
          {opt}
        </button>
      ))}
      <button onClick={submitAnswer}>Submit Answer</button>
      <button onClick={nextQuestion}>Next</button>
    </div>
  );
}
```

### Available State & Actions

```javascript
// State
currentQuestion: number
selectedAnswer: string | null
answers: Record<number, { selected: string, correct: boolean, timestamp: number }>
showExplanation: boolean
timeElapsed: number
testResults: { total, correct, incorrect, percentage, timeElapsed } | null
showExitConfirm: boolean
questions: Array<Question>

// Actions
setQuestions(questions)
setCurrentQuestion(index)
nextQuestion()
previousQuestion()
selectAnswer(answer)
submitAnswer()
toggleExplanation()
incrementTime()
resetTime()
completeTest()
toggleExitConfirm()
resetSession()
```

## Outside React Components

You can also use stores outside React components:

```javascript
import { useNavigationStore } from './stores';

// Get current state
const currentTab = useNavigationStore.getState().activeTab;

// Call actions
useNavigationStore.getState().setActiveTab('estudiar');

// Subscribe to changes
const unsubscribe = useNavigationStore.subscribe((state) => {
  console.log('Navigation state changed:', state);
});

// Unsubscribe when done
unsubscribe();
```

## Best Practices

1. **Select only what you need**: Use selectors to avoid unnecessary re-renders
   ```javascript
   // Good
   const name = useUserStore(state => state.userData.name);

   // Avoid (re-renders on any userData change)
   const userData = useUserStore(state => state.userData);
   ```

2. **Combine selectors**: Group related selections
   ```javascript
   const { activeTab, setActiveTab } = useNavigationStore(state => ({
     activeTab: state.activeTab,
     setActiveTab: state.setActiveTab
   }));
   ```

3. **Use shallow comparison for objects**:
   ```javascript
   import { shallow } from 'zustand/shallow';

   const { name, email } = useUserStore(
     state => ({ name: state.userData.name, email: state.userData.email }),
     shallow
   );
   ```

## Persistence

The following stores use localStorage persistence:

- **useNavigationStore**: Only `activeTab` is persisted
- **useUserStore**: All state is persisted
- **useStudyStore**: No persistence (session-only)

Persisted data is automatically saved to localStorage and restored on app reload.
