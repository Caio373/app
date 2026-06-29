export type TreeArea = 'movement' | 'mood' | 'learning' | 'bond';
export type TreeState = 'seed' | 'sprout' | 'branches' | 'golden_tree' | 'rest' | 'winter';

export interface MovementSession {
  id: string;
  startedAt: string;
  endedAt?: string;
  durationSeconds: number;
  distanceMeters: number;
  prePrompt: string;
  postInsight?: string;
  postEmotion?: string;
  postGratitude?: string;
  status: 'draft' | 'active' | 'completed';
}

export interface DailyReflection {
  reflectionDate: string;
  movementCompleted: boolean;
  moodCompleted: boolean;
  learningCompleted: boolean;
  bondCompleted: boolean;
  treeState: TreeState;
  moodNote?: string;
  bondNote?: string;
  learningNote?: string;
  movementSessions: MovementSession[];
  updatedAt: string;
  syncStatus: 'local' | 'pending' | 'synced';
}
