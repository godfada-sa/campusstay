// Supabase Auth expects E.164. Students are most likely to type a local
// Ghana number, so accept both forms and store one.
export function normalizeGhanaPhone(input: string): string | null {
  const cleaned = input.replace(/[^\d+]/g, "");
  if (!cleaned) return null;

  if (cleaned.startsWith("+")) {
    const digits = cleaned.slice(1);
    if (!/^\d{9,15}$/.test(digits)) return null;
    if (digits.startsWith("233")) {
      return /^233[2-5]\d{8}$/.test(digits) ? `+${digits}` : null;
    }
    return `+${digits}`;
  }

  if (cleaned.startsWith("233")) {
    return /^233[2-5]\d{8}$/.test(cleaned) ? `+${cleaned}` : null;
  }

  if (cleaned.startsWith("0")) {
    return /^0[2-5]\d{8}$/.test(cleaned) ? `+233${cleaned.slice(1)}` : null;
  }

  if (/^[2-5]\d{8}$/.test(cleaned)) {
    return `+233${cleaned}`;
  }

  return null;
}
