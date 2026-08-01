/**
 * Pure, deterministic colour resolution for {@link Avatar}.
 *
 * Every colour is READ FROM THE APP'S THEME (`@dloizides/ui-feedback` `UiTheme`) —
 * nothing is hardcoded. The background is one of the theme's brand/semantic swatches,
 * chosen by hashing the name so the same contact always gets the same tint. The ink
 * is whichever of the theme's two neutral colours (`colors.text` / `colors.background`)
 * contrasts better with that swatch, which keeps the monogram legible in both light and
 * dark themes without inventing any literal colour.
 */
import type { UiTheme } from '@dloizides/ui-feedback';

/** The one step every theme colour scale is guaranteed to define. */
const MAIN_STEP = '500';

/** Brand scales beyond the guaranteed `primary`, added to the palette when present. */
const ADDITIONAL_PALETTE_KEYS: readonly string[] = ['secondary', 'accent', 'tertiary'];

/** Semantic scales added to the palette when present (`error` is the guaranteed one). */
const SEMANTIC_KEYS: readonly string[] = ['info', 'success', 'warning', 'error'];

/** djb2-style string hash; multiplier chosen for good spread over short names. */
const HASH_MULTIPLIER = 33;

/** sRGB -> linear conversion constants (WCAG relative luminance). */
const CHANNEL_MAX = 255;
const SRGB_THRESHOLD = 0.03928;
const SRGB_LINEAR_DIVISOR = 12.92;
const SRGB_OFFSET = 0.055;
const SRGB_SCALE = 1.055;
const SRGB_EXPONENT = 2.4;
const REC709_R = 0.2126;
const REC709_G = 0.7152;
const REC709_B = 0.0722;

/** Above this relative luminance a swatch is treated as "light" and wants dark ink. */
const LUMINANCE_MIDPOINT = 0.5;

const SHORTHAND_HEX = /^[0-9a-fA-F]{3}$/;
const FULL_HEX = /^[0-9a-fA-F]{6}$/;
const HEX_RADIX = 16;
const CHANNEL_PAIR = 2;

export interface AvatarColors {
  backgroundColor: string;
  color: string;
}

/** Deterministic, non-negative hash of a string. Empty string -> 0. */
export function hashString(value: string): number {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash * HASH_MULTIPLIER + value.charCodeAt(i)) | 0;
  }
  return hash >>> 0;
}

/** Normalise a hex colour to a 6-char body (no `#`), expanding shorthand; `null` if invalid. */
function normalizeHex(hex: string): string | null {
  const body = hex.trim().replace('#', '');
  if (FULL_HEX.test(body)) {
    return body;
  }
  if (SHORTHAND_HEX.test(body)) {
    return body
      .split('')
      .map((channel) => channel + channel)
      .join('');
  }
  return null;
}

/** A single sRGB 8-bit channel converted to its linear-light value. */
function toLinear(channel8Bit: number): number {
  const channel = channel8Bit / CHANNEL_MAX;
  if (channel <= SRGB_THRESHOLD) {
    return channel / SRGB_LINEAR_DIVISOR;
  }
  return Math.pow((channel + SRGB_OFFSET) / SRGB_SCALE, SRGB_EXPONENT);
}

/**
 * WCAG relative luminance (0 = black, 1 = white) of a hex colour. An unparseable
 * value returns 0 (treated as darkest) so the ink picker still produces a result.
 */
export function luminance(hex: string): number {
  const body = normalizeHex(hex);
  if (body === null) {
    return 0;
  }
  const r = toLinear(parseInt(body.substring(0, CHANNEL_PAIR), HEX_RADIX));
  const g = toLinear(parseInt(body.substring(CHANNEL_PAIR, CHANNEL_PAIR * 2), HEX_RADIX));
  const b = toLinear(parseInt(body.substring(CHANNEL_PAIR * 2, CHANNEL_PAIR * 3), HEX_RADIX));
  return REC709_R * r + REC709_G * g + REC709_B * b;
}

/**
 * Every present swatch (`palette.*['500']` + `semantic.*['500']`), starting with the
 * guaranteed `primary`, so the returned array is always non-empty.
 */
export function collectSwatches(theme: UiTheme): string[] {
  const swatches: string[] = [theme.palette.primary[MAIN_STEP]];

  ADDITIONAL_PALETTE_KEYS.forEach((key) => {
    const scale = theme.palette[key];
    if (scale !== undefined) {
      swatches.push(scale[MAIN_STEP]);
    }
  });

  SEMANTIC_KEYS.forEach((key) => {
    const scale = theme.semantic[key];
    if (scale !== undefined) {
      swatches.push(scale[MAIN_STEP]);
    }
  });

  return swatches;
}

/** The neutral ink (from the theme) that contrasts better with `background`. */
function pickInk(background: string, theme: UiTheme): string {
  const backgroundLuminance = luminance(background);
  const textLuminance = luminance(theme.colors.text);
  const surfaceLuminance = luminance(theme.colors.background);

  const darkerInk = textLuminance <= surfaceLuminance ? theme.colors.text : theme.colors.background;
  const lighterInk = textLuminance <= surfaceLuminance ? theme.colors.background : theme.colors.text;

  return backgroundLuminance > LUMINANCE_MIDPOINT ? darkerInk : lighterInk;
}

/**
 * Resolve the deterministic background tint and the contrasting ink for a name.
 * Same name + same theme always yields the same pair.
 */
export function resolveAvatarColors(name: string, theme: UiTheme): AvatarColors {
  const swatches = collectSwatches(theme);
  const index = hashString(name) % swatches.length;

  let backgroundColor = theme.palette.primary[MAIN_STEP];
  swatches.forEach((swatch, i) => {
    if (i === index) {
      backgroundColor = swatch;
    }
  });

  return { backgroundColor, color: pickInk(backgroundColor, theme) };
}
