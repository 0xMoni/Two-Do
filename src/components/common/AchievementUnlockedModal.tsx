import React, { useEffect, useRef } from 'react';
import { Modal, View, Animated } from 'react-native';
import { PixelText } from './PixelText';
import { RPGButton } from './RPGButton';
import { useThemeContext } from '../../contexts/ThemeContext';
import { Achievement } from '../../types';
import * as Haptics from 'expo-haptics';

interface AchievementUnlockedModalProps {
  visible: boolean;
  achievement: Achievement | null;
  onClose: () => void;
}

export function AchievementUnlockedModal({ visible, achievement, onClose }: AchievementUnlockedModalProps) {
  const { colors } = useThemeContext();
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const bounceAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      scaleAnim.setValue(0);
      bounceAnim.setValue(0);

      Animated.sequence([
        Animated.spring(scaleAnim, {
          toValue: 1,
          useNativeDriver: true,
          speed: 8,
          bounciness: 12,
        }),
        Animated.loop(
          Animated.sequence([
            Animated.timing(bounceAnim, { toValue: -8, duration: 500, useNativeDriver: true }),
            Animated.timing(bounceAnim, { toValue: 0, duration: 500, useNativeDriver: true }),
          ]),
          { iterations: -1 }
        ),
      ]).start();
    }
  }, [visible]);

  if (!achievement) return null;

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={{
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.7)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
      }}>
        <Animated.View style={{
          transform: [{ scale: scaleAnim }],
          backgroundColor: colors.card,
          borderRadius: 12,
          borderWidth: 3,
          borderColor: colors.accent,
          padding: 32,
          alignItems: 'center',
          width: '100%',
          maxWidth: 320,
        }}>
          <PixelText size="xs" color={colors.accent} style={{ marginBottom: 12 }}>
            ACHIEVEMENT UNLOCKED
          </PixelText>

          <Animated.View style={{ transform: [{ translateY: bounceAnim }], marginBottom: 12 }}>
            <PixelText size="xl">{achievement.icon}</PixelText>
          </Animated.View>

          <PixelText size="sm" color={colors.text} style={{ marginBottom: 8 }}>
            {achievement.name}
          </PixelText>

          <PixelText size="xs" color={colors.textSecondary} style={{ marginBottom: 24, textAlign: 'center' }}>
            {achievement.description}
          </PixelText>

          <RPGButton title="Nice!" onPress={onClose} variant="gold" size="sm" />
        </Animated.View>
      </View>
    </Modal>
  );
}
