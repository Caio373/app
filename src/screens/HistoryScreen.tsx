import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { DailyReflection } from '../domain/types';
import { colors, radius, spacing } from '../theme/tokens';

interface Props { reflections: DailyReflection[]; onBack: () => void; }
export function HistoryScreen({ reflections, onBack }: Props) {
  return <ScrollView style={styles.container} contentContainerStyle={styles.content}>
    <Text style={styles.heading}>Histórico acolhedor</Text>
    <Text style={styles.note}>Acompanhe padrões sem cobrança. Dias sem uso são repouso, não fracasso.</Text>
    {reflections.slice(0, 7).map((day) => {
      const total = [day.movementCompleted, day.moodCompleted, day.learningCompleted, day.bondCompleted].filter(Boolean).length;
      return <View key={day.reflectionDate} style={styles.row}><Text style={styles.date}>{day.reflectionDate}</Text><Text style={styles.state}>{total}/4 áreas • {day.treeState}</Text></View>;
    })}
    {reflections.length === 0 && <View style={styles.row}><Text style={styles.state}>Sua primeira semana de cuidado começará com o próximo registro.</Text></View>}
    <Pressable style={styles.back} onPress={onBack}><Text style={styles.backText}>Voltar</Text></Pressable>
  </ScrollView>;
}
const styles=StyleSheet.create({container:{flex:1,backgroundColor:colors.background},content:{padding:spacing.lg,gap:spacing.md},heading:{fontFamily:'serif',fontSize:30,color:colors.navy,fontWeight:'700'},note:{color:colors.muted,lineHeight:22},row:{backgroundColor:colors.surface,borderRadius:radius.lg,padding:spacing.lg,borderWidth:1,borderColor:colors.softGold},date:{color:colors.navy,fontWeight:'700',fontSize:16},state:{color:colors.muted,marginTop:4},back:{alignItems:'center',padding:spacing.sm},backText:{color:colors.navy,fontWeight:'700'}});
