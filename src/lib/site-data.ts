import blueprintJson from "../../site/blueprint.json";
import contentJson from "../../site/content-pack.json";
import siteJson from "../../site/site.json";
import {
  blueprintSchema,
  contentPackSchema,
  siteConfigSchema,
} from "./site-schema";

// 构建时校验：数据不合法 → 构建失败，不出货（QA 门禁的第一道）
export const blueprint = blueprintSchema.parse(blueprintJson);
export const content = contentPackSchema.parse(contentJson);
export const site = siteConfigSchema.parse(siteJson);

export type Locale = "en" | "zh";

// 双语字段选择：zh 缺失回落 en（内容管线允许部分翻译）
export function pick<T extends Record<string, unknown>>(
  obj: T,
  key: string,
  locale: Locale
): string {
  const zh = obj[`${key}_zh`];
  const en = obj[`${key}_en`];
  return String((locale === "zh" ? (zh ?? en) : en) ?? "");
}

export function mediaUrl(file: string): string {
  return file.startsWith("/") ? file : `/media/${file}`;
}

export function productHref(id: string): string {
  return `/products/${id}`;
}

export function pageHref(pageId: string): string {
  return pageId === "home" ? "/" : `/${pageId}`;
}

export function navPages(locale: Locale) {
  return blueprint.pages
    .filter((p) => p.nav && p.id !== "home")
    .map((p) => ({ label: pick(p, "label", locale), href: pageHref(p.id) }));
}
