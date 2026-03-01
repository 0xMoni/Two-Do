import React from 'react';
import { View } from 'react-native';
import { OnboardingPage } from '../../components/onboarding/OnboardingPage';
import { RPGButton } from '../../components/common/RPGButton';

export function DuoExplainScreen({ navigation }: any) {
  return (
    <View style={{ flex: 1, backgroundColor: '#f5f0ff' }}>
      <OnboardingPage
        emoji="🤝"
        title="Duo System"
        subtitle="Better Together"
        description="Pair up with your partner using a unique code. See each other's quests in real-time, track progress together, and stay accountable!"
      />
      <View style={{ paddingHorizontal: 32, paddingBottom: 48 }}>
        <RPGButton title="Next" onPress={() => navigation.navigate('HeartsExplain')} variant="gold" size="lg" />
      </View>
    </View>
  );
}
