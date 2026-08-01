# @dloizides/ui-primitives

Themable, brand-agnostic React UI primitives shared across every product Demetris ships.

The first export is the portfolio-wide attribution component:

## `<PoweredByFooter />`

Renders a discreet "built by dloizides.com" attribution. Pairs with the `Branding.AspNetCore` NuGet package on the backend to give every product/service a consistent operator attribution.

```tsx
import { PoweredByFooter } from '@dloizides/ui-primitives';

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <PoweredByFooter />
    </>
  );
}
```

### Props

| Prop | Type | Default | Purpose |
|------|------|---------|---------|
| `hide` | `boolean` | `false` | White-label opt-out. When true, renders nothing. |
| `complianceMode` | `'kids' \| 'standard'` | `'standard'` | When `'kids'`, renders nothing. Use this in COPPA/GDPR-K/Families Policy apps where external link-out is a compliance risk. |
| `href` | `string` | `'https://dloizides.com'` | Link target. |
| `hostText` | `string` | `'dloizides.com'` | The displayed host name. |
| `prefixText` | `string` | `'built by'` | Text before the host. |
| `opacity` | `number` | `0.65` | CSS opacity. |
| `fontSize` | `number` | `11` | CSS font size in px. |
| `testID` | `string` | `'powered-by-footer'` | testID for both the wrapper and the link (the link gets `${testID}-link`). |
| `className` | `string` | — | Optional class for layout overrides. |

### Compliance contract

- ✅ Web app pages, landing pages, legal pages, error pages.
- ❌ Apps targeting kids — set `complianceMode='kids'` to render nothing.
- ❌ Inside transactional emails — DO NOT include this component server-side; it interferes with deliverability.
- ❌ OAuth consent screens — Keycloak controls those.

See `project_built_by_attribution.md` in the project memory for the full policy.

## `<Avatar />`

A themed, circular monogram avatar (RN-web + native) for the finreg CRM — contacts table, contact-detail header, activity timeline — and anywhere a person or organisation needs a compact visual identity. Colours come from the app's `@dloizides/ui-feedback` `UiProvider` theme (`useUi`), so it re-tints automatically with the brand and in dark mode. Nothing is hardcoded.

```tsx
import { Avatar } from '@dloizides/ui-primitives';

// Monogram (deterministic tint from the name)
<Avatar name="Acme Corp Ltd" testID="contact-avatar" />   // -> "AC"

// Photo (initials remain the fallback)
<Avatar name="Petros Pan" size={64} imageUrl={contact.photoUrl} testID="contact-avatar" />
```

Mount a `UiProvider` (from `@dloizides/ui-feedback`) high in the app tree so the avatar reads the real theme.

### Props

| Prop | Type | Default | Purpose |
|------|------|---------|---------|
| `name` | `string` | — (required) | Full name. Derives the initials, the deterministic background tint, and the accessible label. |
| `size` | `number` | `40` | Diameter in px. The circle radius, initials font size, and image all scale from this. |
| `imageUrl` | `string` | — | Optional photo. When set (and non-empty) it fills the circle; the monogram stays the fallback. |
| `testID` | `string` | — | Test / accessibility hook. When provided, the inner image also gets `${testID}-image`. |

### Behaviour

- **Initials** — first letters of the first two words, uppercased (`"Acme Corp Ltd"` → `"AC"`, `"Petros"` → `"P"`). Unicode/emoji safe. Empty or whitespace-only names render `"?"`.
- **Colour** — the background is one of the theme's brand/semantic `500` swatches, chosen by hashing the name (same name → same tint). The ink is whichever theme neutral (`colors.text` / `colors.background`) contrasts better, so it stays legible in light and dark themes.
- **Accessibility** — `accessibilityRole="image"` + `accessibilityLabel={name}` (renders as `role="img"` + `aria-label` on the web).

## License

MIT
