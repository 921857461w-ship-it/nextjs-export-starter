import type { Metadata } from "next";
import { site, type Locale } from "./site-data";

// hreflang 成对输出（en 默认 + zh + x-default），canonical 指向当前 locale
export function buildMetadata({
  locale,
  path,
  title,
  description,
}: {
  locale: Locale;
  path: string;
  title: string;
  description?: string;
}): Metadata {
  const p = path === "/" ? "" : path;
  return {
    title,
    description,
    alternates: {
      canonical: `${site.base_url}/${locale}${p}`,
      languages: {
        en: `${site.base_url}/en${p}`,
        zh: `${site.base_url}/zh${p}`,
        "x-default": `${site.base_url}/en${p}`,
      },
    },
    openGraph: {
      title,
      description,
      url: `${site.base_url}/${locale}${p}`,
      type: "website",
      locale: locale === "zh" ? "zh_CN" : "en_US",
    },
  };
}
