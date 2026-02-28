import React, { useState, useEffect, useCallback } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useAuthContext } from '../contexts/AuthContext';
import { useDuoContext } from '../contexts/DuoContext';
import { SplashScreen } from '../screens/SplashScreen';
import { AuthNavigator } from './AuthNavigator';
import { OnboardingNavigator } from './OnboardingNavigator';
import { MainTabNavigator } from './MainTabNavigator';
import { PairingScreen } from '../screens/PairingScreen';
import { RootStackParamList } from '../types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DeviceEventEmitter } from 'react-native';

const Stack = createStackNavigator<RootStackParamList>();

export function RootNavigator() {
  const { user, loading: authLoading } = useAuthContext();
  const { userProfile, duo, loading: duoLoading } = useDuoContext();
  const [onboardingComplete, setOnboardingComplete] = useState<boolean | null>(null);

  useEffect(() => {
    AsyncStorage.getItem('twodo_onboarding_complete').then((val) => {
      setOnboardingComplete(val === 'true');
    });
  }, []);

  // Listen for onboarding completion event
  useEffect(() => {
    const sub = DeviceEventEmitter.addListener('onboardingDone', () => {
      setOnboardingComplete(true);
    });
    return () => sub.remove();
  }, []);

  if (authLoading || onboardingComplete === null) {
    return <SplashScreen />;
  }

  if (user && duoLoading) {
    return <SplashScreen />;
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!onboardingComplete ? (
        <Stack.Screen name="Onboarding" component={OnboardingNavigator} />
      ) : !user ? (
        <Stack.Screen name="Auth" component={AuthNavigator} />
      ) : !duo ? (
        <Stack.Screen name="Pairing" component={PairingScreen} />
      ) : (
        <Stack.Screen name="Main" component={MainTabNavigator} />
      )}
    </Stack.Navigator>
  );
}
