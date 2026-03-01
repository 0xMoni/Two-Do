import React, { useEffect, useRef, useMemo } from 'react';
import { View, Animated, Dimensions, TouchableOpacity } from 'react-native';
import { PixelText } from './PixelText';
import { useThemeContext } from '../../contexts/ThemeContext';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const CONFETTI_COUNT = 30;
const CONFETTI_COLORS = ['#ffd700', '#e94560', '#4ecca3', '#80b4ff', '#ff6b25', '#c084fc'];

interface QuestCompleteToastProps {
  visible: boolean;
  xp: number;
  streak: number;
  onDone: () => void;
  onUndo?: () => void;
}

interface PieceConfig {
  startX: number;
  driftX: number;
  color: string;
  size: number;
  fallDuration: number;
  delay: number;
  spinSpeed: number;
}

function ConfettiPiece({ config }: { config: PieceConfig }) {
  const translateY = useRef(new Animated.Value(-20)).current;
  const translateX = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const rotate = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    translateY.setValue(-20);
    translateX.setValue(0);
    opacity.setValue(0);
    rotate.setValue(0);

    Animated.sequence([
      Animated.delay(config.delay),
      Animated.timing(opacity, { toValue: 1, duration: 100, useNativeDriver: true }),
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: SCREEN_HEIGHT + 20,
          duration: config.fallDuration,
          useNativeDriver: true,
        }),
        Animated.timing(translateX, {
          toValue: config.driftX,
          duration: config.fallDuration,
          useNativeDriver: true,
        }),
        Animated.timing(rotate, {
          toValue: config.spinSpeed,
          duration: config.fallDuration,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, []);

  const spin = rotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '720deg'],
  });

  return (
    <Animated.View
      style={{
        position: 'absolute',
        left: config.startX,
        top: 0,
        width: config.size,
        height: config.size,
        backgroundColor: config.color,
        borderRadius: config.size > 8 ? 2 : 1,
        opacity,
        transform: [{ translateY }, { translateX }, { rotate: spin }],
      }}
    />
  );
}

export function QuestCompleteToast({ visible, xp, streak, onDone, onUndo }: QuestCompleteToastProps) {
  const { colors } = useThemeContext();
  const scale = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  const pieces = useMemo<PieceConfig[]>(() => {
    return Array.from({ length: CONFETTI_COUNT }).map((_, i) => ({
      startX: Math.random() * SCREEN_WIDTH,
      driftX: (Math.random() - 0.5) * 100,
      color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
      size: 6 + Math.random() * 6,
      fallDuration: 1400 + Math.random() * 800,
      delay: Math.random() * 400,
      spinSpeed: 0.5 + Math.random(),
    }));
  }, [visible]);

  useEffect(() => {
    if (visible) {
      scale.setValue(0);
      opacity.setValue(0);
      Animated.sequence([
        Animated.parallel([
          Animated.spring(scale, { toValue: 1, friction: 4, tension: 80, useNativeDriver: true }),
          Animated.timing(opacity, { toValue: 1, duration: 200, useNativeDriver: true }),
        ]),
        Animated.delay(2200),
        Animated.timing(opacity, { toValue: 0, duration: 300, useNativeDriver: true }),
      ]).start(() => onDone());
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 999, pointerEvents: 'box-none' }}>
      <View pointerEvents="none" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
        {pieces.map((config, i) => (
          <ConfettiPiece key={i} config={config} />
        ))}
      </View>

      <Animated.View
        style={{
          position: 'absolute',
          top: 120,
          alignSelf: 'center',
          backgroundColor: colors.card,
          borderWidth: 2,
          borderColor: colors.success,
          borderRadius: 8,
          paddingHorizontal: 24,
          paddingVertical: 16,
          alignItems: 'center',
          opacity,
          transform: [{ scale }],
          shadowColor: colors.success,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 12,
          elevation: 8,
        }}
      >
        <PixelText size="lg" style={{ marginBottom: 8 }}>
          {streak > 1 ? '🔥' : '⚔️'}
        </PixelText>
        <PixelText size="sm" color={colors.success}>
          Quest Complete!
        </PixelText>
        <PixelText size="xs" color={colors.gold} style={{ marginTop: 6 }}>
          +{xp} XP earned!
        </PixelText>
        {streak > 1 && (
          <PixelText size="xs" color="#ff6b25" style={{ marginTop: 4 }}>
            {streak}-day streak!
          </PixelText>
        )}
        {onUndo && (
          <TouchableOpacity
            onPress={() => { onUndo(); onDone(); }}
            activeOpacity={0.7}
            style={{
              marginTop: 10,
              paddingHorizontal: 16,
              paddingVertical: 8,
              borderRadius: 4,
              borderWidth: 2,
              borderColor: colors.danger,
            }}
          >
            <PixelText size="xs" color={colors.danger}>
              Undo
            </PixelText>
          </TouchableOpacity>
        )}
      </Animated.View>
    </View>
  );
}
