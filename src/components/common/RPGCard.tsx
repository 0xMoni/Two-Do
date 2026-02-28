import React from 'react';
import { View, ViewStyle, StyleProp } from 'react-native';
import { useThemeContext } from '../../contexts/ThemeContext';

interface RPGCardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  variant?: 'default' | 'accent' | 'gold';
}

export function RPGCard({ children, style, variant = 'default' }: RPGCardProps) {
  const { colors } = useThemeContext();

  const borderColorMap = {
    default: colors.cardBorder,
    accent: colors.accent,
    gold: colors.gold,
  };

  return (
    <View
      style={[
        {
          backgroundColor: colors.card,
          borderWidth: 2,
          borderColor: borderColorMap[variant],
          borderRadius: 4,
          padding: 16,
          shadowColor: borderColorMap[variant],
          shadowOffset: { width: 2, height: 2 },
          shadowOpacity: 0.2,
          shadowRadius: 0,
          elevation: 3,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}
