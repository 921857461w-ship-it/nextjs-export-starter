import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SitePage";
import { ProductDetailPage } from "@/components/sections/ProductDetailPage";
import { ProductGrid } from "@/components/sections/ProductGrid";
import { InquiryForm } from "@/components/sections/InquiryForm";
import {
  blueprint,
  content,
  mediaUrl,
  pick,
  productHref,
  site,
  type Locale,
} from "@/lib/site-data";
import { buildMetadata } from "@/lib/seo";
import { themeDefaults } from "@/lib/theme";

export const dynamicParams = false;

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    content.products.map((p) => ({ locale, id: p.id }))
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}): Promise<Metadata> {
  const { locale, id } = await params;
  const l = locale as Locale;
  const p = content.products.find((x) => x.id === id);
  if (!p) return {};
  const specLine = p.specs
    .slice(0, 3)
    .map(([k, v]) => `${k}: ${v}`)
    .join(" · ");
  return buildMetadata({
    locale: l,
    path: productHref(id),
    title: `${pick(p, "name", l)}${p.model ? ` (${p.model})` : ""}`,
    description: specLine,
  });
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  const l = locale as Locale;
  const product = content.products.find((x) => x.id === id);
  if (!product) notFound();
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "sections" });
  const name = pick(product, "name", l);
  const specs = l === "zh" && product.specs_zh ? product.specs_zh : product.specs;
  const productsPage = blueprint.pages.find((p) => p.id === "products");
  const homePage = blueprint.pages.find((p) => p.id === "home");

  const related = content.products
    .filter((x) => x.category === product.category && x.id !== product.id)
    .slice(0, 3)
    .map((x) => ({
      id: x.id,
      name: pick(x, "name", l),
      model: x.model,
      image: mediaUrl(x.images[0]),
      href: productHref(x.id),
    }));

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: homePage ? pick(homePage, "label", l) : "Home",
        item: `${site.base_url}/${l}`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: productsPage ? pick(productsPage, "label", l) : "Products",
        item: `${site.base_url}/${l}/products`,
      },
      { "@type": "ListItem", position: 3, name },
    ],
  };

  return (
    <>
      <SiteHeader locale={l} path="/products" variant={(blueprint.chrome ?? themeDefaults.chrome).header} />
      <main>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
        />
        <ProductDetailPage
          id={product.id}
          name={name}
          model={product.model}
          images={product.images.map(mediaUrl)}
          specs={specs}
          moq={product.moq}
          brandName={pick(content.company, "name", l)}
          whatsapp={content.company.whatsapp}
          breadcrumbs={[
            {
              label: homePage ? pick(homePage, "label", l) : "Home",
              href: "/",
            },
            {
              label: productsPage ? pick(productsPage, "label", l) : "Products",
              href: "/products",
            },
          ]}
        />
        {related.length > 0 && (
          <ProductGrid
            heading={t("relatedProducts")}
            headingAlign="start"
            cardStyle="line"
            columns={3}
            groupedByCategory={false}
            categories={[]}
            products={related}
          />
        )}
        <InquiryForm productContext={{ id: product.id, name }} />
      </main>
      <SiteFooter locale={l} />
    </>
  );
}
