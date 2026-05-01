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

## License

MIT
