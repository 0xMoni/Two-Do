import React from 'react';
import { View, TouchableOpacity, ScrollView } from 'react-native';
import { PixelText } from '../common/PixelText';
import { useThemeContext } from '../../contexts/ThemeContext';
import { AVATAR_IDS, AVATAR_EMOJIS } from '../../lib/constants';

interface AvatarPickerProps {
  selectedId: string;
  onSelect: (id: string) => void;
}

export function AvatarPicker({ selectedId, onSelect }: AvatarPickerProps) {
  const { colors } = useThemeContext();

  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12, justifyContent: 'center' }}>
      {AVATAR_IDS.map((id) => (
        <TouchableOpacity
          key={id}
          onPress={() => onSelect(id)}
          activeOpacity={0.7}
          style={{
            width: 64,
            height: 64,
            borderRadius: 4,
            borderWidth: 2,
            borderColor: selectedId === id ? colors.gold : colors.cardBorder,
            backgroundColor: selectedId === id ? colors.gold + '20' : colors.card,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <PixelText size="lg">{AVATAR_EMOJIS[id]}</PixelText>
          <PixelText size="xs" color={selectedId === id ? colors.gold : colors.textMuted} style={{ fontSize: 6, marginTop: 2 }}>
            {id}
          </PixelText>
        </TouchableOpacity>
      ))}
    </View>
  );
}
