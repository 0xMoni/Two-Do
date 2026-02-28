import React, { useState } from 'react';
import { View } from 'react-native';
import { useAuthContext } from '../../contexts/AuthContext';
import { useThemeContext } from '../../contexts/ThemeContext';
import { AuthForm } from '../../components/auth/AuthForm';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { AuthStackParamList } from '../../types';

type Props = {
  navigation: StackNavigationProp<AuthStackParamList, 'Login'>;
};

export function LoginScreen({ navigation }: Props) {
  const { login } = useAuthContext();
  const { colors } = useThemeContext();
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (email: string, password: string) => {
    setError(null);
    try {
      await login(email, password);
    } catch (e: any) {
      setError(e.message?.includes('invalid') ? 'Invalid email or password' : 'Login failed. Try again.');
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <AuthForm
        mode="login"
        onSubmit={handleLogin}
        onToggleMode={() => navigation.navigate('Signup')}
        error={error}
      />
    </View>
  );
}
