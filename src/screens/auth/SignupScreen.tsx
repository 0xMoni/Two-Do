import React, { useState } from 'react';
import { View } from 'react-native';
import { useAuthContext } from '../../contexts/AuthContext';
import { useThemeContext } from '../../contexts/ThemeContext';
import { AuthForm } from '../../components/auth/AuthForm';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { AuthStackParamList } from '../../types';

type Props = {
  navigation: StackNavigationProp<AuthStackParamList, 'Signup'>;
};

export function SignupScreen({ navigation }: Props) {
  const { signUp } = useAuthContext();
  const { colors } = useThemeContext();
  const [error, setError] = useState<string | null>(null);

  const handleSignup = async (email: string, password: string, displayName?: string) => {
    setError(null);
    try {
      await signUp(email, password, displayName ?? '');
    } catch (e: any) {
      if (e.message?.includes('email-already-in-use')) {
        setError('Email already in use');
      } else if (e.message?.includes('weak-password')) {
        setError('Password must be at least 6 characters');
      } else {
        setError('Sign up failed. Try again.');
      }
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <AuthForm
        mode="signup"
        onSubmit={handleSignup}
        onToggleMode={() => navigation.navigate('Login')}
        error={error}
      />
    </View>
  );
}
