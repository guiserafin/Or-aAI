/** Gera um id local simples. Não precisa ser criptográfico no MVP. */
export function createId(prefix = 'b'): string {
  const random = Math.random().toString(36).slice(2, 8);
  return `${prefix}_${Date.now().toString(36)}${random}`;
}
