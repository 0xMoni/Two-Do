import React from 'react';
import { View } from 'react-native';
import { RPGCard } from '../common/RPGCard';
import { PixelText } from '../common/PixelText';
import { XPBar } from '../common/XPBar';
import { useThemeContext } from '../../contexts/ThemeContext';
import { MemberProfile } from '../../types';
import { AVATAR_EMOJIS } from '../../lib/constants';

interface PartnerCardProps {
  profile: MemberProfile;
  label: string;
  variant?: 'default' | 'accent' | 'gold';
  activeQuestCount?: number;
}

export function PartnerCard({ profile, label, variant = 'default', activeQuestCount }: PartnerCardProps) {
  const { colors } = useThemeContext();
  const emoji = AVATAR_EMOJIS[profile.avatarId] ?? '⚔️';

  return (
    <RPGCard variant={variant} style={{ flex: 1 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8, gap: 8 }}>
        <PixelText size="lg">{emoji}</PixelText>
        <View style={{ flex: 1 }}>
          <PixelText size="xs" color={colors.textMuted}>
            {label}
          </PixelText>
          <PixelText size="xs" color={colors.text}>
            {profile.nickname || profile.displayName}
          </PixelText>
        </View>
      </View>
      <XPBar xp={profile.xp} height={8} />
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 6 }}>
        <PixelText size="xs" color={colors.textSecondary}>
          {profile.questsCompleted} done
        </PixelText>
        {activeQuestCount !== undefined && (
          <PixelText size="xs" color={colors.accent}>
            {activeQuestCount} active
          </PixelText>
        )}
      </View>
    </RPGCard>
  );
}
