import React, { useState } from 'react';
import { View, TextInput, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { PixelText } from '../components/common/PixelText';
import { RPGCard } from '../components/common/RPGCard';
import { RPGButton } from '../components/common/RPGButton';
import { useThemeContext } from '../contexts/ThemeContext';
import { useAuthContext } from '../contexts/AuthContext';
import { useDuoContext } from '../contexts/DuoContext';
import { lookupPairingCode, createDuo } from '../lib/pairingService';
import { RelationshipType } from '../types';
import * as Clipboard from 'expo-clipboard';
import * as Haptics from 'expo-haptics';
import QRCode from 'react-native-qrcode-svg';

export function PairingScreen() {
  const { colors } = useThemeContext();
  const { user, logout } = useAuthContext();
  const { userProfile } = useDuoContext();
  const [partnerCode, setPartnerCode] = useState('');
  const [relationshipType, setRelationshipType] = useState<RelationshipType>('couple');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const myCode = userProfile?.pairingCode ?? '------';

  const handleCopy = async () => {
    await Clipboard.setStringAsync(myCode);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePair = async () => {
    if (!user || !userProfile || partnerCode.trim().length < 6) return;
    const code = partnerCode.trim().toUpperCase();

    if (code === myCode) {
      Alert.alert('Oops', "You can't pair with yourself!");
      return;
    }

    setLoading(true);
    try {
      const result = await lookupPairingCode(code);
      if (!result) {
        Alert.alert('Not Found', 'No adventurer found with that code.');
        setLoading(false);
        return;
      }

      await createDuo(user.uid, result.uid, myCode, code, relationshipType);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (e: any) {
      Alert.alert('Error', e?.message ?? 'Failed to pair. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={{ padding: 24, paddingTop: 60 }}
      keyboardShouldPersistTaps="handled"
    >
      <View style={{ alignItems: 'center', marginBottom: 32 }}>
        <PixelText size="lg" color={colors.gold}>
          Find Your Duo
        </PixelText>
        <PixelText size="xs" color={colors.textSecondary} style={{ marginTop: 8, textAlign: 'center' }}>
          Share your code with your partner to begin your quest together
        </PixelText>
      </View>

      {/* My Code */}
      <RPGCard variant="gold" style={{ alignItems: 'center', marginBottom: 24 }}>
        <PixelText size="xs" color={colors.textSecondary} style={{ marginBottom: 12 }}>
          Your Pairing Code
        </PixelText>
        <PixelText size="xl" color={colors.gold} style={{ letterSpacing: 4 }}>
          {myCode}
        </PixelText>

        <View style={{ marginTop: 16, marginBottom: 8 }}>
          <QRCode
            value={myCode}
            size={140}
            backgroundColor="transparent"
            color={colors.gold}
          />
        </View>

        <RPGButton
          title={copied ? 'Copied!' : 'Copy Code'}
          onPress={handleCopy}
          variant="secondary"
          size="sm"
          style={{ marginTop: 12 }}
        />
      </RPGCard>

      {/* Enter Partner Code */}
      <RPGCard style={{ marginBottom: 24 }}>
        <PixelText size="xs" color={colors.textSecondary} style={{ marginBottom: 12 }}>
          Enter Partner's Code
        </PixelText>
        <TextInput
          style={{
            backgroundColor: colors.inputBg,
            borderWidth: 2,
            borderColor: colors.inputBorder,
            borderRadius: 4,
            padding: 14,
            color: colors.text,
            fontSize: 20,
            textAlign: 'center',
            letterSpacing: 4,
            fontFamily: 'PressStart2P_400Regular',
          }}
          placeholder="ABC123"
          placeholderTextColor={colors.textMuted}
          value={partnerCode}
          onChangeText={(t) => setPartnerCode(t.toUpperCase())}
          maxLength={6}
          autoCapitalize="characters"
        />
      </RPGCard>

      {/* Relationship Type */}
      <RPGCard style={{ marginBottom: 24 }}>
        <PixelText size="xs" color={colors.textSecondary} style={{ marginBottom: 12 }}>
          Duo Type
        </PixelText>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          {([
            { value: 'couple' as const, emoji: '💕', name: 'Couple' },
            { value: 'friends' as const, emoji: '🤝', name: 'Friends' },
            { value: 'ld' as const, emoji: '🌍', name: 'LD' },
          ]).map((opt) => {
            const isActive = relationshipType === opt.value;
            return (
              <TouchableOpacity
                key={opt.value}
                onPress={() => setRelationshipType(opt.value)}
                activeOpacity={0.7}
                style={{
                  flex: 1,
                  backgroundColor: isActive ? colors.gold + '20' : colors.inputBg,
                  borderWidth: 2,
                  borderColor: isActive ? colors.gold : colors.cardBorder,
                  borderRadius: 4,
                  paddingVertical: 10,
                  alignItems: 'center',
                }}
              >
                <PixelText size="lg">{opt.emoji}</PixelText>
                <PixelText size="xs" color={isActive ? colors.gold : colors.textSecondary} style={{ marginTop: 4 }}>
                  {opt.name}
                </PixelText>
              </TouchableOpacity>
            );
          })}
        </View>
      </RPGCard>

      <RPGButton
        title="Pair Up!"
        onPress={handlePair}
        variant="gold"
        size="lg"
        loading={loading}
        disabled={partnerCode.length < 6}
        style={{ marginBottom: 16 }}
      />

      <RPGButton
        title="Log Out"
        onPress={logout}
        variant="secondary"
        size="sm"
      />
    </ScrollView>
  );
}
