import { Platform, Share } from 'react-native';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import type { Budget } from '@/types/budget';
import { buildBudgetText } from './budgetText';
import { buildBudgetHtml } from './budgetHtml';

export type ShareResult = 'shared' | 'dismissed';

/** Compartilha o orçamento como texto (WhatsApp, e-mail, o que o sistema oferecer). */
export async function shareBudgetText(budget: Budget): Promise<ShareResult> {
  const message = buildBudgetText(budget);

  if (Platform.OS === 'web') {
    const webShare = (globalThis as { navigator?: Navigator }).navigator;
    if (webShare?.share) {
      await webShare.share({ title: `Orçamento #${budget.number}`, text: message });
      return 'shared';
    }
    await webShare?.clipboard?.writeText(message);
    return 'shared';
  }

  const result = await Share.share({ message }, { dialogTitle: `Orçamento #${budget.number}` });
  return result.action === Share.dismissedAction ? 'dismissed' : 'shared';
}

/** Gera o PDF e abre a folha de compartilhamento do sistema. */
export async function shareBudgetPdf(budget: Budget): Promise<ShareResult> {
  const html = buildBudgetHtml(budget);

  if (Platform.OS === 'web') {
    await Print.printAsync({ html });
    return 'shared';
  }

  const { uri } = await Print.printToFileAsync({ html, base64: false });

  if (!(await Sharing.isAvailableAsync())) {
    // Sem app de compartilhamento: o PDF continua salvo e o caminho é informado.
    throw new Error(`PDF gerado em ${uri}, mas o compartilhamento não está disponível.`);
  }

  await Sharing.shareAsync(uri, {
    mimeType: 'application/pdf',
    dialogTitle: `Orçamento #${budget.number}`,
    UTI: 'com.adobe.pdf',
  });

  return 'shared';
}
