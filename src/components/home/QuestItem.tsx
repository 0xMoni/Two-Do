import React from 'react';
import { View, TouchableOpacity, Animated } from 'react-native';
import { PixelText } from '../common/PixelText';
import { Badge } from '../common/Badge';
import { useThemeContext } from '../../contexts/ThemeContext';
import { Quest } from '../../types';
import { formatDueDate, isDueDatePast, isDueDateSoon } from '../../lib/utils';
import { PRIORITY_XP } from '../../lib/constants';
import { Swipeable } from 'react-native-gesture-handler';
import * as Haptics from 'expo-haptics';

interface QuestItemProps {
  quest: Quest;
  onComplete: () => void;
  onPress: () => void;
  onDelete: () => void;
  isOwner: boolean;
}

export function QuestItem({ quest, onComplete, onPress, onDelete, isOwner }: QuestItemProps) {
  const { colors } = useThemeContext();
  const isCompleted = quest.status === 'completed';
  const isPast = isDueDatePast(quest.dueDate);
  const isSoon = isDueDateSoon(quest.dueDate);

  const priorityColors = {
    easy: colors.success,
    medium: colors.gold,
    hard: colors.accent,
  };

  const handleComplete = () => {
    if (isCompleted || !isOwner) return;
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    onComplete();
  };

  const renderLeftActions = (_progress: Animated.AnimatedInterpolation<number>, dragX: Animated.AnimatedInterpolation<number>) => {
    if (isCompleted || !isOwner) return null;
    const scale = dragX.interpolate({
      inputRange: [0, 80],
      outputRange: [0.5, 1],
      extrapolate: 'clamp',
    });
    return (
      <TouchableOpacity
        onPress={() => {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          onComplete();
        }}
        style={{
          backgroundColor: colors.success,
          justifyContent: 'center',
          alignItems: 'center',
          width: 80,
          borderRadius: 4,
          marginBottom: 10,
        }}
      >
        <Animated.View style={{ transform: [{ scale }] }}>
          <PixelText size="sm" color="#fff">✓</PixelText>
        </Animated.View>
      </TouchableOpacity>
    );
  };

  const renderRightActions = (_progress: Animated.AnimatedInterpolation<number>, dragX: Animated.AnimatedInterpolation<number>) => {
    if (!isOwner) return null;
    const scale = dragX.interpolate({
      inputRange: [-140, 0],
      outputRange: [1, 0.5],
      extrapolate: 'clamp',
    });
    return (
      <View style={{ flexDirection: 'row', marginBottom: 10 }}>
        <TouchableOpacity
          onPress={onPress}
          style={{
            backgroundColor: colors.gold,
            justifyContent: 'center',
            alignItems: 'center',
            width: 70,
            borderRadius: 4,
            marginLeft: 4,
          }}
        >
          <Animated.View style={{ transform: [{ scale }] }}>
            <PixelText size="xs" color="#fff">Edit</PixelText>
          </Animated.View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={onDelete}
          style={{
            backgroundColor: colors.danger,
            justifyContent: 'center',
            alignItems: 'center',
            width: 70,
            borderRadius: 4,
            marginLeft: 4,
          }}
        >
          <Animated.View style={{ transform: [{ scale }] }}>
            <PixelText size="xs" color="#fff">Delete</PixelText>
          </Animated.View>
        </TouchableOpacity>
      </View>
    );
  };

  const content = (
    <View
      style={{
        backgroundColor: colors.card,
        borderWidth: 2,
        borderColor: isCompleted ? colors.success + '40' : colors.cardBorder,
        borderLeftWidth: 5,
        borderLeftColor: isCompleted ? colors.success : priorityColors[quest.priority],
        borderRadius: 4,
        padding: 14,
        marginBottom: 10,
        opacity: isCompleted ? 0.7 : 1,
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
        {/* Checkbox */}
        <TouchableOpacity
          onPress={handleComplete}
          disabled={isCompleted || !isOwner}
          style={{
            width: 26,
            height: 26,
            borderWidth: 2,
            borderColor: isCompleted ? colors.success : priorityColors[quest.priority],
            borderRadius: 2,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: isCompleted ? colors.success : 'transparent',
          }}
        >
          {isCompleted && (
            <PixelText size="xs" color="#fff">
              ✓
            </PixelText>
          )}
        </TouchableOpacity>

        {/* Content */}
        <View style={{ flex: 1 }}>
          <PixelText
            size="xs"
            color={isCompleted ? colors.textMuted : colors.text}
            style={{ textDecorationLine: isCompleted ? 'line-through' : 'none' }}
          >
            {quest.title}
          </PixelText>

          {quest.description ? (
            <PixelText
              size="xs"
              color={colors.textMuted}
              style={{ marginTop: 4 }}
            >
              {quest.description}
            </PixelText>
          ) : null}

          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8, gap: 8, flexWrap: 'wrap' }}>
            {isCompleted ? (
              <Badge
                label={`✓ +${quest.earnedXp || PRIORITY_XP[quest.priority]}XP earned`}
                color={colors.success}
                bgColor={colors.success + '20'}
              />
            ) : (
              <>
                <Badge
                  label={`${quest.priority.toUpperCase()} +${PRIORITY_XP[quest.priority]}XP`}
                  color={priorityColors[quest.priority]}
                  bgColor={priorityColors[quest.priority] + '20'}
                />
                {quest.dueDate && (
                  <Badge
                    label={formatDueDate(quest.dueDate)}
                    color={isPast ? colors.danger : isSoon ? colors.gold : colors.textSecondary}
                    bgColor={(isPast ? colors.danger : isSoon ? colors.gold : colors.textSecondary) + '20'}
                  />
                )}
              </>
            )}
          </View>
        </View>
      </View>
    </View>
  );

  if (!isOwner) {
    return <TouchableOpacity onPress={onPress} activeOpacity={0.8}>{content}</TouchableOpacity>;
  }

  return (
    <Swipeable
      renderLeftActions={renderLeftActions}
      renderRightActions={renderRightActions}
      overshootLeft={false}
      overshootRight={false}
    >
      <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
        {content}
      </TouchableOpacity>
    </Swipeable>
  );
}
