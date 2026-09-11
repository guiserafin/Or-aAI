/**
 * Design tokens do OrçaAI.
 *
 * A intenção visual é "ferramenta de trabalho": papel branco, tipografia legível,
 * muito espaço em branco e um único tom de destaque para os CTAs.
 * Sem gradientes, glassmorphism ou qualquer coisa que pareça "app de IA genérico".
 */

export const colors = {
  /** Fundo geral das telas. */
  background: '#F5F6F8',
  /** Cards e folhas de documento. */
  surface: '#FFFFFF',
  /** Fundo sutil para blocos de apoio (exemplos, dicas). */
  surfaceMuted: '#EFF1F4',

  /** Texto principal. */
  text: '#14181F',
  /** Texto secundário / labels. */
  textMuted: '#5C6673',
  /** Texto muito discreto (rodapés, placeholders). */
  textSubtle: '#8A94A1',

  border: '#E1E5EA',
  borderStrong: '#CBD2DA',

  /** Verde de trabalho: usado em CTAs e valores. */
  primary: '#0B6E4F',
  primaryDark: '#095A41',
  primarySoft: '#E6F2ED',

  /** Avisos (ex.: "revise os valores antes de enviar"). */
  warning: '#8A5A00',
  warningSoft: '#FDF3E2',

  danger: '#B42318',
  dangerSoft: '#FDECEA',

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

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  pill: 999,
} as const;

export const fontSize = {
  xs: 12,
  sm: 13,
  md: 15,
  lg: 17,
  xl: 20,
  xxl: 26,
  xxxl: 30,
} as const;

/**
 * Sombra discreta e consistente entre iOS/Android/web.
 * Usada com moderação — cards quase sempre usam apenas borda.
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
