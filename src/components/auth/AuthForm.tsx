import React, { useState } from 'react';
import { View, TextInput, KeyboardAvoidingView, Platform, ScrollView, Image } from 'react-native';
import { PixelText } from '../common/PixelText';
import { RPGButton } from '../common/RPGButton';
import { useThemeContext } from '../../contexts/ThemeContext';

interface AuthFormProps {
  mode: 'login' | 'signup';
  onSubmit: (email: string, password: string, displayName?: string) => Promise<void>;
  onToggleMode: () => void;
  error: string | null;
}

export function AuthForm({ mode, onSubmit, onToggleMode, error }: AuthFormProps) {
  const { colors } = useThemeContext();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!email.trim() || !password.trim()) return;
    if (mode === 'signup' && !displayName.trim()) return;
    setLoading(true);
    try {
      await onSubmit(email.trim(), password, displayName.trim());
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    backgroundColor: colors.inputBg,
    borderWidth: 2,
    borderColor: colors.inputBorder,
    borderRadius: 4,
    padding: 14,
    color: colors.text,
    fontSize: 16,
    marginBottom: 14,
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: 'center',
          padding: 24,
        }}
        keyboardShouldPersistTaps="handled"
      >
        <View style={{ alignItems: 'center', marginBottom: 40 }}>
          <Image
            source={require('../../../assets/logo-header.png')}
            style={{ width: 80, height: 80, marginBottom: 16 }}
            resizeMode="contain"
          />
          <PixelText size="xl" color={colors.gold}>
            Two-Do
          </PixelText>
          <PixelText size="xs" color={colors.textSecondary} style={{ marginTop: 8 }}>
            {mode === 'login' ? 'Welcome back, adventurer!' : 'Begin your quest!'}
          </PixelText>
        </View>

        {mode === 'signup' && (
          <TextInput
            style={inputStyle}
            placeholder="Display Name"
            placeholderTextColor={colors.textMuted}
            value={displayName}
            onChangeText={setDisplayName}
            autoCapitalize="words"
          />
        )}

        <TextInput
          style={inputStyle}
          placeholder="Email"
          placeholderTextColor={colors.textMuted}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
        />

        <TextInput
          style={inputStyle}
          placeholder="Password"
          placeholderTextColor={colors.textMuted}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        {error && (
          <PixelText size="xs" color={colors.danger} style={{ marginBottom: 14, textAlign: 'center' }}>
            {error}
          </PixelText>
        )}

        <RPGButton
          title={mode === 'login' ? 'Enter Realm' : 'Create Character'}
          onPress={handleSubmit}
          loading={loading}
          variant="gold"
          size="lg"
          style={{ marginBottom: 16 }}
        />

        <RPGButton
          title={mode === 'login' ? 'New here? Sign Up' : 'Already playing? Log In'}
          onPress={onToggleMode}
          variant="secondary"
          size="sm"
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
