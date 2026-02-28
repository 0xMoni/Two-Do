import React from 'react';
import { View } from 'react-native';
import { OnboardingPage } from '../../components/onboarding/OnboardingPage';
import { RPGButton } from '../../components/common/RPGButton';
import { RPG_COLORS } from '../../lib/constants';

export function QuestsExplainScreen({ navigation }: any) {
  return (
    <View style={{ flex: 1, backgroundColor: RPG_COLORS.background }}>
      <OnboardingPage
        emoji="📜"
        title="Quests"
        subtitle="Tasks = Quests"
        description="Create quests for yourself or your partner. Each quest has a difficulty that determines how much XP you earn. Complete them to level up!"
      />
      <View style={{ paddingHorizontal: 32, paddingBottom: 48 }}>
        <RPGButton title="Next" onPress={() => navigation.navigate('DuoExplain')} variant="gold" size="lg" />
      </View>
    </View>
  );
}
