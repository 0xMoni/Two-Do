import React from 'react';
import { View, Text } from 'react-native';
import { OnboardingPage } from '../../components/onboarding/OnboardingPage';
import { RPGButton } from '../../components/common/RPGButton';
import { PixelText } from '../../components/common/PixelText';

export function SwipeExplainScreen({ navigation }: any) {
  return (
    <View style={{ flex: 1, backgroundColor: '#f5f0ff' }}>
      <OnboardingPage
        emoji="👆"
        title="Swipe Actions"
        subtitle="Quick Controls"
        description=""
      />
      <View style={{ paddingHorizontal: 32, marginTop: -180, marginBottom: 24 }}>
        <View style={{ gap: 14 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <Text style={{ fontSize: 24 }}>👉</Text>
            <View style={{ flex: 1 }}>
              <PixelText size="xs" color="#d97706">Swipe Right</PixelText>
              <PixelText size="xs" color="#5b4a7a" style={{ marginTop: 2, fontSize: 7 }}>Complete a quest instantly</PixelText>
            </View>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <Text style={{ fontSize: 24 }}>👈</Text>
            <View style={{ flex: 1 }}>
              <PixelText size="xs" color="#d97706">Swipe Left</PixelText>
              <PixelText size="xs" color="#5b4a7a" style={{ marginTop: 2, fontSize: 7 }}>Edit or delete a quest</PixelText>
            </View>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <Text style={{ fontSize: 24 }}>↩️</Text>
            <View style={{ flex: 1 }}>
              <PixelText size="xs" color="#d97706">Undo</PixelText>
              <PixelText size="xs" color="#5b4a7a" style={{ marginTop: 2, fontSize: 7 }}>Swipe right on completed quests to undo</PixelText>
            </View>
          </View>
        </View>
      </View>
      <View style={{ paddingHorizontal: 32, paddingBottom: 48 }}>
        <RPGButton title="Next" onPress={() => navigation.navigate('DuoExplain')} variant="gold" size="lg" />
      </View>
    </View>
  );
}
