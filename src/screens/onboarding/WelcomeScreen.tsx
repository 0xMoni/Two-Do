import React from 'react';
import { View } from 'react-native';
import { OnboardingPage } from '../../components/onboarding/OnboardingPage';
import { RPGButton } from '../../components/common/RPGButton';
import { RPG_COLORS } from '../../lib/constants';

export function WelcomeScreen({ navigation }: any) {
  return (
    <View style={{ flex: 1, backgroundColor: RPG_COLORS.background }}>
      <OnboardingPage
        emoji="⚔️"
        title="Two-Do"
        subtitle="Your Duo Quest Log"
        description="Turn your daily tasks into epic quests. Team up with your partner and level up together!"
      />
      <View style={{ paddingHorizontal: 32, paddingBottom: 48 }}>
        <RPGButton title="Begin Adventure" onPress={() => navigation.navigate('QuestsExplain')} variant="gold" size="lg" />
      </View>
    </View>
  );
}
