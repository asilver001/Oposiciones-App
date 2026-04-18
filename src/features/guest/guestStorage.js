const STORAGE_KEY = 'opositasmart_guest';

// Inactivity TTL: guest data expires 7 days after last activity.
// Any read/write updates lastActivityAt; after 7 days without use, data is wiped
// and the visitor is treated as new (modal will prompt them again).
const TTL_MS = 7 * 24 * 60 * 60 * 1000;

function generateUUID() {
  return crypto.randomUUID?.() ??
    'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
      const r = Math.random() * 16 | 0;
      return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
}

function isExpired(data) {
  if (!data) return true;
  const last = data.lastActivityAt ? new Date(data.lastActivityAt).getTime() : null;
  const created = data.createdAt ? new Date(data.createdAt).getTime() : null;
  const anchor = last ?? created;
  if (!anchor) return false;
  return Date.now() - anchor > TTL_MS;
}

function persist(data) {
  data.lastActivityAt = new Date().toISOString();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  return data;
}

export function getGuestData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw);
    if (isExpired(data)) {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }
    return data;
  } catch { return null; }
}

export function initGuestData(examDate) {
  const now = new Date().toISOString();
  const data = {
    guestId: generateUUID(),
    createdAt: now,
    lastActivityAt: now,
    examDate,
    sessions: [],
    allAnswered: {},
    totalSessions: 0,
    maxSessions: 5,
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  return data;
}

export function saveSession(session) {
  const data = getGuestData();
  if (!data) return null;
  data.sessions.push(session);
  data.totalSessions = data.sessions.length;
  for (const answer of session.answers) {
    const prev = data.allAnswered[answer.questionId];
    data.allAnswered[answer.questionId] = {
      correct: answer.correct,
      attempts: (prev?.attempts ?? 0) + 1,
    };
  }
  return persist(data);
}

/** Returns aggregated stats suitable for the home mini-progress strip. */
export function getGuestStats() {
  const data = getGuestData();
  if (!data || data.sessions.length === 0) return null;
  const totalAnswered = Object.keys(data.allAnswered).length;
  const totalCorrect = Object.values(data.allAnswered).filter(a => a.correct).length;
  const accuracy = totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : 0;
  return {
    totalSessions: data.totalSessions,
    maxSessions: data.maxSessions,
    totalAnswered,
    totalCorrect,
    accuracy,
    sessionsLeft: Math.max(0, data.maxSessions - data.totalSessions),
    lastSessionAt: data.sessions[data.sessions.length - 1]?.completedAt || null,
  };
}

export function clearGuestData() {
  localStorage.removeItem(STORAGE_KEY);
  sessionStorage.removeItem('guestModalDismissed');
  sessionStorage.removeItem('guestSignupPromptDismissed');
}

export function dismissGuestModal() {
  sessionStorage.setItem('guestModalDismissed', 'true');
}

export function isGuestModalDismissed() {
  return sessionStorage.getItem('guestModalDismissed') === 'true';
}

export function reopenGuestModal() {
  sessionStorage.removeItem('guestModalDismissed');
}

/** The "save your progress" banner is dismissable once per session. */
export function dismissSignupPrompt() {
  sessionStorage.setItem('guestSignupPromptDismissed', 'true');
}

export function isSignupPromptDismissed() {
  return sessionStorage.getItem('guestSignupPromptDismissed') === 'true';
}
