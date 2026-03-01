import React, { useState } from 'react';
import { View, ScrollView, TextInput, Alert, TouchableOpacity, Platform } from 'react-native';
import { PixelText } from '../../components/common/PixelText';
import { RPGCard } from '../../components/common/RPGCard';
import { RPGButton } from '../../components/common/RPGButton';
import { XPBar } from '../../components/common/XPBar';
import { AvatarPicker } from '../../components/profile/AvatarPicker';
import { StatRow } from '../../components/profile/StatRow';
import { useThemeContext } from '../../contexts/ThemeContext';
import { useAuthContext } from '../../contexts/AuthContext';
import { useDuoContext } from '../../contexts/DuoContext';
import { updateUserDocument } from '../../lib/firestore';
import { AVATAR_EMOJIS } from '../../lib/constants';
import { ACHIEVEMENTS } from '../../lib/achievements';
import { doc, updateDoc, Timestamp } from 'firebase/firestore';
import { getFirebaseDb } from '../../lib/firebase';
import { differenceInDays, differenceInMonths, differenceInYears, format } from 'date-fns';
import DateTimePicker from '@react-native-community/datetimepicker';

export function ProfileScreen() {
  const { colors } = useThemeContext();
  const { user, logout, deleteAccount } = useAuthContext();
  const { userProfile, duo } = useDuoContext();

  const [editingNickname, setEditingNickname] = useState(false);
  const [nickname, setNickname] = useState('');
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const partnerId = duo?.memberIds.find((id) => id !== user?.uid) ?? '';
  const myProfile = duo?.memberProfiles[user?.uid ?? ''];
  const partnerProfile = duo?.memberProfiles[partnerId];

  const handleAvatarChange = async (avatarId: string) => {
    if (!user || !duo) return;
    try {
      await updateUserDocument(user.uid, { avatarId });
      const db = getFirebaseDb();
      await updateDoc(doc(db, 'duos', duo.id), {
        [`memberProfiles.${user.uid}.avatarId`]: avatarId,
      });
    } catch {
      Alert.alert('Error', 'Failed to update avatar');
    }
  };

  const handleNicknameSave = async () => {
    if (!duo || !user || !nickname.trim()) {
      setEditingNickname(false);
      return;
    }
    try {
      const db = getFirebaseDb();
      await updateDoc(doc(db, 'duos', duo.id), {
        [`memberProfiles.${partnerId}.nickname`]: nickname.trim(),
      });
      setEditingNickname(false);
      setNickname('');
    } catch {
      Alert.alert('Error', 'Failed to update nickname');
    }
  };

  const handleSetAnniversary = async (date: Date) => {
    if (!duo) return;
    setShowDatePicker(false);
    try {
      const db = getFirebaseDb();
      await updateDoc(doc(db, 'duos', duo.id), {
        relationshipStartDate: Timestamp.fromDate(date),
      });
    } catch {
      Alert.alert('Error', 'Failed to set date');
    }
  };

  const handleLogout = () => {
    Alert.alert('Log Out', 'End your session?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Log Out', style: 'destructive', onPress: logout },
    ]);
  };

  // Anniversary calculation
  const getAnniversaryText = () => {
    if (!duo?.relationshipStartDate) return null;
    const startDate = duo.relationshipStartDate.toDate();
    const now = new Date();
    const totalDays = differenceInDays(now, startDate);
    const years = differenceInYears(now, startDate);
    const months = differenceInMonths(now, startDate) % 12;

    if (years > 0) {
      return `${years}y ${months}m together`;
    } else if (months > 0) {
      const monthStart = new Date(startDate);
      monthStart.setMonth(monthStart.getMonth() + differenceInMonths(now, startDate));
      const remainingDays = differenceInDays(now, monthStart);
      return `${months}m ${remainingDays}d together`;
    } else {
      return `${totalDays} days together`;
    }
  };

  // Achievements
  const unlockedIds = duo?.unlockedAchievements ?? [];
  const unlockedAchievements = ACHIEVEMENTS.filter((a) => unlockedIds.includes(a.id));
  const lockedAchievements = ACHIEVEMENTS.filter((a) => !unlockedIds.includes(a.id));

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={{ padding: 16, paddingTop: 56, paddingBottom: 40 }}
    >
      <PixelText size="lg" color={colors.gold} style={{ marginBottom: 20 }}>
        Character Sheet
      </PixelText>

      {/* My Character */}
      <RPGCard variant="gold" style={{ marginBottom: 16, alignItems: 'center' }}>
        <PixelText size="xl" style={{ marginBottom: 8 }}>
          {AVATAR_EMOJIS[userProfile?.avatarId ?? 'warrior']}
        </PixelText>
        <PixelText size="sm" color={colors.text}>
          {userProfile?.displayName}
        </PixelText>
        <PixelText size="xs" color={colors.textMuted} style={{ marginTop: 4 }}>
          {userProfile?.email}
        </PixelText>

        <View style={{ width: '100%', marginTop: 16 }}>
          <XPBar xp={userProfile?.xp ?? 0} />
        </View>

        <RPGButton
          title={showAvatarPicker ? 'Close' : 'Change Avatar'}
          onPress={() => setShowAvatarPicker(!showAvatarPicker)}
          variant="secondary"
          size="sm"
          style={{ marginTop: 12 }}
        />

        {showAvatarPicker && (
          <View style={{ marginTop: 16 }}>
            <AvatarPicker
              selectedId={userProfile?.avatarId ?? 'warrior'}
              onSelect={handleAvatarChange}
            />
          </View>
        )}
      </RPGCard>

      {/* Stats */}
      <RPGCard style={{ marginBottom: 16 }}>
        <PixelText size="xs" color={colors.textSecondary} style={{ marginBottom: 8 }}>
          Stats
        </PixelText>
        <StatRow label="Level" value={userProfile?.level ?? 1} icon="⭐" />
        <StatRow label="Total XP" value={userProfile?.xp ?? 0} icon="✨" />
        <StatRow label="Quests Done" value={userProfile?.questsCompleted ?? 0} icon="📜" />
        {duo && (
          <>
            <StatRow
              label={duo.relationshipType === 'couple' ? 'Hearts Sent' : duo.relationshipType === 'ld' ? 'Letters Sent' : 'Chocolates Sent'}
              value={duo.affectionCount}
              icon={duo.relationshipType === 'couple' ? '❤️' : duo.relationshipType === 'ld' ? '💌' : '🍫'}
            />
            <StatRow label="Current Streak" value={duo.currentStreak ?? 0} icon="🔥" />
            <StatRow label="Best Streak" value={duo.bestStreak ?? 0} icon="🏅" />
          </>
        )}
      </RPGCard>

      {/* Anniversary (Couples Only) */}
      {duo && duo.relationshipType === 'couple' && (
        <RPGCard style={{ marginBottom: 16 }}>
          <PixelText size="xs" color={colors.textSecondary} style={{ marginBottom: 8 }}>
            Anniversary
          </PixelText>
          {duo.relationshipStartDate ? (
            <View style={{ alignItems: 'center', gap: 8 }}>
              <PixelText size="lg">💕</PixelText>
              <PixelText size="sm" color={colors.accent}>
                {getAnniversaryText()}
              </PixelText>
              <PixelText size="xs" color={colors.textMuted}>
                Since {format(duo.relationshipStartDate.toDate(), 'MMM d, yyyy')}
              </PixelText>
              <RPGButton
                title="Change Date"
                onPress={() => setShowDatePicker(true)}
                variant="secondary"
                size="sm"
                style={{ marginTop: 4 }}
              />
            </View>
          ) : (
            <View style={{ alignItems: 'center', gap: 8 }}>
              <PixelText size="xs" color={colors.textMuted}>
                When did your journey begin?
              </PixelText>
              <RPGButton
                title="Set Start Date"
                onPress={() => setShowDatePicker(true)}
                variant="gold"
                size="sm"
              />
            </View>
          )}
          {showDatePicker && (
            <DateTimePicker
              value={duo.relationshipStartDate?.toDate() ?? new Date()}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              maximumDate={new Date()}
              onChange={(event, date) => {
                if (event.type === 'dismissed') {
                  setShowDatePicker(false);
                  return;
                }
                if (date) handleSetAnniversary(date);
              }}
            />
          )}
        </RPGCard>
      )}

      {/* Partner Nickname */}
      {partnerProfile && (
        <RPGCard variant="accent" style={{ marginBottom: 16 }}>
          <PixelText size="xs" color={colors.textSecondary} style={{ marginBottom: 8 }}>
            Partner's Nickname
          </PixelText>
          <PixelText size="xs" color={colors.text} style={{ marginBottom: 8 }}>
            {partnerProfile.nickname || partnerProfile.displayName}
          </PixelText>
          {editingNickname ? (
            <View style={{ flexDirection: 'row', gap: 8 }}>
              <TextInput
                style={{
                  flex: 1,
                  backgroundColor: colors.inputBg,
                  borderWidth: 2,
                  borderColor: colors.inputBorder,
                  borderRadius: 4,
                  padding: 10,
                  color: colors.text,
                  fontSize: 14,
                }}
                placeholder="Enter nickname"
                placeholderTextColor={colors.textMuted}
                value={nickname}
                onChangeText={setNickname}
                autoFocus
              />
              <RPGButton title="Save" onPress={handleNicknameSave} variant="gold" size="sm" />
            </View>
          ) : (
            <RPGButton
              title="Set Nickname"
              onPress={() => {
                setNickname(partnerProfile.nickname || '');
                setEditingNickname(true);
              }}
              variant="secondary"
              size="sm"
            />
          )}
        </RPGCard>
      )}

      {/* Relationship Type */}
      {duo && (
        <RPGCard style={{ marginBottom: 16 }}>
          <PixelText size="xs" color={colors.textSecondary} style={{ marginBottom: 12 }}>
            Duo Type
          </PixelText>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            {([
              { value: 'couple' as const, emoji: '💕', name: 'Couple' },
              { value: 'friends' as const, emoji: '🤝', name: 'Friends' },
              { value: 'ld' as const, emoji: '🌍', name: 'LD' },
            ]).map((opt) => {
              const isActive = duo.relationshipType === opt.value;
              return (
                <TouchableOpacity
                  key={opt.value}
                  onPress={async () => {
                    try {
                      const db = getFirebaseDb();
                      await updateDoc(doc(db, 'duos', duo.id), {
                        relationshipType: opt.value,
                      });
                    } catch {
                      Alert.alert('Error', 'Failed to update');
                    }
                  }}
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
      )}

      {/* Achievements */}
      <RPGCard style={{ marginBottom: 16 }}>
        <PixelText size="xs" color={colors.textSecondary} style={{ marginBottom: 12 }}>
          Achievements ({unlockedAchievements.length}/{ACHIEVEMENTS.length})
        </PixelText>

        {/* Progress bar */}
        <View style={{ height: 6, backgroundColor: colors.inputBg, borderRadius: 3, marginBottom: 16, overflow: 'hidden' }}>
          <View
            style={{
              height: '100%',
              width: `${(unlockedAchievements.length / ACHIEVEMENTS.length) * 100}%`,
              backgroundColor: colors.gold,
              borderRadius: 3,
            }}
          />
        </View>

        {[...unlockedAchievements, ...lockedAchievements].map((a) => {
          const unlocked = unlockedIds.includes(a.id);
          return (
            <View
              key={a.id}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingVertical: 10,
                borderBottomWidth: 1,
                borderBottomColor: colors.cardBorder + '40',
                opacity: unlocked ? 1 : 0.45,
              }}
            >
              <View style={{ width: 36, alignItems: 'center' }}>
                <PixelText size="sm">{unlocked ? a.icon : '🔒'}</PixelText>
              </View>
              <View style={{ flex: 1, marginLeft: 10 }}>
                <PixelText size="xs" color={unlocked ? colors.text : colors.textMuted}>
                  {a.name}
                </PixelText>
                <PixelText size="xs" color={colors.textMuted} style={{ marginTop: 2, fontSize: 7 }}>
                  {a.description}
                </PixelText>
              </View>
              {unlocked && (
                <PixelText size="xs" color={colors.success}>✓</PixelText>
              )}
            </View>
          );
        })}
      </RPGCard>

      {/* Settings */}
      <RPGCard style={{ marginBottom: 16 }}>
        <PixelText size="xs" color={colors.textSecondary} style={{ marginBottom: 12 }}>
          Settings
        </PixelText>
        <RPGButton
          title="Log Out"
          onPress={handleLogout}
          variant="danger"
          size="sm"
        />
        <View style={{ marginTop: 16, borderTopWidth: 1, borderTopColor: colors.cardBorder, paddingTop: 16 }}>
          <PixelText size="xs" color={colors.danger} style={{ marginBottom: 8 }}>
            Danger Zone
          </PixelText>
          <RPGButton
            title="Delete Account"
            onPress={() => {
              Alert.alert(
                'Delete Account',
                'This will permanently delete your account and all your data. This cannot be undone.',
                [
                  { text: 'Cancel', style: 'cancel' },
                  {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                      try {
                        await deleteAccount();
                      } catch {
                        Alert.alert('Error', 'Failed to delete account. You may need to log in again first.');
                      }
                    },
                  },
                ]
              );
            }}
            variant="danger"
            size="sm"
          />
        </View>
      </RPGCard>

      {/* Footer */}
      <View style={{ alignItems: 'center', marginTop: 8, marginBottom: 8 }}>
        <PixelText size="xs" color={colors.textMuted}>
          © 2026 Two-Do. All rights reserved.
        </PixelText>
      </View>
    </ScrollView>
  );
}
