# Changelog

## 1.3.0 — 2026-08-02

- Added `<Avatar />` — a themed, circular monogram avatar (RN-web + native) for the finreg CRM (contacts table, contact-detail header, activity timeline) and any product needing a compact person/organisation identity.
  - Derives up to two uppercased initials from `name` (unicode/emoji safe; `"?"` fallback for empty names).
  - Deterministic background tint keyed off `name`, chosen from the app's `@dloizides/ui-feedback` theme swatches (`palette.*['500']` + `semantic.*['500']`); ink is whichever theme neutral (`colors.text` / `colors.background`) contrasts better. No hardcoded colours.
  - Optional `imageUrl` fills the circle with a photo; initials remain the fallback.
  - `testID` + `accessibilityLabel` (the name) + `accessibilityRole="image"`.
- Added `@dloizides/ui-feedback` and `react-native` as (optional) peer dependencies for the themed RN primitives; `<PoweredByFooter />` is unaffected.

## 1.0.0 — 2026-05-01

- Initial release.
- `<PoweredByFooter />` portfolio-wide attribution component with `hide` and `complianceMode` props.
