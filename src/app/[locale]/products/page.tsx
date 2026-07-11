import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { SitePage } from "@/components/SitePage";
import { blueprint, content, pick, type Locale } from "@/lib/site-data";
import { buildMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const l = locale as Locale;
  const p = blueprint.pages.find((x) => x.id === "products");
  return buildMetadata({
    locale: l,
    path: "/products",
    title: p ? pick(p, "label", l) : "Products",
    description: pick(content.company, "tagline", l) || undefined,
  });
}

export default async function ProductsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <SitePage pageId="products" locale={locale as Locale} />;
}
