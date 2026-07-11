import { z } from "zod";

// ============ blueprint.json（Stage A 产物：只有结构，没有内容/视觉） ============

export const SECTION_TYPES = [
  "hero",
  "stats_bar",
  "product_grid",
  "category_nav",
  "cert_wall",
  "factory_gallery",
  "process_timeline",
  "advantage_grid",
  "testimonial_strip",
  "faq",
  "cta_band",
  "inquiry_form",
  "contact_block",
  // 补充型 section：About 散文块（对标站 about 页散文是普遍结构，15 个首发组件之外的最小补充）
  "about_text",
] as const;

export const sectionSpecSchema = z.object({
  type: z.enum(SECTION_TYPES),
  hints: z.record(z.string(), z.unknown()).default({}),
});
export type SectionSpec = z.infer<typeof sectionSpecSchema>;

// 站架版式（header/footer 形态）：从参考站抽取的版式参数，非受保护表达
export const chromeSchema = z.object({
  header: z.enum(["bar", "topbar"]).default("bar"),
  footer: z.enum(["titleblock", "columns"]).default("titleblock"),
});

export const blueprintSchema = z.object({
  version: z.literal(1),
  chrome: chromeSchema.optional(), // 缺省时由 theme.chrome 驱动
  pages: z
    .array(
      z.object({
        id: z.string(),
        label_en: z.string(),
        label_zh: z.string(),
        nav: z.boolean().default(true),
      })
    )
    .min(1),
  sections: z.record(z.string(), z.array(sectionSpecSchema)),
  notes: z.string().optional(),
});
export type Blueprint = z.infer<typeof blueprintSchema>;

// ============ content_pack.json（Stage B 产物：全部内容，双语字段 *_en / *_zh） ============

const specPair = z.tuple([z.string(), z.string()]);

export const contentPackSchema = z.object({
  version: z.literal(1),
  company: z.object({
    name_en: z.string(),
    name_zh: z.string(),
    // 头部/紧凑场景用短名（全名进页脚与 JSON-LD）
    short_name_en: z.string().optional(),
    short_name_zh: z.string().optional(),
    tagline_en: z.string().optional(),
    tagline_zh: z.string().optional(),
    founded: z.number().optional(),
    employees: z.string().optional(),
    about_en: z.string(),
    about_zh: z.string().optional(),
    whatsapp: z.string(),
    email: z.string(),
    phone: z.string().optional(),
    address_en: z.string(),
    address_zh: z.string().optional(),
    map_image: z.string().optional(),
  }),
  hero: z
    .object({
      headline_en: z.string(),
      headline_zh: z.string().optional(),
      subline_en: z.string().optional(),
      subline_zh: z.string().optional(),
      image: z.string(),
      badges: z.array(z.string()).max(4).default([]),
    })
    .optional(),
  stats: z
    .array(
      z.object({
        label_en: z.string(),
        label_zh: z.string().optional(),
        value: z.string(),
      })
    )
    .default([]),
  categories: z
    .array(
      z.object({
        id: z.string(),
        name_en: z.string(),
        name_zh: z.string().optional(),
        image: z.string().optional(),
        children: z
          .array(
            z.object({
              id: z.string(),
              name_en: z.string(),
              name_zh: z.string().optional(),
            })
          )
          .default([]),
      })
    )
    .default([]),
  products: z.array(
    z.object({
      id: z.string(),
      category: z.string(),
      name_en: z.string(),
      name_zh: z.string().optional(),
      model: z.string().optional(),
      specs: z.array(specPair),
      specs_zh: z.array(specPair).optional(),
      images: z.array(z.string()).min(1),
      moq: z.string().optional(),
    })
  ),
  certs: z.array(z.object({ type: z.string(), image: z.string() })).default([]),
  gallery: z
    .array(
      z.object({
        src: z.string(),
        alt_en: z.string(),
        alt_zh: z.string().optional(),
      })
    )
    .default([]),
  process: z
    .array(
      z.object({
        title_en: z.string(),
        title_zh: z.string().optional(),
        desc_en: z.string().optional(),
        desc_zh: z.string().optional(),
      })
    )
    .default([]),
  advantages: z
    .array(
      z.object({
        icon: z.string(),
        title_en: z.string(),
        title_zh: z.string().optional(),
        desc_en: z.string(),
        desc_zh: z.string().optional(),
      })
    )
    .default([]),
  testimonials: z
    .array(
      z.object({
        quote_en: z.string(),
        quote_zh: z.string().optional(),
        author: z.string(),
        country: z.string().optional(),
      })
    )
    .default([]),
  faq: z
    .array(
      z.object({
        q_en: z.string(),
        a_en: z.string(),
        q_zh: z.string().optional(),
        a_zh: z.string().optional(),
      })
    )
    .default([]),
});
export type ContentPack = z.infer<typeof contentPackSchema>;

// ============ site.json（实例配置：new-site.ts 注入） ============

export const siteConfigSchema = z.object({
  site_id: z.string(),
  scheme: z.enum(["machine", "signal", "oxide"]).default("machine"),
  base_url: z.string().url(),
});
export type SiteConfig = z.infer<typeof siteConfigSchema>;
