import { z } from "zod";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ButtonLink } from "@/components/ui/Button";

export const productDetailSchema = z.object({
  id: z.string(),
  name: z.string(),
  model: z.string().optional(),
  images: z.array(z.string()).min(1),
  specs: z.array(z.tuple([z.string(), z.string()])),
  moq: z.string().optional(),
  // JSON-LD 与 CTA 上下文
  brandName: z.string().optional(),
  whatsapp: z.string().optional(),
  breadcrumbs: z
    .array(z.object({ label: z.string(), href: z.string() }))
    .default([]),
});
export type ProductDetailProps = z.infer<typeof productDetailSchema>;

// 产品详情页模板（页面级，不进 SECTION_COMPONENTS）：
// 图集（popover 放大）+ 规格表（签名件）+ 询盘 CTA + JSON-LD Product。
export function ProductDetailPage({
  name,
  model,
  images,
  specs,
  moq,
  brandName,
  whatsapp,
  breadcrumbs,
}: ProductDetailProps) {
  const t = useTranslations("product");
  const [mainImage, ...thumbs] = images;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    ...(model ? { mpn: model } : {}),
    ...(brandName ? { brand: { "@type": "Brand", name: brandName } } : {}),
    image: images,
    additionalProperty: specs.map(([k, v]) => ({
      "@type": "PropertyValue",
      name: k,
      value: v,
    })),
  };

  return (
    <article data-section="product_detail" className="section-pad bg-bg">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="container-site">
        {breadcrumbs.length > 0 && (
          <nav aria-label={t("breadcrumb")} className="mb-8">
            <ol className="flex flex-wrap items-center gap-2 text-sm text-muted">
              {breadcrumbs.map((b) => (
                <li key={b.href} className="flex items-center gap-2 after:content-['/'] after:text-line">
                  <Link href={b.href} className="hover:text-primary">
                    {b.label}
                  </Link>
                </li>
              ))}
              <li aria-current="page" className="font-semibold text-ink">
                {name}
              </li>
            </ol>
          </nav>
        )}

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          {/* 图集：主图 popover 放大，缩略图纯展示 */}
          <div>
            <button
              type="button"
              popoverTarget="pdp-zoom"
              className="relative block aspect-4/3 w-full cursor-zoom-in overflow-hidden border border-line bg-surface"
              aria-label={t("zoom")}
            >
              <Image
                src={mainImage}
                alt={name}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </button>
            <div
              id="pdp-zoom"
              popover="auto"
              className="m-auto w-[min(92vw,52rem)] border border-line bg-bg p-2 shadow-[0_8px_24px_oklch(0_0_0/0.18)] backdrop:bg-black/70"
            >
              <div className="relative aspect-4/3 w-full">
                <Image src={mainImage} alt={name} fill sizes="52rem" className="object-contain" />
              </div>
            </div>

            {thumbs.length > 0 && (
              <ul className="mt-4 grid grid-cols-4 gap-4">
                {thumbs.slice(0, 4).map((src) => (
                  <li key={src} className="relative aspect-4/3 overflow-hidden border border-line bg-surface">
                    <Image src={src} alt="" fill sizes="12rem" className="object-cover" />
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* 规格面板 */}
          <div>
            <h1 className="type-display-sm">{name}</h1>
            <div className="mt-3 flex flex-wrap items-baseline gap-x-6 gap-y-2">
              {model && (
                <p className="type-label text-muted">
                  {t("model")} <span className="tabular text-ink">{model}</span>
                </p>
              )}
              {moq && (
                <p className="type-label text-muted">
                  {t("moq")} <span className="tabular text-ink">{moq}</span>
                </p>
              )}
            </div>

            <table className="mt-8 w-full border border-line text-sm">
              <caption className="sr-only">{t("specs")}</caption>
              <tbody>
                {specs.map(([k, v], i) => (
                  <tr key={k} className={i % 2 ? "bg-surface" : "bg-bg"}>
                    <th scope="row" className="type-label w-2/5 border-r border-line px-4 py-3 text-left font-semibold text-muted">
                      {k}
                    </th>
                    <td className="tabular px-4 py-3 text-ink">{v}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="mt-9 flex flex-wrap gap-4">
              <ButtonLink href="#inquiry" variant="primary">
                {t("requestQuote")}
              </ButtonLink>
              {whatsapp && (
                <ButtonLink
                  href={`https://wa.me/${whatsapp.replace(/[^\d]/g, "")}`}
                  variant="accent"
                  external
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {t("whatsapp")}
                </ButtonLink>
              )}
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
