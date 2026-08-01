/**
 * Pure initials derivation for {@link Avatar}. Kept dependency-free and framework-free
 * so it can be unit-tested directly (no renderer, no theme). Unicode-safe: it reads
 * the first CODE POINT of a word, so a name that starts with an emoji or an astral
 * character yields that whole glyph rather than half a surrogate pair.
 */

/** Shown when a name has no usable letters (empty / whitespace-only). */
const FALLBACK_INITIAL = '?';

/** At most two initials — the first letters of the first two words. */
const MAX_INITIALS = 2;

/** Splits on any run of whitespace. */
const WHITESPACE = /\s+/;

/**
 * The uppercased first grapheme of a word. Returns an empty string for an empty
 * input (the only way `codePointAt(0)` is `undefined`); {@link deriveInitials} never
 * hands it an empty word, but the guard keeps the function total on its own.
 */
export function firstInitial(word: string): string {
  const codePoint = word.codePointAt(0);
  if (codePoint === undefined) {
    return '';
  }
  return String.fromCodePoint(codePoint).toUpperCase();
}

/**
 * Derive up to two uppercased initials from a name.
 *
 * - `"Petros"` -> `"P"`
 * - `"Acme Corp"` -> `"AC"`
 * - `"Acme Corp Ltd"` -> `"AC"` (only the first two words)
 * - `""` / `"   "` -> `"?"`
 *
 * Extra internal whitespace collapses and leading/trailing whitespace is trimmed.
 */
export function deriveInitials(name: string): string {
  const words = name
    .trim()
    .split(WHITESPACE)
    .filter((word) => word.length > 0);

  if (words.length === 0) {
    return FALLBACK_INITIAL;
  }

  return words.slice(0, MAX_INITIALS).map(firstInitial).join('');
}
