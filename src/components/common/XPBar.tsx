import React, { useEffect, useRef } from 'react';
import { View, Animated } from 'react-native';
import { PixelText } from './PixelText';
import { useThemeContext } from '../../contexts/ThemeContext';
import { getXpForCurrentLevel } from '../../lib/xpSystem';

interface XPBarProps {
  xp: number;
  showLabel?: boolean;
  height?: number;
}

export function XPBar({ xp, showLabel = true, height = 12 }: XPBarProps) {
  const { colors } = useThemeContext();
  const { current, needed, level } = getXpForCurrentLevel(xp);
  const progress = Math.min(current / needed, 1);
  const animatedWidth = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animatedWidth, {
      toValue: progress,
      duration: 600,
      useNativeDriver: false,
    }).start();
  }, [progress]);

  return (
    <View>
      {showLabel && (
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
          <PixelText size="xs" color={colors.gold}>
            LV {level}
          </PixelText>
          <PixelText size="xs" color={colors.textSecondary}>
            {current}/{needed} XP
          </PixelText>
        </View>
      )}
      <View
        style={{
          height,
          backgroundColor: colors.inputBg,
          borderRadius: 2,
          borderWidth: 1,
          borderColor: colors.cardBorder,
          overflow: 'hidden',
        }}
      >
        <Animated.View
          style={{
            height: '100%',
            backgroundColor: colors.gold,
            borderRadius: 1,
            width: animatedWidth.interpolate({
              inputRange: [0, 1],
              outputRange: ['0%', '100%'],
            }),
          }}
        />
      </View>
    </View>
  );
}
