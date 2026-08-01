import type { UiTheme } from '@dloizides/ui-feedback';

import { collectSwatches, hashString, luminance, resolveAvatarColors } from './avatarColor';

// A full theme with several brand + semantic swatches, so the palette has variety.
const fullTheme: UiTheme = {
  colors: {
    background: '#ffffff',
    surface: '#eeeeee',
    surfaceElevated: '#ffffff',
    text: '#111111',
    textSecondary: '#666666',
    border: '#cccccc',
  },
  palette: {
    primary: { '500': '#005f73' },
    secondary: { '500': '#94d2bd' },
    accent: { '500': '#ee9b00' },
  },
  semantic: {
    error: { '500': '#ae2012' },
    success: { '500': '#0a9396' },
    warning: { '500': '#ca6702' },
    info: { '500': '#0077b6' },
  },
};

// The bare minimum every theme guarantees: primary + error only.
const minimalTheme: UiTheme = {
  colors: fullTheme.colors,
  palette: { primary: { '500': '#005f73' } },
  semantic: { error: { '500': '#ae2012' } },
};

describe('hashString', () => {
  it('is deterministic', () => {
    expect(hashString('Acme')).toBe(hashString('Acme'));
  });

  it('differs for different strings', () => {
    expect(hashString('Acme')).not.toBe(hashString('Corp'));
  });

  it('returns 0 for the empty string', () => {
    expect(hashString('')).toBe(0);
  });

  it('is always non-negative', () => {
    expect(hashString('a very long ~!@#$%^&* string with symbols')).toBeGreaterThanOrEqual(0);
  });
});

describe('luminance', () => {
  it('ranks white brighter than black', () => {
    expect(luminance('#ffffff')).toBeGreaterThan(luminance('#000000'));
  });

  it('treats black as ~0', () => {
    expect(luminance('#000000')).toBeCloseTo(0);
  });

  it('expands shorthand hex', () => {
    expect(luminance('#fff')).toBeCloseTo(luminance('#ffffff'));
  });

  it('returns 0 for an unparseable colour', () => {
    expect(luminance('not-a-color')).toBe(0);
  });
});

describe('collectSwatches', () => {
  it('gathers every present palette and semantic swatch', () => {
    const swatches = collectSwatches(fullTheme);
    expect(swatches).toContain('#005f73'); // primary
    expect(swatches).toContain('#94d2bd'); // secondary
    expect(swatches).toContain('#ee9b00'); // accent
    expect(swatches).toContain('#ae2012'); // error
    expect(swatches.length).toBeGreaterThan(1);
  });

  it('degrades gracefully to the guaranteed swatches', () => {
    expect(collectSwatches(minimalTheme)).toEqual(['#005f73', '#ae2012']);
  });
});

describe('resolveAvatarColors', () => {
  it('is deterministic for the same name and theme', () => {
    expect(resolveAvatarColors('Acme', fullTheme)).toEqual(resolveAvatarColors('Acme', fullTheme));
  });

  it('varies the background across different names', () => {
    const names = ['Acme', 'Corp', 'Petros', 'Zeta', 'Alpha', 'Delta'];
    const backgrounds = new Set(names.map((name) => resolveAvatarColors(name, fullTheme).backgroundColor));
    expect(backgrounds.size).toBeGreaterThan(1);
  });

  it('always picks a background that exists in the theme palette', () => {
    const swatches = collectSwatches(fullTheme);
    expect(swatches).toContain(resolveAvatarColors('Whatever', fullTheme).backgroundColor);
  });

  it('uses the dark neutral ink on a light swatch', () => {
    const lightSwatches: UiTheme = {
      ...fullTheme,
      palette: { primary: { '500': '#fff59d' } },
      semantic: { error: { '500': '#fff9c4' } },
    };
    expect(resolveAvatarColors('x', lightSwatches).color).toBe('#111111'); // theme text
  });

  it('uses the light neutral ink on a dark swatch', () => {
    const darkSwatches: UiTheme = {
      ...fullTheme,
      palette: { primary: { '500': '#00202e' } },
      semantic: { error: { '500': '#001018' } },
    };
    expect(resolveAvatarColors('x', darkSwatches).color).toBe('#ffffff'); // theme background
  });

  it('respects an inverted (dark-mode) theme when choosing the ink', () => {
    // Dark mode: text is light, background is dark. On a light swatch the darker ink
    // is now the theme BACKGROUND, proving the picker reads the theme, not literals.
    const darkModeTheme: UiTheme = {
      colors: {
        background: '#111111',
        surface: '#222222',
        surfaceElevated: '#222222',
        text: '#ffffff',
        textSecondary: '#aaaaaa',
        border: '#333333',
      },
      palette: { primary: { '500': '#94d2bd' } },
      semantic: { error: { '500': '#a8dadc' } },
    };
    expect(resolveAvatarColors('x', darkModeTheme).color).toBe('#111111'); // theme background
  });
});
