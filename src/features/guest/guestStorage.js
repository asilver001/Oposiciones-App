const STORAGE_KEY = 'opositasmart_guest';

function generateUUID() {
  return crypto.randomUUID?.() ??
    'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
      const r = Math.random() * 16 | 0;
      return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
}

export function getGuestData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

export function initGuestData(examDate) {
  const data = {
    guestId: generateUUID(),
    createdAt: new Date().toISOString(),
    examDate,
    sessions: [],
    allAnswered: {},
    totalSessions: 0,
    maxSessions: 10,
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
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  return data;
}

export function clearGuestData() {
  localStorage.removeItem(STORAGE_KEY);
}
