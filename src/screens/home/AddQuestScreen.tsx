import React, { useState, useMemo } from 'react';
import {
  View,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Alert,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import { PixelText } from '../../components/common/PixelText';
import { RPGButton } from '../../components/common/RPGButton';
import { RPGCard } from '../../components/common/RPGCard';
import { useThemeContext } from '../../contexts/ThemeContext';
import { useAuthContext } from '../../contexts/AuthContext';
import { useDuoContext } from '../../contexts/DuoContext';
import { createQuest } from '../../lib/questService';
import { DEFAULT_CATEGORIES, PRIORITY_XP } from '../../lib/constants';
import { QuestPriority } from '../../types';
import DateTimePicker from '@react-native-community/datetimepicker';
import { scheduleDueReminder } from '../../lib/notificationService';

export function AddQuestScreen({ navigation }: any) {
  const { colors } = useThemeContext();
  const { user } = useAuthContext();
  const { duo } = useDuoContext();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState('daily');
  const [priority, setPriority] = useState<QuestPriority>('medium');
  const [assignToPartner, setAssignToPartner] = useState(false);
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [loading, setLoading] = useState(false);

  const partnerId = duo?.memberIds.find((id) => id !== user?.uid) ?? '';

  const categories = useMemo(() => {
    return [...DEFAULT_CATEGORIES.filter((c) => c.id !== 'all'), ...(duo?.customCategories ?? [])];
  }, [duo?.customCategories]);

  const handleCreate = async () => {
    if (!title.trim() || !duo || !user) return;
    setLoading(true);
    try {
      await createQuest(duo.id, {
        title: title.trim(),
        description: description.trim(),
        categoryId,
        assignedTo: assignToPartner ? partnerId : user.uid,
        createdBy: user.uid,
        dueDate,
        priority,
        recurring: null,
      });
      if (dueDate && !assignToPartner) {
        scheduleDueReminder(title.trim(), dueDate, '').catch(() => {});
      }
      navigation.goBack();
    } catch {
      Alert.alert('Error', 'Failed to create quest');
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
            New Quest
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
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 16 }}>
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

        {/* Assign */}
        <PixelText size="xs" color={colors.textSecondary} style={{ marginBottom: 8 }}>
          Assign To
        </PixelText>
        <View style={{ flexDirection: 'row', gap: 8, marginBottom: 16 }}>
          <RPGButton
            title="Myself"
            onPress={() => setAssignToPartner(false)}
            variant={!assignToPartner ? 'gold' : 'secondary'}
            size="sm"
            style={{ flex: 1 }}
          />
          <RPGButton
            title="Partner"
            onPress={() => setAssignToPartner(true)}
            variant={assignToPartner ? 'gold' : 'secondary'}
            size="sm"
            style={{ flex: 1 }}
          />
        </View>

        {/* Due Date */}
        <PixelText size="xs" color={colors.textSecondary} style={{ marginBottom: 8 }}>
          Due Date
        </PixelText>
        <TouchableOpacity
          onPress={() => setShowDatePicker(true)}
          style={{
            backgroundColor: colors.inputBg,
            borderWidth: 2,
            borderColor: colors.inputBorder,
            borderRadius: 4,
            padding: 14,
            marginBottom: 16,
          }}
        >
          <PixelText size="xs" color={dueDate ? colors.text : colors.textMuted}>
            {dueDate ? dueDate.toLocaleDateString() : 'No due date'}
          </PixelText>
        </TouchableOpacity>

        {showDatePicker && (
          <DateTimePicker
            value={dueDate ?? new Date()}
            mode="date"
            minimumDate={new Date()}
            onChange={(event, date) => {
              setShowDatePicker(Platform.OS === 'ios');
              if (date) setDueDate(date);
            }}
          />
        )}

        {dueDate && (
          <RPGButton
            title="Clear Due Date"
            onPress={() => setDueDate(null)}
            variant="secondary"
            size="sm"
            style={{ marginBottom: 16 }}
          />
        )}

        <RPGButton
          title="Create Quest"
          onPress={handleCreate}
          variant="gold"
          size="lg"
          loading={loading}
          disabled={!title.trim()}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
