import React from 'react';
import { View, ActivityIndicator, Image, SafeAreaView, Text } from 'react-native';

// Light theme colors used directly since SplashScreen renders before ThemeProvider
const SPLASH_COLORS = {
  background: '#f5f0ff',
  gold: '#d97706',
  textSecondary: '#5b4a7a',
};

export function SplashScreen() {
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: SPLASH_COLORS.background,
      }}
    >
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          paddingHorizontal: 24,
        }}
      >
        <Image
          source={require('../../assets/logo-header.png')}
          style={{ width: 80, height: 80, marginBottom: 16 }}
          resizeMode="contain"
        />
        <Text style={{ fontSize: 28, fontWeight: '900', color: SPLASH_COLORS.gold, letterSpacing: 2 }}>
          Two-Do
        </Text>
        <Text style={{ fontSize: 12, color: SPLASH_COLORS.textSecondary, marginTop: 12 }}>
          Loading quest data...
        </Text>
        <ActivityIndicator color={SPLASH_COLORS.gold} style={{ marginTop: 24 }} size="large" />
      </View>
    </SafeAreaView>
  );
}
