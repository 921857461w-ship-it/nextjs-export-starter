import type { SectionSpec } from "./site-schema";
import {
  blueprint,
  content,
  mediaUrl,
  pick,
  productHref,
  type Locale,
} from "./site-data";
import { themeDefaults } from "./theme";

type T = (key: string, values?: Record<string, string | number>) => string;
type Ctx = { locale: Locale; t: T };

// hints 只允许携带结构参数（数量/列数/分组），不允许携带文案——铁律 2 的代码化。
function num(hints: Record<string, unknown>, key: string): number | undefined {
  const v = hints[key];
  return typeof v === "number" ? v : undefined;
}

function str(hints: Record<string, unknown>, key: string): string | undefined {
  const v = hints[key];
  return typeof v === "string" ? v : undefined;
}

// 版式参数优先级：blueprint hints（逐 section 覆盖）> theme 默认（整站，从目标站提取）。
// 它们是通用版式语汇，属于"结构骨架"抽取范围，不是受保护的视觉表达。
function layout(hints: Record<string, unknown>) {
  return {
    headingAlign: str(hints, "heading_align") ?? themeDefaults.headingAlign,
    variant: str(hints, "variant"),
    cardStyle: str(hints, "card_style") ?? themeDefaults.cardStyle,
  };
}

// blueprint.sections[page][i] + content_pack → 组件 props。
// 返回 null = 该 section 无内容素材，跳过不渲染（永不阻塞交付）。
export function buildSectionProps(
  spec: SectionSpec,
  { locale, t }: Ctx
): Record<string, unknown> | null {
  const { company } = content;
  const hints = spec.hints;

  switch (spec.type) {
    case "hero": {
      const hero = content.hero;
      if (!hero) return null;
      return {
        variant: layout(hints).variant ?? themeDefaults.heroVariant,
        headline: pick(hero, "headline", locale),
        subline: pick(hero, "subline", locale) || undefined,
        image: mediaUrl(hero.image),
        imageAlt: pick(company, "name", locale),
        badges: hero.badges,
        ctas:
          (num(hints, "cta_count") ?? 2) >= 2
            ? [
                { label: t("getQuote"), href: "/contact#inquiry" },
                { label: t("viewProducts"), href: "/products" },
              ]
            : [{ label: t("getQuote"), href: "/contact#inquiry" }],
      };
    }

    case "stats_bar": {
      if (content.stats.length < 2) return null;
      return {
        stats: content.stats
          .slice(0, num(hints, "count") ?? 6)
          .map((s) => ({ label: pick(s, "label", locale), value: s.value })),
      };
    }

    case "product_grid": {
      const count = num(hints, "count");
      // hot：每类目取一个，避免与主网格开头重复
      const pool =
        hints.label === "hot"
          ? content.categories
              .map((c) => content.products.find((p) => p.category === c.id))
              .filter((p): p is NonNullable<typeof p> => Boolean(p))
              .reverse()
          : content.products;
      const products = (count ? pool.slice(0, count) : pool).map((p) => ({
        id: p.id,
        name: pick(p, "name", locale),
        model: p.model,
        image: mediaUrl(p.images[0]),
        href: productHref(p.id),
        category: p.category,
      }));
      if (products.length === 0) return null;
      return {
        heading:
          hints.label === "hot" ? t("hotProducts") : t("productRange"),
        headingAlign: layout(hints).headingAlign,
        cardStyle: layout(hints).cardStyle,
        columns: num(hints, "columns") ?? 3,
        groupedByCategory: hints.grouped_by_category === true,
        categories: content.categories.map((c) => ({
          id: c.id,
          name: pick(c, "name", locale),
        })),
        products,
      };
    }

    case "category_nav": {
      if (content.categories.length === 0) return null;
      return {
        heading: t("categories"),
        headingAlign: layout(hints).headingAlign,
        categories: content.categories.map((c) => ({
          id: c.id,
          name: pick(c, "name", locale),
          href: `/products#cat-${c.id}`,
          image: c.image ? mediaUrl(c.image) : undefined,
          children: c.children.map((ch) => ({
            id: ch.id,
            name: pick(ch, "name", locale),
            href: `/products#cat-${c.id}`,
          })),
        })),
      };
    }

    case "cert_wall": {
      if (content.certs.length === 0) return null;
      return {
        heading: t("certifications"),
        headingAlign: layout(hints).headingAlign,
        certs: content.certs.map((c) => ({
          type: c.type,
          image: mediaUrl(c.image),
        })),
      };
    }

    case "factory_gallery": {
      if (content.gallery.length === 0) return null;
      return {
        heading: t("insideFactory"),
        headingAlign: layout(hints).headingAlign,
        images: content.gallery
          .slice(0, num(hints, "count") ?? 12)
          .map((g) => ({ src: mediaUrl(g.src), alt: pick(g, "alt", locale) })),
      };
    }

    case "process_timeline": {
      if (content.process.length < 3) return null;
      return {
        heading: t("howWeWork"),
        headingAlign: layout(hints).headingAlign,
        steps: content.process.slice(0, num(hints, "steps") ?? 9).map((s) => ({
          title: pick(s, "title", locale),
          desc: pick(s, "desc", locale) || undefined,
        })),
      };
    }

    case "advantage_grid": {
      if (content.advantages.length === 0) return null;
      return {
        heading: t("whyUs"),
        headingAlign: layout(hints).headingAlign,
        variant:
          layout(hints).variant ??
          (themeDefaults.headingAlign === "center" ? "tiles" : "rows"),
        items: content.advantages.slice(0, num(hints, "count") ?? 6).map((a) => ({
          icon: a.icon,
          title: pick(a, "title", locale),
          desc: pick(a, "desc", locale),
        })),
      };
    }

    case "testimonial_strip": {
      // 有素材才启用
      if (content.testimonials.length === 0) return null;
      return {
        heading: t("buyersSay"),
        headingAlign: layout(hints).headingAlign,
        testimonials: content.testimonials.map((x) => ({
          quote: pick(x, "quote", locale),
          author: x.author,
          country: x.country,
        })),
      };
    }

    case "faq": {
      if (content.faq.length === 0) return null;
      return {
        heading: t("faqHeading"),
        items: content.faq.map((f) => ({
          q: pick(f, "q", locale),
          a: pick(f, "a", locale),
        })),
      };
    }

    case "cta_band":
      return {
        variant: layout(hints).variant ?? themeDefaults.ctaVariant,
        headline: t("ctaHeadline"),
        cta: { label: t("ctaButton"), href: "/contact#inquiry" },
      };

    case "inquiry_form":
      return {};

    case "contact_block":
      return {
        heading: t("contactUs"),
        whatsapp: company.whatsapp,
        email: company.email,
        phone: company.phone,
        address: pick(company, "address", locale),
        mapImage: company.map_image ? mediaUrl(company.map_image) : undefined,
      };

    case "about_text": {
      // intent=catalog：产品目录导语（对标站首页常见的 SEO 文字块）
      if (hints.intent === "catalog") {
        return {
          variant: layout(hints).variant,
          heading: t("catalogIntro", {
            name: pick(company, "short_name", locale) || pick(company, "name", locale),
          }),
          body: pick(company, "about", locale),
          facts: [],
        };
      }
      return {
        variant: layout(hints).variant,
        heading: pick(company, "name", locale),
        body: pick(company, "about", locale),
        facts: [
          ...(company.founded
            ? [{ label: t("foundedLabel"), value: String(company.founded) }]
            : []),
          ...(company.employees
            ? [{ label: t("employeesLabel"), value: company.employees }]
            : []),
        ],
      };
    }
  }
}

export function pageSections(pageId: string): SectionSpec[] {
  return blueprint.sections[pageId] ?? [];
}
