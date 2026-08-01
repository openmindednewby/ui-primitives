import { deriveInitials, firstInitial } from './avatarInitials';

describe('deriveInitials', () => {
  it('takes the first letter of a single word', () => {
    expect(deriveInitials('Petros')).toBe('P');
  });

  it('takes the first letters of the first two words', () => {
    expect(deriveInitials('Acme Corp')).toBe('AC');
  });

  it('uses only the first two of three or more words', () => {
    expect(deriveInitials('Acme Corp Ltd')).toBe('AC');
  });

  it('returns the fallback for an empty name', () => {
    expect(deriveInitials('')).toBe('?');
  });

  it('returns the fallback for a whitespace-only name', () => {
    expect(deriveInitials('   ')).toBe('?');
  });

  it('collapses extra internal whitespace', () => {
    expect(deriveInitials('Acme     Corp')).toBe('AC');
  });

  it('trims leading and trailing whitespace', () => {
    expect(deriveInitials('  Acme Corp  ')).toBe('AC');
  });

  it('uppercases lowercase input', () => {
    expect(deriveInitials('john doe')).toBe('JD');
  });

  it('is unicode-safe for astral / emoji leading characters', () => {
    expect(deriveInitials('🎉 party')).toBe('🎉P');
  });

  it('uppercases accented letters', () => {
    expect(deriveInitials('ödön')).toBe('Ö');
  });
});

describe('firstInitial', () => {
  it('returns an empty string for empty input', () => {
    expect(firstInitial('')).toBe('');
  });

  it('uppercases the first grapheme', () => {
    expect(firstInitial('corp')).toBe('C');
  });
});
