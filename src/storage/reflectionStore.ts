import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { DailyReflection } from '../domain/types';
import { deriveTreeState } from '../domain/tree';

const REFLECTIONS_KEY = 'ppm.reflections.v1';
const DEVICE_KEY = 'ppm.deviceKey.created';

export async function ensureLocalSecret(): Promise<void> {
  const existing = await SecureStore.getItemAsync(DEVICE_KEY);
  if (!existing) {
    await SecureStore.setItemAsync(DEVICE_KEY, String(Date.now()));
  }
}

export function todayKey(date = new Date()): string {
  return date.toISOString().slice(0, 10);
}

export function createEmptyReflection(reflectionDate = todayKey()): DailyReflection {
  return {
    reflectionDate,
    movementCompleted: false,
    moodCompleted: false,
    learningCompleted: false,
    bondCompleted: false,
    treeState: 'rest',
    movementSessions: [],
    updatedAt: new Date().toISOString(),
    syncStatus: 'local',
  };
}

export async function loadReflections(): Promise<DailyReflection[]> {
  await ensureLocalSecret();
  const raw = await AsyncStorage.getItem(REFLECTIONS_KEY);
  return raw ? (JSON.parse(raw) as DailyReflection[]) : [];
}

export async function saveReflections(reflections: DailyReflection[]): Promise<void> {
  await AsyncStorage.setItem(REFLECTIONS_KEY, JSON.stringify(reflections));
}

export async function loadToday(): Promise<DailyReflection> {
  const reflections = await loadReflections();
  return reflections.find((item) => item.reflectionDate === todayKey()) ?? createEmptyReflection();
}

export async function upsertReflection(day: DailyReflection): Promise<DailyReflection> {
  const nextDay = {
    ...day,
    treeState: deriveTreeState(day),
    updatedAt: new Date().toISOString(),
    syncStatus: 'pending' as const,
  };
  const reflections = await loadReflections();
  const withoutDay = reflections.filter((item) => item.reflectionDate !== nextDay.reflectionDate);
  await saveReflections([nextDay, ...withoutDay].sort((a, b) => b.reflectionDate.localeCompare(a.reflectionDate)));
  return nextDay;
}
