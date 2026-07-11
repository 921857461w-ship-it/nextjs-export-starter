import themeJson from "../../site/theme.json";
import { themeSchema, type Oklch, type Theme } from "./theme-schema";

// 构建时校验；不合法 → 构建失败
export const theme: Theme = themeSchema.parse(themeJson);

const fmt = (c: Oklch) => `oklch(${c.l.toFixed(3)} ${c.c.toFixed(3)} ${c.h.toFixed(1)})`;

// oklch L 的近似相对亮度（WCAG 对比度用）：Y ≈ L^3（OKLab L ~ Y^(1/3)）
const relLum = (l: number) => l ** 3;
const contrast = (l1: number, l2: number) => {
  const [a, b] = [relLum(l1), relLum(l2)].sort((x, y) => y - x);
  return (a + 0.05) / (b + 0.05);
};

// 可读性护栏（决策：色相照抄，明度/饱和度按可读性修正）
function guard(t: Theme) {
  const p = { ...t.palette, primary: { ...t.palette.primary } };
  // primary 上要放白字：L∈[0.35,0.62]，C≤0.17
  p.primary.l = Math.min(0.62, Math.max(0.35, p.primary.l));
  p.primary.c = Math.min(0.17, p.primary.c);
  if (p.accent) {
    p.accent = { ...p.accent };
    p.accent.l = Math.min(0.58, Math.max(0.35, p.accent.l));
    p.accent.c = Math.min(0.17, p.accent.c);
  }
  // 正文对底色 ≥ 7:1，不够就把 ink 压深
  p.ink = { ...p.ink };
  while (contrast(p.ink.l, p.bg.l) < 7 && p.ink.l > 0.12) p.ink.l -= 0.02;
  return p;
}

const palette = guard(theme);

const RADIUS_BTN = { sharp: "2px", rounded: "8px", pill: "999px" } as const;
const GAP = { tight: 0.78, normal: 1, loose: 1.22 } as const;

// 注入 <html> 的 style：inline 自定义属性优先级高于 stylesheet 里的 :root 默认值
export function themeCssVars(): Record<string, string> {
  const darkBand = palette.dark_band ?? { l: 0.235, c: 0.018, h: palette.primary.h };
  const muted: Oklch = { l: 0.46, c: Math.min(0.02, palette.primary.c / 4), h: palette.primary.h };
  const line: Oklch = { l: 0.885, c: 0.006, h: palette.primary.h };
  return {
    "--primary": fmt(palette.primary),
    "--accent": fmt(palette.accent ?? { ...palette.primary, l: 0.55, c: 0.15 }),
    "--primary-bright": fmt({ ...palette.primary, l: 0.76, c: Math.min(0.11, palette.primary.c) }),
    "--raw-bg": fmt(palette.bg),
    "--raw-surface": fmt(palette.surface),
    "--raw-ink": fmt(palette.ink),
    "--raw-muted": fmt(muted),
    "--raw-line": fmt(line),
    "--raw-dark-bg": fmt(darkBand),
    "--raw-dark-surface": fmt({ ...darkBand, l: darkBand.l + 0.05 }),
    "--raw-dark-line": fmt({ ...darkBand, l: darkBand.l + 0.145 }),
    "--radius": `${theme.shape.radius}px`,
    "--radius-btn": RADIUS_BTN[theme.shape.button],
    "--container-w": `${theme.density.container / 16}rem`,
    "--gap-factor": String(GAP[theme.density.section_gap]),
    "--heading-weight": String(theme.type.heading_weight),
    "--fs-body": `${theme.type.scale.body / 16}rem`,
    "--fs-display-max": `${Math.min(96, theme.type.scale.h1 * 1.15) / 16}rem`,
    // hero 遮罩：深色带的色相压暗（目标站常用品牌色调蒙版而非纯黑）
    "--hero-scrim": fmt({ l: Math.min(0.22, darkBand.l), c: Math.min(0.05, darkBand.c + 0.02), h: darkBand.h }),
  };
}

// blueprint 未显式指定时的版式默认值（theme 驱动）
export const themeDefaults = {
  headingAlign: theme.type.heading_align,
  cardStyle: theme.shape.card === "shadow" ? "panel" : theme.shape.card,
  heroVariant: theme.imagery.hero_treatment,
  ctaVariant: theme.type.heading_align === "center" ? "centered" : "split",
  chrome: theme.chrome,
} as const;
