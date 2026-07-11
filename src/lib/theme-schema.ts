import { z } from "zod";

// theme.json —— Stage A' 提取产物：目标站的"视觉基因"参数包。
// 值来自目标站测量（Firecrawl branding + vision），渲染永远走本模板组件。
// 与 pipeline/src/extract/theme-schema.ts 保持同步（跨 workspace 暂无共享包）。

// oklch 数值分量（不存字符串，便于 clamp 与对比度计算）
const oklchSchema = z.object({
  l: z.number().min(0).max(1),
  c: z.number().min(0).max(0.4),
  h: z.number().min(0).max(360),
});
export type Oklch = z.infer<typeof oklchSchema>;

// 精选开源字体池：next/font 无法运行时任意加载，"气质匹配"只能落在池内
export const FONT_POOL = [
  "archivo", // grotesque 工业标牌
  "inter", // neutral UI
  "poppins", // geometric rounded（大量国内企业站气质）
  "manrope", // modern soft
  "oswald", // condensed impact
  "source-serif", // editorial serif
  "work-sans", // humanist clean
  "barlow", // industrial friendly
  "rubik", // rounded friendly
  "jost", // geometric classic
] as const;
export const fontIdSchema = z.enum(FONT_POOL);
export type FontId = z.infer<typeof fontIdSchema>;

export const themeSchema = z.object({
  version: z.literal(1),
  source_url: z.string().optional(),
  palette: z.object({
    // 色相照抄、明度/饱和度按可读性修正（决策 2026-07-07）
    primary: oklchSchema,
    accent: oklchSchema.optional(),
    // 页面中性色（从目标站测得后归一）
    bg: oklchSchema,
    surface: oklchSchema,
    ink: oklchSchema,
    dark_band: oklchSchema.optional(), // 深色段落/顶栏的底色
  }),
  type: z.object({
    heading_font: fontIdSchema,
    body_font: fontIdSchema,
    heading_weight: z.number().min(400).max(900).default(700),
    heading_align: z.enum(["start", "center"]).default("start"),
    // px 测量值，渲染端 clamp
    scale: z.object({
      h1: z.number().min(28).max(96).default(48),
      body: z.number().min(13).max(19).default(16),
    }),
  }),
  shape: z.object({
    radius: z.number().min(0).max(24).default(2), // 卡片/输入框
    button: z.enum(["sharp", "rounded", "pill"]).default("sharp"),
    card: z.enum(["line", "panel", "shadow"]).default("line"),
  }),
  density: z.object({
    section_gap: z.enum(["tight", "normal", "loose"]).default("normal"),
    container: z.number().min(960).max(1440).default(1184),
  }),
  chrome: z.object({
    header: z.enum(["bar", "topbar"]).default("bar"),
    footer: z.enum(["titleblock", "columns"]).default("titleblock"),
  }),
  imagery: z.object({
    hero_treatment: z.enum(["editorial", "centered"]).default("editorial"),
  }),
});
export type Theme = z.infer<typeof themeSchema>;
