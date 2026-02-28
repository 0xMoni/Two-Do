import React, { useRef } from 'react';
import { TouchableOpacity, Animated } from 'react-native';
import { PixelText } from '../common/PixelText';
import { useThemeContext } from '../../contexts/ThemeContext';
import { doc, updateDoc, increment, serverTimestamp } from 'firebase/firestore';
import { getFirebaseDb } from '../../lib/firebase';
import * as Haptics from 'expo-haptics';

interface HeartButtonProps {
  duoId: string;
  userId: string;
  affectionCount: number;
  relationshipType: 'couple' | 'friends' | 'ld';
}

const AFFECTION_MAP = {
  couple: { emoji: '❤️', label: 'Hearts' },
  friends: { emoji: '🍫', label: 'Chocolates' },
  ld: { emoji: '💌', label: 'Letters' },
};

export function HeartButton({ duoId, userId, affectionCount, relationshipType }: HeartButtonProps) {
  const { colors } = useThemeContext();
  const scale = useRef(new Animated.Value(1)).current;

  const { emoji, label } = AFFECTION_MAP[relationshipType] ?? AFFECTION_MAP.couple;

  const handlePress = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    Animated.sequence([
      Animated.spring(scale, { toValue: 1.4, useNativeDriver: true, speed: 50 }),
      Animated.spring(scale, { toValue: 1, useNativeDriver: true, speed: 50 }),
    ]).start();

    try {
      const db = getFirebaseDb();
      await updateDoc(doc(db, 'duos', duoId), {
        affectionCount: increment(1),
        lastAffectionSentBy: userId,
        lastAffectionAt: serverTimestamp(),
      });
    } catch {
      // Silent fail — animation already played
    }
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.8}
      style={{
        backgroundColor: colors.card,
        borderWidth: 2,
        borderColor: '#ff6b8a',
        borderRadius: 4,
        paddingHorizontal: 16,
        paddingVertical: 10,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
      }}
    >
      <Animated.Text style={{ fontSize: 24, transform: [{ scale }] }}>
        {emoji}
      </Animated.Text>
      <PixelText size="xs" color="#ff6b8a">
        {affectionCount}
      </PixelText>
    </TouchableOpacity>
  );
}
