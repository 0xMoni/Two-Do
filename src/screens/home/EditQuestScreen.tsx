import React, { useState, useMemo, useEffect } from 'react';
import {
  View,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Alert,
  Platform,
  KeyboardAvoidingView,
  ActivityIndicator,
} from 'react-native';
import { PixelText } from '../../components/common/PixelText';
import { RPGButton } from '../../components/common/RPGButton';
import { useThemeContext } from '../../contexts/ThemeContext';
import { useAuthContext } from '../../contexts/AuthContext';
import { useDuoContext } from '../../contexts/DuoContext';
import { useQuests } from '../../lib/useQuests';
import { updateQuest, uncompleteQuest, softDeleteQuest } from '../../lib/questService';
import { DEFAULT_CATEGORIES, PRIORITY_XP } from '../../lib/constants';
import { QuestPriority } from '../../types';

export function EditQuestScreen({ route, navigation }: any) {
  const { questId } = route.params;
  const { colors } = useThemeContext();
  const { user } = useAuthContext();
  const { duo } = useDuoContext();
  const { quests } = useQuests(duo?.id ?? null);

  const quest = quests.find((q) => q.id === questId);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState('daily');
  const [priority, setPriority] = useState<QuestPriority>('medium');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (quest) {
      setTitle(quest.title);
      setDescription(quest.description);
      setCategoryId(quest.categoryId);
      setPriority(quest.priority);
    }
  }, [quest?.id]);

  const categories = useMemo(() => {
    return [...DEFAULT_CATEGORIES.filter((c) => c.id !== 'all'), ...(duo?.customCategories ?? [])];
  }, [duo?.customCategories]);

  const handleUpdate = async () => {
    if (!title.trim() || !duo || !quest) return;
    setLoading(true);
    try {
      await updateQuest(duo.id, questId, {
        title: title.trim(),
        description: description.trim(),
        categoryId,
        priority,
        baseXp: PRIORITY_XP[priority],
      });
      navigation.goBack();
    } catch {
      Alert.alert('Error', 'Failed to update quest');
    } finally {
      setLoading(false);
    }
  };

  if (!quest) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator color={colors.gold} size="large" />
      </View>
    );
  }

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

  const priorityOptions: { value: QuestPriority; label: string; color: string }[] = [
    { value: 'easy', label: `Easy +${PRIORITY_XP.easy}XP`, color: colors.success },
    { value: 'medium', label: `Med +${PRIORITY_XP.medium}XP`, color: colors.gold },
    { value: 'hard', label: `Hard +${PRIORITY_XP.hard}XP`, color: colors.accent },
  ];

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1, backgroundColor: colors.background }}
    >
      <ScrollView contentContainerStyle={{ padding: 20, paddingTop: 56 }} keyboardShouldPersistTaps="handled">
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <PixelText size="md" color={colors.gold}>
            Edit Quest
          </PixelText>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <PixelText size="sm" color={colors.textMuted}>
              ✕
            </PixelText>
          </TouchableOpacity>
        </View>

        <TextInput
          style={inputStyle}
          placeholder="Quest Title"
          placeholderTextColor={colors.textMuted}
          value={title}
          onChangeText={setTitle}
        />

        <TextInput
          style={[inputStyle, { height: 80, textAlignVertical: 'top' }]}
          placeholder="Description (optional)"
          placeholderTextColor={colors.textMuted}
          value={description}
          onChangeText={setDescription}
          multiline
        />

        {/* Priority */}
        <PixelText size="xs" color={colors.textSecondary} style={{ marginBottom: 8 }}>
          Difficulty
        </PixelText>
        <View style={{ flexDirection: 'row', gap: 8, marginBottom: 16 }}>
          {priorityOptions.map((opt) => (
            <TouchableOpacity
              key={opt.value}
              onPress={() => setPriority(opt.value)}
              style={{
                flex: 1,
                backgroundColor: priority === opt.value ? opt.color + '30' : colors.card,
                borderWidth: 2,
                borderColor: priority === opt.value ? opt.color : colors.cardBorder,
                borderRadius: 4,
                paddingVertical: 10,
                alignItems: 'center',
              }}
            >
              <PixelText size="xs" color={priority === opt.value ? opt.color : colors.textSecondary}>
                {opt.label}
              </PixelText>
            </TouchableOpacity>
          ))}
        </View>

        {/* Category */}
        <PixelText size="xs" color={colors.textSecondary} style={{ marginBottom: 8 }}>
          Category
        </PixelText>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 24 }}>
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat.id}
              onPress={() => setCategoryId(cat.id)}
              style={{
                backgroundColor: categoryId === cat.id ? colors.accent : colors.card,
                borderWidth: 2,
                borderColor: categoryId === cat.id ? colors.accent : colors.cardBorder,
                borderRadius: 4,
                paddingHorizontal: 12,
                paddingVertical: 8,
                marginRight: 8,
              }}
            >
              <PixelText size="xs" color={categoryId === cat.id ? '#fff' : colors.text}>
                {cat.icon} {cat.name}
              </PixelText>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Undo & Delete */}
        {quest.status === 'completed' && (
          <View style={{ flexDirection: 'row', gap: 10, marginBottom: 12 }}>
            <RPGButton
              title="Undo"
              onPress={() => {
                Alert.alert('Undo Quest', 'Mark this quest as active again? Earned XP will be deducted.', [
                  { text: 'Cancel', style: 'cancel' },
                  {
                    text: 'Undo',
                    onPress: async () => {
                      if (!duo || !user) return;
                      try {
                        await uncompleteQuest(duo.id, questId, quest.assignedTo, quest.earnedXp || PRIORITY_XP[quest.priority] || 0);
                        navigation.goBack();
                      } catch {
                        Alert.alert('Error', 'Failed to undo quest');
                      }
                    },
                  },
                ]);
              }}
              variant="secondary"
              size="sm"
              style={{ flex: 1 }}
            />
            <RPGButton
              title="Delete"
              onPress={() => {
                Alert.alert('Delete Quest', `Remove "${quest.title}" permanently?`, [
                  { text: 'Cancel', style: 'cancel' },
                  {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                      if (!duo) return;
                      await softDeleteQuest(duo.id, questId);
                      navigation.goBack();
                    },
                  },
                ]);
              }}
              variant="danger"
              size="sm"
              style={{ flex: 1 }}
            />
          </View>
        )}

        {quest.status === 'active' && (
          <View style={{ flexDirection: 'row', gap: 10, marginBottom: 12 }}>
            <RPGButton
              title="Delete"
              onPress={() => {
                Alert.alert('Delete Quest', `Remove "${quest.title}"?`, [
                  { text: 'Cancel', style: 'cancel' },
                  {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                      if (!duo) return;
                      await softDeleteQuest(duo.id, questId);
                      navigation.goBack();
                    },
                  },
                ]);
              }}
              variant="danger"
              size="sm"
              style={{ flex: 1 }}
            />
          </View>
        )}

        <RPGButton
          title="Save Changes"
          onPress={handleUpdate}
          variant="gold"
          size="lg"
          loading={loading}
          disabled={!title.trim()}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
