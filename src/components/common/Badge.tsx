import React from 'react';
import { View } from 'react-native';
import { PixelText } from './PixelText';
import { useThemeContext } from '../../contexts/ThemeContext';

interface BadgeProps {
  label: string;
  color?: string;
  bgColor?: string;
}

export function Badge({ label, color, bgColor }: BadgeProps) {
  const { colors } = useThemeContext();

  return (
    <View
      style={{
        backgroundColor: bgColor ?? colors.accent + '30',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 2,
        borderWidth: 1,
        borderColor: color ?? colors.accent,
      }}
    >
      <PixelText size="xs" color={color ?? colors.accent}>
        {label}
      </PixelText>
    </View>
  );
}
