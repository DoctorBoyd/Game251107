
import type { ScoreEntry } from '../types';

const TOP_SCORES_KEY = 'asteroidsTopScores';

export const getTopScores = (): ScoreEntry[] => {
  try {
    const scoresJson = localStorage.getItem(TOP_SCORES_KEY);
    if (!scoresJson) {
      return [];
    }
    return JSON.parse(scoresJson);
  } catch (error) {
    console.error("Failed to retrieve top scores:", error);
    return [];
  }
};

export const saveTopScores = (scores: ScoreEntry[]): void => {
  try {
    const scoresJson = JSON.stringify(scores);
    localStorage.setItem(TOP_SCORES_KEY, scoresJson);
  } catch (error) {
    console.error("Failed to save top scores:", error);
  }
};
