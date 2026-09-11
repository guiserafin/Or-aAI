import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, fontFamily, spacing } from '@/theme';
import { Button } from './Button';
import { Icon, type IconName } from './Icon';

type Props = {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: IconName;
};

export function EmptyState({ title, description, actionLabel, onAction, icon }: Props) {
  return (
    <View style={styles.container}>
      {icon ? <Icon name={icon} size={34} color={colors.textMuted} /> : null}
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
      {actionLabel && onAction ? (
        <Button label={actionLabel} onPress={onAction} corners style={styles.action} />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: spacing.xxxl,
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
  },
  title: {
    fontFamily: fontFamily.condensedSemiBold,
    fontSize: 28,
    color: colors.text,
    textAlign: 'center',
    marginTop: spacing.sm,
  },
  description: {
    fontFamily: fontFamily.regular,
    fontSize: 17,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 22,
  },
  action: {
    marginTop: spacing.lg,
    alignSelf: 'stretch',
  },
});
