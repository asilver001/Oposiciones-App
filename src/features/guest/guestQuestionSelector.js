function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function selectQuestionsForSession(sessionNumber, guestData, allQuestions) {
  const QUESTIONS_PER_SESSION = 10;

  if (sessionNumber === 1 || !guestData) {
    return shuffle(allQuestions).slice(0, QUESTIONS_PER_SESSION);
  }

  const failedIds = Object.entries(guestData.allAnswered)
    .filter(([, data]) => !data.correct)
    .map(([id]) => id);

  const answeredIds = Object.keys(guestData.allAnswered);
  const newQuestions = allQuestions.filter(q => !answeredIds.includes(q.id));

  const reviewQuestions = allQuestions
    .filter(q => failedIds.includes(q.id))
    .map(q => ({ ...q, isReview: true }));

  const reviewCount = Math.min(reviewQuestions.length, Math.min(sessionNumber + 1, 7));
  const newCount = QUESTIONS_PER_SESSION - reviewCount;

  const selected = [
    ...shuffle(reviewQuestions).slice(0, reviewCount),
    ...shuffle(newQuestions).slice(0, newCount),
  ];

  if (selected.length < QUESTIONS_PER_SESSION) {
    const selectedIds = new Set(selected.map(q => q.id));
    const remaining = allQuestions.filter(q => !selectedIds.has(q.id));
    selected.push(...shuffle(remaining).slice(0, QUESTIONS_PER_SESSION - selected.length));
  }

  return shuffle(selected).slice(0, QUESTIONS_PER_SESSION);
}
