import React from 'react';
import { View, DeviceEventEmitter } from 'react-native';
import { OnboardingPage } from '../../components/onboarding/OnboardingPage';
import { RPGButton } from '../../components/common/RPGButton';
import AsyncStorage from '@react-native-async-storage/async-storage';

export function HeartsExplainScreen({ navigation }: any) {
  const handleDone = async () => {
    await AsyncStorage.setItem('twodo_onboarding_complete', 'true');
    DeviceEventEmitter.emit('onboardingDone');
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#f5f0ff' }}>
      <OnboardingPage
        emoji="❤️🍫✉️"
        title="Affection"
        subtitle="Send Some Love"
        description="Tap to send hearts, chocolates, or letters to your duo partner. The counter tracks it all in real-time. It's the little things that count!"
      />
      <View style={{ paddingHorizontal: 32, paddingBottom: 48 }}>
        <RPGButton title="Let's Go!" onPress={handleDone} variant="gold" size="lg" />
      </View>
    </View>
  );
}
