import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, ScrollView } from 'react-native';
import { DailyReflection } from '../domain/types';
import { colors, radius, spacing } from '../theme/tokens';

interface Props { day: DailyReflection; onSave: (day: DailyReflection) => Promise<void>; onBack: () => void; }

export function JournalScreen({ day, onSave, onBack }: Props) {
  const [moodNote, setMoodNote] = useState(day.moodNote ?? '');
  const [learningNote, setLearningNote] = useState(day.learningNote ?? '');
  const [bondNote, setBondNote] = useState(day.bondNote ?? '');
  const save = async () => { await onSave({...day, moodNote, learningNote, bondNote, moodCompleted: moodNote.trim().length>0, learningCompleted: learningNote.trim().length>0, bondCompleted: bondNote.trim().length>0}); onBack(); };
  return <ScrollView style={styles.container} contentContainerStyle={styles.content}>
    <Text style={styles.heading}>Humor, Aprendizado e Vínculo</Text>
    <Field label="Como seu corpo e seu humor se apresentam hoje?" value={moodNote} onChangeText={setMoodNote} />
    <Field label="Que pequena aprendizagem, aula, leitura ou insight apareceu?" value={learningNote} onChangeText={setLearningNote} />
    <Field label="Qual vínculo significativo merece ser lembrado?" value={bondNote} onChangeText={setBondNote} />
    <Pressable style={styles.save} onPress={save}><Text style={styles.saveText}>Cuidar da árvore</Text></Pressable>
    <Pressable style={styles.back} onPress={onBack}><Text style={styles.backText}>Voltar</Text></Pressable>
  </ScrollView>;
}
function Field(props:{label:string; value:string; onChangeText:(text:string)=>void}){return <View style={styles.field}><Text style={styles.label}>{props.label}</Text><TextInput multiline value={props.value} onChangeText={props.onChangeText} placeholder="Escreva com gentileza, sem obrigação de performance." placeholderTextColor={colors.muted} style={styles.input}/></View>}
const styles=StyleSheet.create({container:{flex:1,backgroundColor:colors.background},content:{padding:spacing.lg,gap:spacing.lg},heading:{fontFamily:'serif',fontSize:30,color:colors.navy,fontWeight:'700'},field:{gap:spacing.sm},label:{fontSize:16,fontWeight:'700',color:colors.navy},input:{backgroundColor:colors.surface,borderRadius:radius.lg,padding:spacing.md,minHeight:110,textAlignVertical:'top',borderColor:colors.softGold,borderWidth:1,color:colors.ink,fontSize:16},save:{backgroundColor:colors.navy,borderRadius:radius.pill,padding:spacing.md,alignItems:'center'},saveText:{color:colors.background,fontWeight:'700',fontSize:16},back:{alignItems:'center',padding:spacing.sm},backText:{color:colors.navy,fontWeight:'700'}});
