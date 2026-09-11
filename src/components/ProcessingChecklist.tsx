import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';
import { colors, fontFamily } from '@/theme';
import { Icon } from './Icon';

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
          isLast={index === steps.length - 1}
        />
      ))}
    </View>
  );
}

function ChecklistRow({
  label,
  state,
  isLast,
}: {
  label: string;
  state: 'done' | 'active' | 'pending';
  isLast: boolean;
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
    <Animated.View
      style={[styles.row, !isLast && styles.rowDivider, { opacity, transform: [{ translateY }] }]}
    >
      <View style={styles.marker}>
        {state === 'done' ? (
          <Icon name="check" size={20} color={colors.primary} />
        ) : state === 'active' ? (
          <Icon name="loader" size={20} color={colors.primary} />
        ) : (
          <View style={styles.dot} />
        )}
      </View>
      <Text style={[styles.label, state !== 'pending' && styles.labelActive]}>{label}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  list: {
    marginTop: 4,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    minHeight: 52,
  },
  rowDivider: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  marker: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    width: 7,
    height: 7,
    backgroundColor: colors.borderStrong,
  },
  label: {
    flex: 1,
    fontFamily: fontFamily.regular,
    fontSize: 17,
    color: colors.textMuted,
  },
  labelActive: {
    color: colors.text,
  },
});
