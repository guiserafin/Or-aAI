import React, { useEffect, useRef } from 'react';
import { ActivityIndicator, Animated, Easing, StyleSheet, Text, View } from 'react-native';
import { colors, fontSize, spacing } from '@/theme';

type Props = {
  steps: string[];
  /** Quantos passos já foram concluídos. */
  completed: number;
};

export function ProcessingChecklist({ steps, completed }: Props) {
  return (
    <View style={styles.list}>
      {steps.map((step, index) => (
        <ChecklistRow
          key={step}
          label={step}
          state={index < completed ? 'done' : index === completed ? 'active' : 'pending'}
        />
      ))}
    </View>
  );
}

function ChecklistRow({
  label,
  state,
}: {
  label: string;
  state: 'done' | 'active' | 'pending';
}) {
  const progress = useRef(new Animated.Value(state === 'pending' ? 0 : 1)).current;

  useEffect(() => {
    Animated.timing(progress, {
      toValue: state === 'pending' ? 0 : 1,
      duration: 260,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start();
  }, [progress, state]);

  const translateY = progress.interpolate({ inputRange: [0, 1], outputRange: [6, 0] });
  const opacity = progress.interpolate({ inputRange: [0, 1], outputRange: [0.35, 1] });

  return (
    <Animated.View style={[styles.row, { opacity, transform: [{ translateY }] }]}>
      <View style={styles.marker}>
        {state === 'done' ? (
          <Text style={styles.check}>✓</Text>
        ) : state === 'active' ? (
          <ActivityIndicator size="small" color={colors.primary} />
        ) : (
          <View style={styles.dot} />
        )}
      </View>
      <Text style={[styles.label, state === 'done' && styles.labelDone]}>{label}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: spacing.lg,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  marker: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  check: {
    fontSize: fontSize.lg,
    fontWeight: '700',
    color: colors.primary,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.borderStrong,
  },
  label: {
    flex: 1,
    fontSize: fontSize.md,
    color: colors.textMuted,
  },
  labelDone: {
    color: colors.text,
    fontWeight: '600',
  },
});
