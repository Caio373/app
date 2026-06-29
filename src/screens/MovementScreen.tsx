import React, { useEffect, useMemo, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import * as Location from 'expo-location';
import { DailyReflection, MovementSession } from '../domain/types';
import { colors, radius, spacing } from '../theme/tokens';

interface Props { day: DailyReflection; onSave: (day: DailyReflection) => Promise<void>; onBack: () => void; }

type Step = 'pre' | 'active' | 'post';

export function MovementScreen({ day, onSave, onBack }: Props) {
  const [step, setStep] = useState<Step>('pre');
  const [prePrompt, setPrePrompt] = useState('');
  const [startedAt, setStartedAt] = useState<Date | null>(null);
  const [seconds, setSeconds] = useState(0);
  const [distanceMeters, setDistanceMeters] = useState(0);
  const [insight, setInsight] = useState('');
  const [emotion, setEmotion] = useState('');
  const [gratitude, setGratitude] = useState('');

  useEffect(() => {
    if (step !== 'active') return;
    const timer = setInterval(() => setSeconds((value) => value + 1), 1000);
    return () => clearInterval(timer);
  }, [step]);

  const duration = useMemo(() => `${Math.floor(seconds / 60)}min ${seconds % 60}s`, [seconds]);

  async function startMovement() {
    if (!prePrompt.trim()) { Alert.alert('Elaboração necessária', 'Antes de caminhar, registre o que você quer elaborar mentalmente.'); return; }
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') { Alert.alert('Permissão de localização', 'Você pode registrar a elaboração, mas o GPS precisa de permissão para medir o percurso básico.'); return; }
    setStartedAt(new Date());
    setStep('active');
  }

  function finishActiveMovement() {
    setDistanceMeters((value) => value || Math.round(seconds * 1.25));
    setStep('post');
  }

  async function completeMovement() {
    if (![insight, emotion, gratitude].every((item) => item.trim())) {
      Alert.alert('Fechamento cuidadoso', 'Registre 1 insight, 1 emoção e 1 gratidão para concluir a caminhada.');
      return;
    }
    const session: MovementSession = {
      id: `${Date.now()}`,
      startedAt: (startedAt ?? new Date()).toISOString(),
      endedAt: new Date().toISOString(),
      durationSeconds: seconds,
      distanceMeters,
      prePrompt,
      postInsight: insight,
      postEmotion: emotion,
      postGratitude: gratitude,
      status: 'completed',
    };
    await onSave({ ...day, movementCompleted: true, movementSessions: [session, ...day.movementSessions] });
    onBack();
  }

  return <ScrollView style={styles.container} contentContainerStyle={styles.content}>
    <Text style={styles.heading}>Movimento com elaboração</Text>
    {step === 'pre' && <View style={styles.card}>
      <Text style={styles.label}>O que você quer elaborar mentalmente nessa caminhada?</Text>
      <TextInput multiline value={prePrompt} onChangeText={setPrePrompt} style={styles.input} placeholder="Ex.: uma conversa difícil, uma pergunta pedagógica, uma emoção que precisa de espaço..." placeholderTextColor={colors.muted}/>
      <Pressable style={styles.primary} onPress={startMovement}><Text style={styles.primaryText}>Iniciar Movimento</Text></Pressable>
    </View>}
    {step === 'active' && <View style={styles.card}>
      <Text style={styles.timer}>{duration}</Text>
      <Text style={styles.metric}>{(distanceMeters / 1000).toFixed(2)} km estimados</Text>
      <Text style={styles.helper}>Caminhe sem competir. O percurso é apenas suporte para a elaboração.</Text>
      <Pressable style={styles.primary} onPress={finishActiveMovement}><Text style={styles.primaryText}>Finalizar e registrar</Text></Pressable>
    </View>}
    {step === 'post' && <View style={styles.card}>
      <Field label="1 insight" value={insight} onChangeText={setInsight}/>
      <Field label="1 emoção" value={emotion} onChangeText={setEmotion}/>
      <Field label="1 gratidão" value={gratitude} onChangeText={setGratitude}/>
      <Pressable style={styles.primary} onPress={completeMovement}><Text style={styles.primaryText}>Concluir caminhada</Text></Pressable>
    </View>}
    <Pressable style={styles.back} onPress={onBack}><Text style={styles.backText}>Voltar</Text></Pressable>
  </ScrollView>;
}
function Field(props:{label:string; value:string; onChangeText:(text:string)=>void}){return <View style={styles.field}><Text style={styles.label}>{props.label}</Text><TextInput multiline value={props.value} onChangeText={props.onChangeText} style={styles.smallInput}/></View>}
const styles=StyleSheet.create({container:{flex:1,backgroundColor:colors.background},content:{padding:spacing.lg,gap:spacing.lg},heading:{fontFamily:'serif',fontSize:30,color:colors.navy,fontWeight:'700'},card:{backgroundColor:colors.surface,borderRadius:radius.lg,padding:spacing.lg,gap:spacing.md,borderWidth:1,borderColor:colors.softGold},label:{fontSize:16,fontWeight:'700',color:colors.navy},input:{minHeight:150,textAlignVertical:'top',borderWidth:1,borderColor:colors.softGold,borderRadius:radius.md,padding:spacing.md,fontSize:16,color:colors.ink},smallInput:{minHeight:72,textAlignVertical:'top',borderWidth:1,borderColor:colors.softGold,borderRadius:radius.md,padding:spacing.md,fontSize:16,color:colors.ink},primary:{backgroundColor:colors.navy,borderRadius:radius.pill,padding:spacing.md,alignItems:'center'},primaryText:{color:colors.background,fontSize:16,fontWeight:'700'},timer:{fontSize:42,fontWeight:'700',color:colors.navy,textAlign:'center'},metric:{fontSize:20,color:colors.oldGold,textAlign:'center',fontWeight:'700'},helper:{color:colors.muted,textAlign:'center',lineHeight:22},field:{gap:spacing.sm},back:{alignItems:'center',padding:spacing.sm},backText:{color:colors.navy,fontWeight:'700'}});
