import React from 'react';
import { View, Text, Dimensions } from 'react-native';
import { PixelText } from '../common/PixelText';

const { width } = Dimensions.get('window');

const LIGHT = {
  gold: '#d97706',
  accent: '#7c3aed',
  textSecondary: '#5b4a7a',
};

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
      <Text style={{ fontSize: 56, marginBottom: 24, textAlign: 'center' }}>
        {emoji}
      </Text>
      <PixelText size="lg" color={LIGHT.gold} style={{ textAlign: 'center', marginBottom: 12 }}>
        {title}
      </PixelText>
      <PixelText size="sm" color={LIGHT.accent} style={{ textAlign: 'center', marginBottom: 16 }}>
        {subtitle}
      </PixelText>
      <PixelText size="xs" color={LIGHT.textSecondary} style={{ textAlign: 'center', lineHeight: 18 }}>
        {description}
      </PixelText>
    </View>
  );
}
