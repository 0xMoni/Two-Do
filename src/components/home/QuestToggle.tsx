import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { PixelText } from '../common/PixelText';
import { useThemeContext } from '../../contexts/ThemeContext';

interface QuestToggleProps {
  value: 'mine' | 'partner';
  onChange: (val: 'mine' | 'partner') => void;
  myName: string;
  partnerName: string;
}

export function QuestToggle({ value, onChange, myName, partnerName }: QuestToggleProps) {
  const { colors } = useThemeContext();

  const Tab = ({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) => (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={{
        flex: 1,
        backgroundColor: active ? colors.accent : 'transparent',
        paddingVertical: 10,
        alignItems: 'center',
        borderRadius: 2,
      }}
    >
      <PixelText size="xs" color={active ? '#fff' : colors.textSecondary}>
        {label}
      </PixelText>
    </TouchableOpacity>
  );

  return (
    <View
      style={{
        flexDirection: 'row',
        backgroundColor: colors.card,
        borderWidth: 2,
        borderColor: colors.cardBorder,
        borderRadius: 4,
        padding: 2,
      }}
    >
      <Tab label={`My Quests`} active={value === 'mine'} onPress={() => onChange('mine')} />
      <Tab label={`${partnerName}'s`} active={value === 'partner'} onPress={() => onChange('partner')} />
    </View>
  );
}
