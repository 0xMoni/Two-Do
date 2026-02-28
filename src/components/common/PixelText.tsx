import React from 'react';
import { Text, TextStyle, StyleProp } from 'react-native';
import { useThemeContext } from '../../contexts/ThemeContext';

interface PixelTextProps {
  children: React.ReactNode;
  style?: StyleProp<TextStyle>;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  color?: string;
}

const SIZES = { xs: 9, sm: 11, md: 13, lg: 16, xl: 22 };

export function PixelText({ children, style, size = 'md', color }: PixelTextProps) {
  const { colors } = useThemeContext();

  return (
    <Text
      style={[
        {
          fontFamily: 'PressStart2P_400Regular',
          fontSize: SIZES[size],
          color: color ?? colors.text,
          lineHeight: SIZES[size] * 1.6,
        },
        style,
      ]}
    >
      {children}
    </Text>
  );
}
