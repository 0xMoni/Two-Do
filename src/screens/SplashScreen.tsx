import React from 'react';
import { View, ActivityIndicator, Image } from 'react-native';
import { PixelText } from '../components/common/PixelText';
import { RPG_COLORS } from '../lib/constants';

export function SplashScreen() {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: RPG_COLORS.background,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Image
        source={require('../../assets/logo-header.png')}
        style={{ width: 80, height: 80, marginBottom: 16 }}
        resizeMode="contain"
      />
      <PixelText size="xl" color={RPG_COLORS.gold}>
        Two-Do
      </PixelText>
      <PixelText size="xs" color={RPG_COLORS.textSecondary} style={{ marginTop: 12 }}>
        Loading quest data...
      </PixelText>
      <ActivityIndicator color={RPG_COLORS.gold} style={{ marginTop: 24 }} size="large" />
    </View>
  );
}
