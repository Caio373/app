import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle, Line, Path } from 'react-native-svg';
import { completedAreas } from '../domain/tree';
import { DailyReflection } from '../domain/types';
import { colors, spacing } from '../theme/tokens';

interface Props { day: DailyReflection; }

export function TreeToday({ day }: Props) {
  const areas = completedAreas(day);
  const has = (area: 'movement' | 'mood' | 'learning' | 'bond') => areas.includes(area);
  return (
    <View style={styles.card} accessibilityLabel={`Sua árvore hoje tem ${areas.length} de 4 áreas cuidadas`}>
      <Text style={styles.title}>Sua Árvore Hoje</Text>
      <Svg width="220" height="220" viewBox="0 0 220 220">
        <Circle cx="110" cy="110" r="96" fill={colors.background} />
        <Line x1="110" y1="172" x2="110" y2="92" stroke={has('movement') ? colors.gold : colors.winter} strokeWidth="16" strokeLinecap="round" />
        <Path d="M110 132 C76 126 54 109 43 83" stroke={has('bond') ? colors.gold : colors.winter} strokeWidth="10" fill="none" strokeLinecap="round" />
        <Path d="M110 116 C145 105 163 82 174 55" stroke={has('learning') ? colors.gold : colors.winter} strokeWidth="10" fill="none" strokeLinecap="round" />
        <Path d="M110 98 C91 74 91 48 104 29" stroke={has('mood') ? colors.gold : colors.winter} strokeWidth="10" fill="none" strokeLinecap="round" />
        {areas.length === 4 && <Circle cx="110" cy="88" r="52" fill={colors.softGold} opacity="0.55" />}
        <Circle cx="43" cy="83" r="14" fill={has('bond') ? colors.leaf : colors.winter} />
        <Circle cx="174" cy="55" r="14" fill={has('learning') ? colors.leaf : colors.winter} />
        <Circle cx="104" cy="29" r="14" fill={has('mood') ? colors.leaf : colors.winter} />
        <Circle cx="110" cy="172" r="16" fill={has('movement') ? colors.oldGold : colors.winter} />
      </Svg>
      <Text style={styles.caption}>{areas.length === 0 ? 'Hoje sua árvore está em repouso. Sem cobrança, sem punição.' : `${areas.length} de 4 áreas receberam cuidado.`}</Text>
    </View>
  );
}
const styles = StyleSheet.create({card:{backgroundColor:colors.surface,borderRadius:28,padding:spacing.lg,alignItems:'center',shadowColor:'#000',shadowOpacity:0.08,shadowRadius:12,elevation:2},title:{fontSize:25,color:colors.navy,fontWeight:'700',fontFamily:'serif'},caption:{color:colors.muted,textAlign:'center',fontSize:15,lineHeight:22}});
