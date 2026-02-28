import React from 'react';
import { View, Dimensions } from 'react-native';
import { PixelText } from '../common/PixelText';
import { RPG_COLORS } from '../../lib/constants';

const { width } = Dimensions.get('window');

interface OnboardingPageProps {
  emoji: string;
  title: string;
  subtitle: string;
  description: string;
}

export function OnboardingPage({ emoji, title, subtitle, description }: OnboardingPageProps) {
  return (
    <View
      style={{
        width,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 32,
      }}
    >
      <PixelText size="xl" style={{ fontSize: 48, marginBottom: 24 }}>
        {emoji}
      </PixelText>
      <PixelText size="lg" color={RPG_COLORS.gold} style={{ textAlign: 'center', marginBottom: 12 }}>
        {title}
      </PixelText>
      <PixelText size="sm" color={RPG_COLORS.accent} style={{ textAlign: 'center', marginBottom: 16 }}>
        {subtitle}
      </PixelText>
      <PixelText size="xs" color={RPG_COLORS.textSecondary} style={{ textAlign: 'center', lineHeight: 18 }}>
        {description}
      </PixelText>
    </View>
  );
}
