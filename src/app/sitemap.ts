import type { MetadataRoute } from "next";
import { blueprint, content, productHref, site } from "@/lib/site-data";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    ...blueprint.pages.map((p) => (p.id === "home" ? "" : `/${p.id}`)),
    ...content.products.map((p) => productHref(p.id)),
  ];

  return paths.map((path) => ({
    url: `${site.base_url}/en${path}`,
    changeFrequency: "monthly",
    priority: path === "" ? 1 : 0.7,
    alternates: {
      languages: {
        en: `${site.base_url}/en${path}`,
        zh: `${site.base_url}/zh${path}`,
      },
    },
  }));
}
