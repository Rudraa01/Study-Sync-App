export interface StudySession {
  startTime: Date;
  endTime: Date;
  cardsReviewed: number;
  correctAnswers: number;
  totalTime: number; // in milliseconds
}

export interface StudyStreak {
  current: number;
  longest: number;
  lastStudyDate: Date | null;
}

export function calculateStudyStats(sessions: StudySession[]) {
  if (sessions.length === 0) {
    return {
      totalTimeStudied: 0,
      averageSessionLength: 0,
      totalCardsReviewed: 0,
      averageAccuracy: 0,
      cardsPerMinute: 0,
    };
  }

  const totalTimeStudied = sessions.reduce((acc, session) => acc + session.totalTime, 0);
  const totalCardsReviewed = sessions.reduce((acc, session) => acc + session.cardsReviewed, 0);
  const totalCorrectAnswers = sessions.reduce((acc, session) => acc + session.correctAnswers, 0);

  return {
    totalTimeStudied,
    averageSessionLength: totalTimeStudied / sessions.length,
    totalCardsReviewed,
    averageAccuracy: (totalCorrectAnswers / totalCardsReviewed) * 100,
    cardsPerMinute: (totalCardsReviewed / (totalTimeStudied / 1000 / 60)),
  };
}

export function updateStudyStreak(currentStreak: StudyStreak): StudyStreak {
  const now = new Date();
  const lastStudyDate = currentStreak.lastStudyDate ? new Date(currentStreak.lastStudyDate) : null;

  if (!lastStudyDate) {
    return {
      current: 1,
      longest: 1,
      lastStudyDate: now,
    };
  }

  // Reset streak if more than a day has passed
  const daysSinceLastStudy = Math.floor(
    (now.getTime() - lastStudyDate.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (daysSinceLastStudy > 1) {
    return {
      current: 1,
      longest: currentStreak.longest,
      lastStudyDate: now,
    };
  }

  // Don't increment streak if already studied today
  if (daysSinceLastStudy === 0) {
    return currentStreak;
  }

  // Increment streak
  const newCurrent = currentStreak.current + 1;
  return {
    current: newCurrent,
    longest: Math.max(newCurrent, currentStreak.longest),
    lastStudyDate: now,
  };
}

export function calculateRetentionRate(
  reviews: { quality: number; timestamp: Date }[]
): number {
  if (reviews.length === 0) return 0;

  const successfulReviews = reviews.filter(review => review.quality >= 3).length;
  return (successfulReviews / reviews.length) * 100;
}

export function getDueCards(cards: Array<{ nextReview: Date | null }>) {
  const now = new Date();
  return cards.filter(card => !card.nextReview || card.nextReview <= now);
}
