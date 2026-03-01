import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { WelcomeScreen } from '../screens/onboarding/WelcomeScreen';
import { QuestsExplainScreen } from '../screens/onboarding/QuestsExplainScreen';
import { SwipeExplainScreen } from '../screens/onboarding/SwipeExplainScreen';
import { DuoExplainScreen } from '../screens/onboarding/DuoExplainScreen';
import { HeartsExplainScreen } from '../screens/onboarding/HeartsExplainScreen';
import { OnboardingStackParamList } from '../types';

const Stack = createStackNavigator<OnboardingStackParamList>();

export function OnboardingNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="QuestsExplain" component={QuestsExplainScreen} />
      <Stack.Screen name="SwipeExplain" component={SwipeExplainScreen} />
      <Stack.Screen name="DuoExplain" component={DuoExplainScreen} />
      <Stack.Screen name="HeartsExplain" component={HeartsExplainScreen} />
    </Stack.Navigator>
  );
}
