import React, { useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, fontFamily, spacing } from '@/theme';
import { Button } from './Button';
import { Field } from './Field';
import { Icon } from './Icon';

type Props = {
  visible: boolean;
  initialName: string;
  onSave: (name: string) => void;
  onClose: () => void;
};

/**
 * Único "cadastro" do MVP: um nome para o PDF/texto do orçamento não chegar
 * sem remetente. Perguntado uma vez, guardado no aparelho — nada de conta,
 * login ou perfil.
 */
export function ProviderNameModal({ visible, initialName, onSave, onClose }: Props) {
  const [name, setName] = useState(initialName);

  const save = () => {
    onSave(name);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <Pressable style={StyleSheet.absoluteFill} accessibilityLabel="Fechar" onPress={onClose} />
        <View style={styles.card}>
          <View style={styles.header}>
            <Text style={styles.title}>Seu nome</Text>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Fechar"
              hitSlop={8}
              onPress={onClose}
              style={styles.closeButton}
            >
              <Icon name="x" size={20} color={colors.textMuted} />
            </Pressable>
          </View>
          <Text style={styles.hint}>
            Aparece como prestador no orçamento — no PDF e na mensagem que o cliente recebe.
          </Text>
          <Field
            label="Seu nome"
            value={name}
            onChangeText={setName}
            placeholder="Ex.: Zé da Silva"
            autoCapitalize="words"
            autoFocus
            maxLength={80}
          />
          <Button label="Salvar" onPress={save} />
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
  card: {
    backgroundColor: colors.background,
    borderTopWidth: 2,
    borderTopColor: colors.ink,
    padding: spacing.lg,
    paddingBottom: spacing.xl,
    gap: spacing.md,
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
  hint: {
    fontFamily: fontFamily.regular,
    fontSize: 14,
    lineHeight: 19,
    color: colors.textMuted,
    marginTop: -spacing.sm,
  },
});
