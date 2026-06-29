import React, { useCallback, useEffect, useState } from 'react';
import { SafeAreaView, StatusBar, StyleSheet, Text } from 'react-native';
import { HomeScreen } from './src/screens/HomeScreen';
import { MovementScreen } from './src/screens/MovementScreen';
import { JournalScreen } from './src/screens/JournalScreen';
import { HistoryScreen } from './src/screens/HistoryScreen';
import { DailyReflection } from './src/domain/types';
import { createEmptyReflection, loadReflections, loadToday, upsertReflection } from './src/storage/reflectionStore';
import { colors } from './src/theme/tokens';

type Screen = 'home' | 'movement' | 'journal' | 'history';

export default function App() {
  const [screen, setScreen] = useState<Screen>('home');
  const [day, setDay] = useState<DailyReflection>(createEmptyReflection());
  const [reflections, setReflections] = useState<DailyReflection[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setDay(await loadToday());
    setReflections(await loadReflections());
    setLoading(false);
  }, []);

  useEffect(() => { void refresh(); }, [refresh]);

  const saveDay = async (nextDay: DailyReflection) => {
    const saved = await upsertReflection(nextDay);
    setDay(saved);
    setReflections(await loadReflections());
  };

  if (loading) return <SafeAreaView style={styles.safe}><Text style={styles.loading}>Cultivando seu espaço...</Text></SafeAreaView>;

  return <SafeAreaView style={styles.safe}>
    <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
    {screen === 'home' && <HomeScreen day={day} onNavigate={setScreen} />}
    {screen === 'movement' && <MovementScreen day={day} onSave={saveDay} onBack={() => setScreen('home')} />}
    {screen === 'journal' && <JournalScreen day={day} onSave={saveDay} onBack={() => setScreen('home')} />}
    {screen === 'history' && <HistoryScreen reflections={reflections} onBack={() => setScreen('home')} />}
  </SafeAreaView>;
}

const styles = StyleSheet.create({ safe: { flex: 1, backgroundColor: colors.background }, loading: { color: colors.navy, margin: 24, fontSize: 18 } });
