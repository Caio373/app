import { DailyReflection, TreeArea, TreeState } from './types';

export function completedAreas(day: DailyReflection): TreeArea[] {
  return [
    day.movementCompleted ? 'movement' : undefined,
    day.moodCompleted ? 'mood' : undefined,
    day.learningCompleted ? 'learning' : undefined,
    day.bondCompleted ? 'bond' : undefined,
  ].filter(Boolean) as TreeArea[];
}

export function deriveTreeState(day: Pick<DailyReflection, 'movementCompleted' | 'moodCompleted' | 'learningCompleted' | 'bondCompleted'>): TreeState {
  const total = [day.movementCompleted, day.moodCompleted, day.learningCompleted, day.bondCompleted].filter(Boolean).length;
  if (total === 0) return 'rest';
  if (total === 1) return 'seed';
  if (total === 2) return 'sprout';
  if (total === 3) return 'branches';
  return 'golden_tree';
}

export const forbiddenMetrics = ['calorias', 'pace competitivo', 'perda de peso', 'ranking', 'streak punitivo'];
