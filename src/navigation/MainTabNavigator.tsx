import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { HomeScreen } from '../screens/home/HomeScreen';
import { AddQuestScreen } from '../screens/home/AddQuestScreen';
import { EditQuestScreen } from '../screens/home/EditQuestScreen';
import { ProfileScreen } from '../screens/profile/ProfileScreen';
import { PixelText } from '../components/common/PixelText';
import { useThemeContext } from '../contexts/ThemeContext';
import { MainTabParamList, HomeStackParamList } from '../types';

const Tab = createBottomTabNavigator<MainTabParamList>();
const HomeStack = createStackNavigator<HomeStackParamList>();

function HomeStackNavigator() {
  return (
    <HomeStack.Navigator screenOptions={{ headerShown: false }}>
      <HomeStack.Screen name="Home" component={HomeScreen} />
      <HomeStack.Screen
        name="AddQuest"
        component={AddQuestScreen}
        options={{ presentation: 'modal' }}
      />
      <HomeStack.Screen
        name="EditQuest"
        component={EditQuestScreen}
        options={{ presentation: 'modal' }}
      />
    </HomeStack.Navigator>
  );
}

export function MainTabNavigator() {
  const { colors } = useThemeContext();
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.card,
          borderTopColor: colors.cardBorder,
          borderTopWidth: 2,
          height: 60 + insets.bottom,
          paddingBottom: insets.bottom + 4,
          paddingTop: 8,
        },
        tabBarActiveTintColor: colors.gold,
        tabBarInactiveTintColor: colors.textMuted,
      }}
    >
      <Tab.Screen
        name="QuestLog"
        component={HomeStackNavigator}
        options={{
          tabBarIcon: ({ focused }) => (
            <PixelText size="lg" color={focused ? colors.gold : colors.textMuted}>
              📜
            </PixelText>
          ),
          tabBarLabel: ({ focused }) => (
            <PixelText size="xs" color={focused ? colors.gold : colors.textMuted} style={{ fontSize: 9 }}>
              Quests
            </PixelText>
          ),
        }}
      />
      <Tab.Screen
        name="Character"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <PixelText size="lg" color={focused ? colors.gold : colors.textMuted}>
              🧙
            </PixelText>
          ),
          tabBarLabel: ({ focused }) => (
            <PixelText size="xs" color={focused ? colors.gold : colors.textMuted} style={{ fontSize: 9 }}>
              Character
            </PixelText>
          ),
        }}
      />
    </Tab.Navigator>
  );
}
