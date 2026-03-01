import React, { useState, useMemo, useEffect, useRef } from 'react';
import { View, ScrollView, TouchableOpacity, Alert, TextInput, Modal, Image, RefreshControl } from 'react-native';
import { PixelText } from '../../components/common/PixelText';
import { PartnerCard } from '../../components/home/PartnerCard';
import { HeartButton } from '../../components/home/HeartButton';
import { QuestToggle } from '../../components/home/QuestToggle';
import { CategoryChip } from '../../components/home/CategoryChip';
import { QuestList } from '../../components/home/QuestList';
import { QuestCompleteToast } from '../../components/common/QuestCompleteToast';
import { LevelUpModal } from '../../components/common/LevelUpModal';
import { AchievementUnlockedModal } from '../../components/common/AchievementUnlockedModal';
import { useThemeContext } from '../../contexts/ThemeContext';
import { useAuthContext } from '../../contexts/AuthContext';
import { useDuoContext } from '../../contexts/DuoContext';
import { useQuests } from '../../lib/useQuests';
import { completeQuestWithStreak, softDeleteQuest, uncompleteQuest } from '../../lib/questService';
import { DEFAULT_CATEGORIES } from '../../lib/constants';
import { Quest, Category } from '../../types';
import { checkExpiredQuests } from '../../lib/expiredQuestChecker';
import { doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { getFirebaseDb } from '../../lib/firebase';
import * as Haptics from 'expo-haptics';

export function HomeScreen({ navigation }: any) {
  const { colors } = useThemeContext();
  const { user } = useAuthContext();
  const { duo, levelUpLevel, dismissLevelUp, newAchievement, dismissAchievement } = useDuoContext();
  const { quests, loading } = useQuests(duo?.id ?? null);

  const [questView, setQuestView] = useState<'mine' | 'partner'>('mine');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [newCatIcon, setNewCatIcon] = useState('📌');
  const expiredChecked = useRef(false);
  const [refreshing, setRefreshing] = useState(false);
  const [completeToast, setCompleteToast] = useState<{ xp: number; streak: number; questId: string } | null>(null);
  const [showHistory, setShowHistory] = useState(false);

  const handleAddCategory = async () => {
    if (!newCatName.trim() || !duo) return;
    const newCat: Category = {
      id: newCatName.trim().toLowerCase().replace(/\s+/g, '-'),
      name: newCatName.trim(),
      icon: newCatIcon || '📌',
      isDefault: false,
    };
    try {
      const db = getFirebaseDb();
      await updateDoc(doc(db, 'duos', duo.id), {
        customCategories: arrayUnion(newCat),
      });
      setNewCatName('');
      setNewCatIcon('📌');
      setShowAddCategory(false);
    } catch {
      Alert.alert('Error', 'Failed to add category');
    }
  };

  // Check for expired quests on mount
  useEffect(() => {
    if (duo?.id && !expiredChecked.current) {
      expiredChecked.current = true;
      checkExpiredQuests(duo.id).catch(() => {});
    }
  }, [duo?.id]);

  const partnerId = duo?.memberIds.find((id) => id !== user?.uid) ?? '';
  const myProfile = duo?.memberProfiles[user?.uid ?? ''];
  const partnerProfile = duo?.memberProfiles[partnerId];

  const categories = useMemo(() => {
    return [...DEFAULT_CATEGORIES, ...(duo?.customCategories ?? [])];
  }, [duo?.customCategories]);

  const myActiveCount = useMemo(() => {
    return quests.filter((q) => q.assignedTo === user?.uid && q.status === 'active').length;
  }, [quests, user?.uid]);

  const partnerActiveCount = useMemo(() => {
    return quests.filter((q) => q.assignedTo === partnerId && q.status === 'active').length;
  }, [quests, partnerId]);

  const { activeQuests, completedQuests } = useMemo(() => {
    const targetUid = questView === 'mine' ? user?.uid : partnerId;
    let filtered = quests.filter((q) => q.assignedTo === targetUid);
    if (selectedCategory !== 'all') {
      filtered = filtered.filter((q) => q.categoryId === selectedCategory);
    }
    return {
      activeQuests: filtered.filter((q) => q.status === 'active'),
      completedQuests: filtered.filter((q) => q.status === 'completed'),
    };
  }, [quests, questView, selectedCategory, user?.uid, partnerId]);

  const handleComplete = async (quest: Quest) => {
    if (!duo || !user) return;
    try {
      const { earnedXp, newStreak } = await completeQuestWithStreak(
        duo.id,
        quest.id,
        quest,
        user.uid,
        duo.currentStreak ?? 0,
        duo.bestStreak ?? 0,
        duo.lastStreakDate ?? null,
      );
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setCompleteToast({ xp: earnedXp, streak: newStreak, questId: quest.id });
    } catch {
      Alert.alert('Error', 'Failed to complete quest');
    }
  };

  const handleUndoFromToast = async () => {
    if (!duo || !user || !completeToast) return;
    try {
      await uncompleteQuest(duo.id, completeToast.questId, user.uid, completeToast.xp);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    } catch {
      Alert.alert('Error', 'Failed to undo quest');
    }
  };

  const handleUndoQuest = async (quest: Quest) => {
    if (!duo || !user) return;
    const xpToDeduct = quest.earnedXp || 0;
    try {
      await uncompleteQuest(duo.id, quest.id, user.uid, xpToDeduct);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    } catch {
      Alert.alert('Error', 'Failed to undo quest');
    }
  };

  const handleDelete = async (quest: Quest) => {
    if (!duo) return;
    Alert.alert('Delete Quest', `Remove "${quest.title}"?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await softDeleteQuest(duo.id, quest.id);
        },
      },
    ]);
  };

  const handleEdit = (quest: Quest) => {
    navigation.navigate('EditQuest', { questId: quest.id });
  };

  const onRefresh = async () => {
    setRefreshing(true);
    if (duo?.id) {
      await checkExpiredQuests(duo.id).catch(() => {});
    }
    setRefreshing(false);
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView
        contentContainerStyle={{ padding: 16, paddingTop: 56, paddingBottom: 100 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.accent} colors={[colors.accent]} />}
      >
        {/* Header */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <View style={{ gap: 4 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <Image
                source={require('../../../assets/logo-header.png')}
                style={{ width: 40, height: 40 }}
                resizeMode="contain"
              />
              <PixelText size="lg" color={colors.accent}>
                Two-Do
              </PixelText>
            </View>
            <PixelText size="xs" color={colors.textMuted}>
              Quest Log
            </PixelText>
          </View>
          {duo && user && (
            <HeartButton
              duoId={duo.id}
              userId={user.uid}
              affectionCount={duo.affectionCount}
              relationshipType={duo.relationshipType}
            />
          )}
        </View>

        {/* Partner Cards */}
        {myProfile && partnerProfile && (
          <View style={{ flexDirection: 'row', gap: 12, marginBottom: 20 }}>
            <TouchableOpacity activeOpacity={0.8} onPress={() => setQuestView('mine')} style={{ flex: 1 }}>
              <PartnerCard profile={myProfile} label="You" variant={questView === 'mine' ? 'gold' : 'default'} activeQuestCount={myActiveCount} />
            </TouchableOpacity>
            <TouchableOpacity activeOpacity={0.8} onPress={() => setQuestView('partner')} style={{ flex: 1 }}>
              <PartnerCard profile={partnerProfile} label="Partner" variant={questView === 'partner' ? 'accent' : 'default'} activeQuestCount={partnerActiveCount} />
            </TouchableOpacity>
          </View>
        )}

        {/* Quest Toggle */}
        <QuestToggle
          value={questView}
          onChange={setQuestView}
          myName={myProfile?.displayName ?? 'Me'}
          partnerName={partnerProfile?.nickname || partnerProfile?.displayName || 'Partner'}
        />

        {/* Categories */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ marginVertical: 16 }}
          contentContainerStyle={{ paddingRight: 16 }}
        >
          {categories.map((cat) => (
            <CategoryChip
              key={cat.id}
              category={cat}
              selected={selectedCategory === cat.id}
              onPress={() => setSelectedCategory(cat.id)}
            />
          ))}
          <TouchableOpacity
            onPress={() => setShowAddCategory(true)}
            activeOpacity={0.7}
            style={{
              backgroundColor: colors.card,
              borderWidth: 2,
              borderColor: colors.cardBorder,
              borderRadius: 4,
              paddingHorizontal: 14,
              paddingVertical: 8,
              borderStyle: 'dashed',
            }}
          >
            <PixelText size="xs" color={colors.textMuted}>
              + Add
            </PixelText>
          </TouchableOpacity>
        </ScrollView>

        {/* Active Quests */}
        <QuestList
          quests={activeQuests}
          currentUserId={user?.uid ?? ''}
          onComplete={handleComplete}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

        {/* History Toggle */}
        {completedQuests.length > 0 && (
          <View style={{ marginTop: 8 }}>
            <TouchableOpacity
              onPress={() => setShowHistory(!showHistory)}
              activeOpacity={0.7}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                paddingVertical: 10,
                gap: 6,
              }}
            >
              <PixelText size="xs" color={colors.textMuted}>
                {showHistory ? '▼' : '▶'} History ({completedQuests.length})
              </PixelText>
            </TouchableOpacity>

            {showHistory && (
              <QuestList
                quests={completedQuests}
                currentUserId={user?.uid ?? ''}
                onComplete={handleComplete}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onUndo={handleUndoQuest}
              />
            )}
          </View>
        )}
      </ScrollView>

      {/* FAB */}
      <TouchableOpacity
        onPress={() => navigation.navigate('AddQuest')}
        activeOpacity={0.8}
        style={{
          position: 'absolute',
          bottom: 24,
          right: 24,
          width: 56,
          height: 56,
          borderRadius: 28,
          backgroundColor: colors.accent,
          justifyContent: 'center',
          alignItems: 'center',
          borderWidth: 2,
          borderColor: colors.accent,
          shadowColor: colors.accent,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.4,
          shadowRadius: 8,
          elevation: 5,
        }}
      >
        <PixelText size="lg" color="#fff">
          +
        </PixelText>
      </TouchableOpacity>

      {/* Add Category Modal */}
      <Modal visible={showAddCategory} transparent animationType="fade">
        <View style={{ flex: 1, backgroundColor: colors.overlay, justifyContent: 'center', padding: 24 }}>
          <View style={{ backgroundColor: colors.card, borderRadius: 8, padding: 20, borderWidth: 2, borderColor: colors.cardBorder }}>
            <PixelText size="sm" color={colors.accent} style={{ marginBottom: 16 }}>
              New Category
            </PixelText>

            <PixelText size="xs" color={colors.textSecondary} style={{ marginBottom: 6 }}>
              Icon (emoji)
            </PixelText>
            <TextInput
              style={{
                backgroundColor: colors.inputBg,
                borderWidth: 2,
                borderColor: colors.inputBorder,
                borderRadius: 4,
                padding: 12,
                color: colors.text,
                fontSize: 24,
                textAlign: 'center',
                marginBottom: 12,
              }}
              value={newCatIcon}
              onChangeText={(t) => setNewCatIcon(t.slice(-2))}
              maxLength={2}
            />

            <PixelText size="xs" color={colors.textSecondary} style={{ marginBottom: 6 }}>
              Name
            </PixelText>
            <TextInput
              style={{
                backgroundColor: colors.inputBg,
                borderWidth: 2,
                borderColor: colors.inputBorder,
                borderRadius: 4,
                padding: 12,
                color: colors.text,
                fontSize: 16,
                marginBottom: 16,
              }}
              placeholder="e.g. Shopping"
              placeholderTextColor={colors.textMuted}
              value={newCatName}
              onChangeText={setNewCatName}
              autoFocus
            />

            <View style={{ flexDirection: 'row', gap: 10 }}>
              <TouchableOpacity
                onPress={() => { setShowAddCategory(false); setNewCatName(''); setNewCatIcon('📌'); }}
                style={{ flex: 1, padding: 12, borderRadius: 4, borderWidth: 2, borderColor: colors.cardBorder, alignItems: 'center' }}
              >
                <PixelText size="xs" color={colors.textSecondary}>Cancel</PixelText>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleAddCategory}
                style={{ flex: 1, padding: 12, borderRadius: 4, backgroundColor: colors.accent, alignItems: 'center' }}
              >
                <PixelText size="xs" color="#fff">Create</PixelText>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Quest Complete Toast */}
      <QuestCompleteToast
        visible={completeToast !== null}
        xp={completeToast?.xp ?? 0}
        streak={completeToast?.streak ?? 0}
        onDone={() => setCompleteToast(null)}
        onUndo={handleUndoFromToast}
      />

      {/* Level Up Modal */}
      <LevelUpModal
        visible={levelUpLevel !== null}
        level={levelUpLevel ?? 1}
        onClose={dismissLevelUp}
      />

      {/* Achievement Unlocked Modal */}
      <AchievementUnlockedModal
        visible={newAchievement !== null}
        achievement={newAchievement}
        onClose={dismissAchievement}
      />
    </View>
  );
}
