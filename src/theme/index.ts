/**
 * Design tokens do OrçaAI — direção "Obra" (design system Industry).
 *
 * A intenção visual é "ferramenta de trabalho", não "app de IA": desenho
 * técnico sobre papel — cantos retos, réguas finas de 1 px, um único tom de
 * aço nos CTAs e a folha do orçamento como a única superfície com preenchimento.
 * Sem gradiente, glassmorphism, mascote ou roxo de IA em lugar nenhum.
 */

export const colors = {
  /** Fundo geral das telas. */
  background: '#F2F2F3',
  /** Cards, folhas de documento e campos. */
  surface: '#FFFFFF',
  /** Fundo sutil para blocos de apoio (bolha de mensagem, linhas pressionadas). */
  surfaceMuted: '#E9E9EA',

  /** Texto principal. */
  text: '#1D1F20',
  /** Texto secundário / labels — ~6.6:1 sobre o fundo, legível no sol. */
  textMuted: '#5D5D60',

  border: '#D4D4D7',
  /** Borda de campos de formulário. */
  borderStrong: '#B7B7BA',
  /** Régua fina entre itens de uma lista/documento. */
  divider: '#E7E7EA',

  /** Aço escuro do Industry: usado só nos CTAs, links e valores de destaque. */
  primary: '#416180',
  primaryDark: '#2C455D',
  primarySoft: '#EEF6FF',
  primarySoftBorder: '#B5D9FD',

  /** Avisos (ex.: "revise os valores antes de enviar"). */
  warning: '#8A5A00',
  warningText: '#5C3E05',
  warningSoft: '#FDF3E2',
  warningSoftBorder: '#E3CDA1',

  danger: '#B42318',
  dangerSoft: '#FDECEA',

  /** Cor de tinta usada nas marcas de registro e réguas grossas. */
  ink: '#1D1F20',

  white: '#FFFFFF',
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 48,
} as const;

/** O Industry é quase todo cantos retos — só um raio pequeno, em tudo. */
export const radius = {
  none: 0,
  sm: 4,
} as const;

export const fontSize = {
  xs: 10,
  sm: 13,
  md: 15,
  lg: 17,
  xl: 20,
  xxl: 26,
  xxxl: 31,
  display: 36,
} as const;

/**
 * Barlow (corpo) + Barlow Condensed (títulos e rótulos em caixa alta) — o
 * condensado faz nomes e valores longos caberem a 320 px sem diminuir o corpo.
 * Carregadas via `useFonts` em `app/_layout.tsx`; os nomes vêm do pacote
 * @expo-google-fonts.
 */
export const fontFamily = {
  regular: 'Barlow_400Regular',
  medium: 'Barlow_500Medium',
  semiBold: 'Barlow_600SemiBold',
  bold: 'Barlow_700Bold',
  condensedMedium: 'BarlowCondensed_500Medium',
  condensedSemiBold: 'BarlowCondensed_600SemiBold',
} as const;

export const fontsToLoad = {
  Barlow_400Regular: require('@expo-google-fonts/barlow/400Regular/Barlow_400Regular.ttf'),
  Barlow_500Medium: require('@expo-google-fonts/barlow/500Medium/Barlow_500Medium.ttf'),
  Barlow_600SemiBold: require('@expo-google-fonts/barlow/600SemiBold/Barlow_600SemiBold.ttf'),
  Barlow_700Bold: require('@expo-google-fonts/barlow/700Bold/Barlow_700Bold.ttf'),
  BarlowCondensed_500Medium: require('@expo-google-fonts/barlow-condensed/500Medium/BarlowCondensed_500Medium.ttf'),
  BarlowCondensed_600SemiBold: require('@expo-google-fonts/barlow-condensed/600SemiBold/BarlowCondensed_600SemiBold.ttf'),
} as const;

/**
 * Sombra discreta e consistente entre iOS/Android/web.
 * Usada com moderação — quase tudo aqui é desenho de linha, não elevação.
 */
export const shadow = {
  card: {
    shadowColor: '#0B1220',
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
} as const;
