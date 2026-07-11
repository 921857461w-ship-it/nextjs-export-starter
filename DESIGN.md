# Design — Precision Engineering

> Voice: German industrial catalog / machine nameplate / engineering drawing. Specs first. One shared design language; variety comes from content + blueprint structure only. Tokens stay locked; inject customer brand mainly via `--primary`.

## Color (OKLCH; three schemes share neutrals)

Strategy: **Restrained + one committed dark band** (`--dark-bg`). Page body is pure white; warmth comes from primary + type, not beige backgrounds.

### Neutrals (all schemes)

| Token | Value | Use |
|---|---|---|
| `--bg` | `oklch(1 0 0)` | Page background |
| `--surface` | `oklch(0.963 0.004 130)` | Panels / table zebra |
| `--surface-2` | `oklch(0.928 0.006 130)` | Deeper panels / table headers |
| `--ink` | `oklch(0.22 0.012 130)` | Body text (~14:1 on white) |
| `--muted` | `oklch(0.46 0.015 130)` | Secondary (≥4.5:1) |
| `--line` | `oklch(0.885 0.006 130)` | Hairline rules |
| `--dark-bg` | `oklch(0.235 0.018 140)` | Full-bleed dark sections |
| `--dark-surface` | `oklch(0.285 0.02 140)` | Dark panels |
| `--dark-ink` | `oklch(0.955 0.004 130)` | Text on dark |
| `--dark-muted` | `oklch(0.74 0.02 130)` | Secondary on dark |
| `--dark-line` | `oklch(0.38 0.02 140)` | Hairline on dark |

### Schemes (`data-scheme` on html)

| Scheme | `--primary` | `--accent` | Note |
|---|---|---|---|
| `machine` (default) | `oklch(0.50 0.13 132)` machine green | `oklch(0.55 0.17 42)` safety orange | Industrial default |
| `signal` | `oklch(0.45 0.10 250)` signal blue | `oklch(0.55 0.13 70)` deep amber | Blue logos |
| `oxide` | `oklch(0.46 0.12 28)` oxide red | `oklch(0.55 0.09 245)` steel blue | Warm logos |

Accent always L≤0.55 for white text contrast. Primary always uses white text. Accent ≤10% of UI (badges / hot CTAs). Customer injection: only `--primary` (L ∈ [0.40, 0.62], C ≤ 0.16).

## Type

- **Archivo** (variable `wght` + `wdth`): Latin. Display = wide 115% + 700–800. Labels = condensed 90%.
- **Noto Sans SC**: CJK fallback, `subsets: []`, `preload: false`.
- Numbers: `font-variant-numeric: tabular-nums`.
- Scale (≥1.25 modular): xs .75 / sm .875 / base 1 (lh 1.65) / lg 1.125 / xl 1.375 / 2xl 1.75 / 3xl 2.25 / display clamp(2.75rem, 2rem+3.5vw, 5rem).

## Shape & spacing

- Radius: **2px** only (engineering corners). Circles only for avatars / status dots.
- Structure via 1px hairlines, not card shadows.
- Section vertical rhythm: `clamp(4rem, 8vw, 6.5rem)`. Container max-width `74rem`.

## Signature motifs

1. Title-block framing (footer / hero corners).
2. Dimension rules (`.dim-rule`) under hero / stats.
3. Stamp numbers on StatsBar / ProcessTimeline.
4. Spec tables: condensed uppercase headers, tabular cells, zebra rows.
5. Dark graph-paper texture on FactoryGallery / CtaBand when needed.

## Motion

No JS animation libraries. CSS only: hero fade-rise once; interaction 150–200ms. Honor `prefers-reduced-motion`.

## Images

Product 4:3, factory 16:9, certs 3:4. Always `next/image` + explicit `sizes`. Hero `priority`. Production sites must use client-owned assets; demo media in `public/media` is for sample only.
