import React from 'react';
import { View, FlatList } from 'react-native';
import { QuestItem } from './QuestItem';
import { PixelText } from '../common/PixelText';
import { useThemeContext } from '../../contexts/ThemeContext';
import { Quest } from '../../types';

interface QuestListProps {
  quests: Quest[];
  currentUserId: string;
  onComplete: (quest: Quest) => void;
  onEdit: (quest: Quest) => void;
  onDelete: (quest: Quest) => void;
}

export function QuestList({ quests, currentUserId, onComplete, onEdit, onDelete }: QuestListProps) {
  const { colors } = useThemeContext();

  if (quests.length === 0) {
    return (
      <View style={{ alignItems: 'center', paddingVertical: 40 }}>
        <PixelText size="lg" style={{ marginBottom: 8 }}>
          📜
        </PixelText>
        <PixelText size="xs" color={colors.textMuted} style={{ textAlign: 'center' }}>
          No quests here yet...{'\n'}Tap + to create one!
        </PixelText>
      </View>
    );
  }

  const priorityOrder: Record<string, number> = { hard: 0, medium: 1, easy: 2 };

  const sorted = [...quests].sort((a, b) => {
    // Active first, completed last
    if (a.status === 'active' && b.status !== 'active') return -1;
    if (a.status !== 'active' && b.status === 'active') return 1;

    // Within active: sort by priority (hard > medium > easy)
    const pa = priorityOrder[a.priority] ?? 1;
    const pb = priorityOrder[b.priority] ?? 1;
    if (pa !== pb) return pa - pb;

    // Then by due date (soonest first, no due date last)
    const da = a.dueDate ? new Date(a.dueDate).getTime() : Infinity;
    const db = b.dueDate ? new Date(b.dueDate).getTime() : Infinity;
    if (da !== db) return da - db;

    return 0;
  });

  return (
    <FlatList
      data={sorted}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <QuestItem
          quest={item}
          isOwner={item.assignedTo === currentUserId}
          onComplete={() => onComplete(item)}
          onPress={() => onEdit(item)}
          onDelete={() => onDelete(item)}
        />
      )}
      scrollEnabled={false}
    />
  );
}
