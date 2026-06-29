import React from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { TreeToday } from '../components/TreeToday';
import { DailyReflection } from '../domain/types';
import { colors, radius, spacing } from '../theme/tokens';

interface Props { day: DailyReflection; onNavigate: (screen: 'movement' | 'journal' | 'history') => void; }

export function HomeScreen({ day, onNavigate }: Props) {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.eyebrow}>Onde há vínculo, há aprendizagem</Text>
      <Text style={styles.heading}>Diário de vínculo corpo-mente</Text>
      <TreeToday day={day} />
      <View style={styles.actions}>
        <Action title="Iniciar Movimento" subtitle="Caminhar elaborando uma questão interna" onPress={() => onNavigate('movement')} primary />
        <Action title="Humor, Aprendizado e Vínculo" subtitle="Registrar emoções, notas e relações significativas" onPress={() => onNavigate('journal')} />
        <Action title="Histórico acolhedor" subtitle="Ver crescimento semanal sem rankings" onPress={() => onNavigate('history')} />
      </View>
      <Text style={styles.note}>Sem calorias, sem perda de peso, sem competição. Apenas presença, elaboração e vínculo.</Text>
    </ScrollView>
  );
}

function Action({ title, subtitle, onPress, primary=false }: {title:string; subtitle:string; onPress:()=>void; primary?:boolean}) {
  return <Pressable onPress={onPress} style={[styles.action, primary && styles.primary]}><Text style={[styles.actionTitle, primary && styles.primaryText]}>{title}</Text><Text style={[styles.actionSubtitle, primary && styles.primaryText]}>{subtitle}</Text></Pressable>;
}

const styles = StyleSheet.create({container:{flex:1,backgroundColor:colors.background},content:{padding:spacing.lg,gap:spacing.lg},eyebrow:{color:colors.oldGold,fontWeight:'700',textTransform:'uppercase',letterSpacing:1},heading:{fontFamily:'serif',fontSize:34,lineHeight:40,color:colors.navy,fontWeight:'700'},actions:{gap:spacing.md},action:{backgroundColor:colors.surface,padding:spacing.lg,borderRadius:radius.lg,borderWidth:1,borderColor:colors.softGold},primary:{backgroundColor:colors.navy,borderColor:colors.navy},actionTitle:{fontSize:18,fontWeight:'700',color:colors.navy},actionSubtitle:{fontSize:14,color:colors.muted,marginTop:4,lineHeight:20},primaryText:{color:colors.background},note:{color:colors.muted,lineHeight:22,textAlign:'center'}});
