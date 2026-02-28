import React, { useEffect, useRef } from 'react';
import { Modal, View, Animated, Easing } from 'react-native';
import { PixelText } from './PixelText';
import { RPGButton } from './RPGButton';
import { useThemeContext } from '../../contexts/ThemeContext';
import * as Haptics from 'expo-haptics';

interface LevelUpModalProps {
  visible: boolean;
  level: number;
  onClose: () => void;
}

export function LevelUpModal({ visible, level, onClose }: LevelUpModalProps) {
  const { colors } = useThemeContext();
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const sparkleAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      scaleAnim.setValue(0);
      rotateAnim.setValue(0);
      sparkleAnim.setValue(0);

      Animated.sequence([
        Animated.spring(scaleAnim, {
          toValue: 1,
          useNativeDriver: true,
          speed: 8,
          bounciness: 15,
        }),
        Animated.loop(
          Animated.sequence([
            Animated.timing(sparkleAnim, {
              toValue: 1,
              duration: 800,
              useNativeDriver: true,
              easing: Easing.inOut(Easing.ease),
            }),
            Animated.timing(sparkleAnim, {
              toValue: 0,
              duration: 800,
              useNativeDriver: true,
              easing: Easing.inOut(Easing.ease),
            }),
          ]),
          { iterations: -1 }
        ),
      ]).start();

      Animated.loop(
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 3000,
          useNativeDriver: true,
          easing: Easing.linear,
        })
      ).start();
    }
  }, [visible]);

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const sparkleOpacity = sparkleAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.5, 1],
  });

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
          borderColor: colors.gold,
          padding: 32,
          alignItems: 'center',
          width: '100%',
          maxWidth: 320,
          shadowColor: colors.gold,
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0.6,
          shadowRadius: 20,
          elevation: 10,
        }}>
          <Animated.View style={{ transform: [{ rotate }], marginBottom: 8 }}>
            <PixelText size="xl">⭐</PixelText>
          </Animated.View>

          <PixelText size="lg" color={colors.gold} style={{ marginBottom: 8 }}>
            LEVEL UP!
          </PixelText>

          <Animated.View style={{ opacity: sparkleOpacity }}>
            <PixelText size="xs" color={colors.textSecondary} style={{ marginBottom: 16, textAlign: 'center' }}>
              You've reached
            </PixelText>
          </Animated.View>

          <View style={{
            backgroundColor: colors.gold + '20',
            borderWidth: 2,
            borderColor: colors.gold,
            borderRadius: 8,
            paddingHorizontal: 24,
            paddingVertical: 12,
            marginBottom: 20,
          }}>
            <PixelText size="lg" color={colors.gold}>
              Level {level}
            </PixelText>
          </View>

          <PixelText size="xs" color={colors.textMuted} style={{ marginBottom: 20, textAlign: 'center' }}>
            Keep completing quests to level up!
          </PixelText>

          <RPGButton title="Continue" onPress={onClose} variant="gold" size="sm" />
        </Animated.View>
      </View>
    </Modal>
  );
}
