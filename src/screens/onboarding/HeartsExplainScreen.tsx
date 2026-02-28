import React from 'react';
import { View, DeviceEventEmitter } from 'react-native';
import { OnboardingPage } from '../../components/onboarding/OnboardingPage';
import { RPGButton } from '../../components/common/RPGButton';
import { RPG_COLORS } from '../../lib/constants';
import AsyncStorage from '@react-native-async-storage/async-storage';

export function HeartsExplainScreen({ navigation }: any) {
  const handleDone = async () => {
    await AsyncStorage.setItem('twodo_onboarding_complete', 'true');
    DeviceEventEmitter.emit('onboardingDone');
  };

  return (
    <View style={{ flex: 1, backgroundColor: RPG_COLORS.background }}>
      <OnboardingPage
        emoji="❤️"
        title="Hearts"
        subtitle="Show Some Love"
        description="Tap the heart button to send love to your partner. The counter tracks your affection in real-time. It's the little things that matter!"
      />
      <View style={{ paddingHorizontal: 32, paddingBottom: 48 }}>
        <RPGButton title="Let's Go!" onPress={handleDone} variant="gold" size="lg" />
      </View>
    </View>
  );
}
