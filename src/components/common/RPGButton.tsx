import React from 'react';
import { TouchableOpacity, ActivityIndicator, ViewStyle, StyleProp } from 'react-native';
import { PixelText } from './PixelText';
import { useThemeContext } from '../../contexts/ThemeContext';

interface RPGButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'gold';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}

export function RPGButton({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  style,
}: RPGButtonProps) {
  const { colors } = useThemeContext();

  const bgMap = {
    primary: colors.accent,
    secondary: colors.card,
    danger: colors.danger,
    gold: colors.gold,
  };

  const textColorMap = {
    primary: '#ffffff',
    secondary: colors.text,
    danger: '#ffffff',
    gold: '#1a1a2e',
  };

  const paddingMap = { sm: 8, md: 12, lg: 16 };
  const fontSizeMap = { sm: 'xs' as const, md: 'sm' as const, lg: 'md' as const };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
      style={[
        {
          backgroundColor: bgMap[variant],
          paddingVertical: paddingMap[size],
          paddingHorizontal: paddingMap[size] * 2,
          borderWidth: 2,
          borderColor: variant === 'secondary' ? colors.cardBorder : 'transparent',
          borderRadius: 4,
          alignItems: 'center',
          justifyContent: 'center',
          opacity: disabled ? 0.5 : 1,
          shadowColor: bgMap[variant],
          shadowOffset: { width: 2, height: 2 },
          shadowOpacity: 0.3,
          shadowRadius: 0,
          elevation: 3,
        },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={textColorMap[variant]} size="small" />
      ) : (
        <PixelText size={fontSizeMap[size]} color={textColorMap[variant]}>
          {title}
        </PixelText>
      )}
    </TouchableOpacity>
  );
}
