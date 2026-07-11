import { getTranslations } from "next-intl/server";
import { SECTION_COMPONENTS } from "@/components/sections";
import { SiteHeader } from "@/components/SiteHeader";
import { Footer } from "@/components/sections/Footer";
import { buildSectionProps, pageSections } from "@/lib/section-props";
import { themeDefaults } from "@/lib/theme";
import {
  blueprint,
  content,
  navPages,
  pageHref,
  pick,
  type Locale,
} from "@/lib/site-data";

// 页面组装：blueprint + content_pack → 页面树（section 实例 + props）→ 渲染。
// props 过组件 zod schema 校验，不合法 → 构建失败（QA 门禁）。
export async function RenderedSections({
  pageId,
  locale,
}: {
  pageId: string;
  locale: Locale;
}) {
  const t = await getTranslations({ locale, namespace: "sections" });
  const specs = pageSections(pageId);

  return specs.map((spec, i) => {
    const entry = SECTION_COMPONENTS[spec.type];
    if (!entry) throw new Error(`Unknown section type "${spec.type}" on page "${pageId}"`);
    const raw = buildSectionProps(spec, { locale, t });
    if (raw === null) return null; // 无素材 → 跳过，永不阻塞交付
    const props = entry.schema.parse(raw);
    const Cmp = entry.component;
    return <Cmp key={`${spec.type}-${i}`} {...props} />;
  });
}

export function SiteFooter({ locale }: { locale: Locale }) {
  const c = content.company;
  return (
    <Footer
      variant={(blueprint.chrome ?? themeDefaults.chrome).footer}
      companyName={pick(c, "name", locale)}
      tagline={pick(c, "tagline", locale) || undefined}
      nav={navPages(locale)}
      email={c.email}
      whatsapp={c.whatsapp}
      address={pick(c, "address", locale)}
      certs={content.certs.map((x) => x.type)}
    />
  );
}

// 非首页的页头 h1 带（heading 层级：h1 页名 → h2 section 标题）
function PageTitle({ pageId, locale }: { pageId: string; locale: Locale }) {
  const page = blueprint.pages.find((p) => p.id === pageId);
  if (!page) return null;
  return (
    <div className="border-b border-line bg-surface">
      <div className="container-site py-12 md:py-16">
        <h1 className="type-display-sm">{pick(page, "label", locale)}</h1>
      </div>
    </div>
  );
}

export async function SitePage({
  pageId,
  locale,
}: {
  pageId: string;
  locale: Locale;
}) {
  return (
    <>
      <SiteHeader
        locale={locale}
        path={pageHref(pageId)}
        variant={(blueprint.chrome ?? themeDefaults.chrome).header}
      />
      <main>
        {pageId !== "home" && <PageTitle pageId={pageId} locale={locale} />}
        <RenderedSections pageId={pageId} locale={locale} />
      </main>
      <SiteFooter locale={locale} />
    </>
  );
}
