import React from 'react';
import { View } from 'react-native';
import { PixelText } from '../common/PixelText';
import { useThemeContext } from '../../contexts/ThemeContext';

interface StatRowProps {
  label: string;
  value: string | number;
  icon?: string;
}

export function StatRow({ label, value, icon }: StatRowProps) {
  const { colors } = useThemeContext();

  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: colors.cardBorder,
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        {icon && <PixelText size="sm">{icon}</PixelText>}
        <PixelText size="xs" color={colors.textSecondary}>
          {label}
        </PixelText>
      </View>
      <PixelText size="xs" color={colors.gold}>
        {String(value)}
      </PixelText>
    </View>
  );
}
