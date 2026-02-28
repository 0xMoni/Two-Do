import React from 'react';
import { TouchableOpacity } from 'react-native';
import { PixelText } from '../common/PixelText';
import { useThemeContext } from '../../contexts/ThemeContext';
import { Category } from '../../types';

interface CategoryChipProps {
  category: Category;
  selected: boolean;
  onPress: () => void;
}

export function CategoryChip({ category, selected, onPress }: CategoryChipProps) {
  const { colors } = useThemeContext();

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={{
        backgroundColor: selected ? '#38bdf8' : colors.card,
        borderWidth: 2,
        borderColor: selected ? '#1e293b' : colors.cardBorder,
        borderRadius: 4,
        paddingHorizontal: 12,
        paddingVertical: 8,
        marginRight: 8,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        ...(selected ? {
          shadowColor: '#38bdf8',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.4,
          shadowRadius: 4,
          elevation: 5,
        } : {}),
      }}
    >
      <PixelText size="xs" color={selected ? '#ffffff' : colors.text}>
        {category.icon} {category.name}
      </PixelText>
    </TouchableOpacity>
  );
}
