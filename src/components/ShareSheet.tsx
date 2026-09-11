import React from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { colors, fontFamily, spacing } from '@/theme';
import { Button } from './Button';
import { Icon } from './Icon';

type Props = {
  visible: boolean;
  text: string;
  pendingAction: 'share' | 'pdf' | undefined;
  onClose: () => void;
  onSendText: () => void;
  onSendPdf: () => void;
};

/**
 * Folha de compartilhar: mostra o texto que o cliente vai receber antes de
 * enviar — o prestador confere o documento, não só dispara um share sheet
 * genérico do sistema.
 */
export function ShareSheet({ visible, text, pendingAction, onClose, onSendText, onSendPdf }: Props) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <Pressable style={StyleSheet.absoluteFill} accessibilityLabel="Fechar" onPress={onClose} />
        <View style={styles.sheet}>
          <View style={styles.header}>
            <Text style={styles.title}>Enviar para o cliente</Text>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Fechar"
              hitSlop={8}
              onPress={onClose}
              style={styles.closeButton}
            >
              <Icon name="x" size={22} color={colors.textMuted} />
            </Pressable>
          </View>

          <View style={styles.previewBox}>
            <Text style={styles.previewLabel}>Texto que o cliente recebe</Text>
            <ScrollView style={styles.previewScroll}>
              <Text style={styles.previewText}>{text}</Text>
            </ScrollView>
          </View>

          <View style={styles.actions}>
            <Button
              label="Enviar como texto"
              icon="share"
              onPress={onSendText}
              loading={pendingAction === 'share'}
              disabled={pendingAction === 'pdf'}
            />
            <Button
              label="Enviar o PDF"
              variant="secondary"
              icon="file-text"
              iconPosition="start"
              onPress={onSendPdf}
              loading={pendingAction === 'pdf'}
              disabled={pendingAction === 'share'}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(29,31,32,0.45)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: colors.background,
    borderTopWidth: 2,
    borderTopColor: colors.ink,
    padding: spacing.lg,
    paddingTop: spacing.lg + 2,
    paddingBottom: spacing.xl,
    gap: spacing.md + 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontFamily: fontFamily.condensedSemiBold,
    fontSize: 20,
    color: colors.text,
  },
  closeButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 4,
  },
  previewBox: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 4,
    padding: spacing.md + 2,
    maxHeight: 190,
  },
  previewLabel: {
    fontFamily: fontFamily.condensedSemiBold,
    fontSize: 10,
    letterSpacing: 2,
    textTransform: 'uppercase',
    color: colors.textMuted,
    marginBottom: spacing.sm,
  },
  previewScroll: {
    maxHeight: 150,
  },
  previewText: {
    fontFamily: fontFamily.regular,
    fontSize: 14,
    lineHeight: 22,
    color: colors.text,
  },
  actions: {
    gap: spacing.sm,
  },
});
