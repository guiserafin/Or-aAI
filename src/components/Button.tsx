import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { colors, fontFamily, radius, spacing } from '@/theme';
import { CornerMarks } from './CornerMarks';
import { Icon, type IconName } from './Icon';

type Variant = 'primary' | 'secondary' | 'ghost';

type Props = {
  label: string;
  onPress: () => void;
  variant?: Variant;
  icon?: IconName;
  iconPosition?: 'start' | 'end';
  /**
   * Marcas de registro do Industry — só o CTA principal de cada tela deve
   * usar isto ("um CTA por tela... é a única peça sólida da tela").
   */
  corners?: boolean;
  disabled?: boolean;
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
};

export function Button({
  label,
  onPress,
  variant = 'primary',
  icon,
  iconPosition = 'end',
  corners = false,
  disabled = false,
  loading = false,
  style,
}: Props) {
  const isDisabled = disabled || loading;
  const iconColor = textStyles[variant].color as string;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      accessibilityLabel={label}
      onPress={onPress}
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.base,
        styles[variant],
        pressed && !isDisabled && stylesPressed[variant],
        isDisabled && styles.disabled,
        style,
      ]}
    >
      {corners ? <CornerMarks color={iconColor} /> : null}
      {loading ? (
        <ActivityIndicator color={iconColor} size="small" />
      ) : (
        <View style={styles.content}>
          {icon && iconPosition === 'start' ? (
            <Icon name={icon} size={variant === 'ghost' ? 16 : 20} color={iconColor} />
          ) : null}
          <Text style={[styles.label, textStyles[variant]]} numberOfLines={1}>
            {label}
          </Text>
          {icon && iconPosition === 'end' ? (
            <Icon name={icon} size={variant === 'ghost' ? 16 : 20} color={iconColor} />
          ) : null}
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 52,
    borderRadius: radius.sm,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  primary: {
    minHeight: 58,
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  secondary: {
    minHeight: 48,
    backgroundColor: 'transparent',
    borderColor: colors.borderStrong,
  },
  ghost: {
    minHeight: 44,
    backgroundColor: 'transparent',
    borderColor: 'transparent',
  },
  disabled: {
    opacity: 0.45,
  },
  label: {
    fontFamily: fontFamily.condensedSemiBold,
    fontSize: 20,
    letterSpacing: 0.2,
  },
});

const stylesPressed = StyleSheet.create({
  primary: { backgroundColor: colors.primaryDark, borderColor: colors.primaryDark },
  secondary: { backgroundColor: 'rgba(29,31,32,0.06)' },
  ghost: { opacity: 0.7 },
});

const textStyles = StyleSheet.create({
  primary: { color: colors.background, fontSize: 20 },
  secondary: { color: colors.text, fontSize: 16 },
  ghost: { color: colors.primary, fontSize: 15, fontFamily: fontFamily.semiBold },
});
