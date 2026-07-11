import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { SitePage } from "@/components/SitePage";
import { blueprint, content, pick, type Locale } from "@/lib/site-data";
import { buildMetadata } from "@/lib/seo";

// blueprint.pages 里除 home（/）与 products（静态段）外的所有页面走这里
const GENERIC_PAGES = blueprint.pages
  .map((p) => p.id)
  .filter((id) => id !== "home" && id !== "products");

export const dynamicParams = false;

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    GENERIC_PAGES.map((page) => ({ locale, page }))
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; page: string }>;
}): Promise<Metadata> {
  const { locale, page } = await params;
  const l = locale as Locale;
  const p = blueprint.pages.find((x) => x.id === page);
  if (!p) return {};
  return buildMetadata({
    locale: l,
    path: `/${page}`,
    title: pick(p, "label", l),
    description: pick(content.company, "tagline", l) || undefined,
  });
}

export default async function GenericPage({
  params,
}: {
  params: Promise<{ locale: string; page: string }>;
}) {
  const { locale, page } = await params;
  if (!GENERIC_PAGES.includes(page)) notFound();
  setRequestLocale(locale);
  return <SitePage pageId={page} locale={locale as Locale} />;
}
