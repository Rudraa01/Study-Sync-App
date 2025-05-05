// SuperMemo-2 Algorithm Implementation
// https://www.supermemo.com/en/archives1990-2015/english/ol/sm2

interface ReviewResult {
  nextReview: Date;
  interval: number;
  easeFactor: number;
}

export function calculateNextReview(
  quality: 1 | 2 | 3 | 4,
  previousInterval: number = 1,
  previousEaseFactor: number = 2.5
): ReviewResult {
  // Quality is on a scale of 1-4:
  // 1 - Again (complete blackout)
  // 2 - Hard (incorrect response but upon seeing the answer it felt familiar)
  // 3 - Good (correct response with difficulty)
  // 4 - Easy (correct response with perfect recall)

  let interval: number;
  let easeFactor = previousEaseFactor;

  // Update ease factor
  easeFactor = Math.max(
    1.3,
    previousEaseFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))
  );

  // Calculate interval
  if (quality === 1) {
    interval = 1; // Reset interval on complete failure
  } else if (previousInterval === 1) {
    interval = 1;
  } else if (previousInterval === 2) {
    interval = 6;
  } else {
    interval = Math.round(previousInterval * easeFactor);
  }

  // Calculate next review date
  const now = new Date();
  const nextReview = new Date(now.getTime() + interval * 24 * 60 * 60 * 1000);

  return {
    nextReview,
    interval,
    easeFactor,
  };
}
