#!/usr/bin/env node
/**
 * Pull company + products from Sanity into site/content-pack.json
 *
 * Env (from .env.local or shell):
 *   SANITY_PROJECT_ID
 *   SANITY_DATASET          (default: production)
 *   SANITY_API_TOKEN        (Viewer is enough)
 *   SANITY_API_VERSION      (default: 2024-01-01)
 *
 * Usage:
 *   node scripts/pull-from-sanity.mjs
 *
 * No npm dependency: uses Sanity HTTP API via fetch (Node 20+).
 *
 * Maps Sanity docs → this repo's content-pack product shape:
 *   id, category, name_en/zh, model, specs[[label,value]], specs_zh, images[], moq
 */

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");
const packPath = resolve(root, "site/content-pack.json");

function loadEnvFile(file) {
  const p = resolve(root, file);
  if (!existsSync(p)) return;
  for (const line of readFileSync(p, "utf8").split("\n")) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const i = t.indexOf("=");
    if (i === -1) continue;
    const k = t.slice(0, i).trim();
    let v = t.slice(i + 1).trim();
    if (
      (v.startsWith('"') && v.endsWith('"')) ||
      (v.startsWith("'") && v.endsWith("'"))
    ) {
      v = v.slice(1, -1);
    }
    if (!process.env[k]) process.env[k] = v;
  }
}

loadEnvFile(".env.local");
loadEnvFile(".env");

const projectId = process.env.SANITY_PROJECT_ID;
const dataset = process.env.SANITY_DATASET || "production";
const token = process.env.SANITY_API_TOKEN;
const apiVersion = process.env.SANITY_API_VERSION || "2024-01-01";

if (!projectId || !token) {
  console.error(
    "Missing SANITY_PROJECT_ID or SANITY_API_TOKEN.\nSee docs/SANITY.md and .env.example"
  );
  process.exit(1);
}

const query = encodeURIComponent(`{
  "company": *[_type == "company"][0]{
    name_en, name_zh, short_name_en, short_name_zh,
    tagline_en, tagline_zh, about_en, about_zh,
    founded, employees, email, phone, whatsapp,
    address_en, address_zh, map_image
  },
  "products": *[_type == "product"] | order(name_en asc) {
    id, name_en, name_zh, model, category, moq,
    image_file,
    "image_url": image.asset->url,
    specs[]{ label_en, label_zh, value }
  }
}`);

const url = `https://${projectId}.api.sanity.io/v${apiVersion}/data/query/${dataset}?query=${query}`;

const res = await fetch(url, {
  headers: { Authorization: `Bearer ${token}` },
});

if (!res.ok) {
  console.error("Sanity query failed:", res.status, await res.text());
  process.exit(1);
}

const { result } = await res.json();
if (!result) {
  console.error("Empty result from Sanity");
  process.exit(1);
}

if (!existsSync(packPath)) {
  console.error("Missing", packPath);
  process.exit(1);
}

const pack = JSON.parse(readFileSync(packPath, "utf8"));
const defaultCategory = pack.categories?.[0]?.id || "general";

if (result.company) {
  const c = result.company;
  pack.company = {
    ...pack.company,
    ...Object.fromEntries(
      Object.entries(c).filter(([, v]) => v !== null && v !== undefined && v !== "")
    ),
  };
  console.log("✓ company merged:", pack.company.name_en || pack.company.name_zh || "(no name)");
} else {
  console.warn("! no company document in Sanity — company section unchanged");
}

if (Array.isArray(result.products) && result.products.length > 0) {
  pack.products = result.products.map((p) => {
    const image =
      (p.image_file && String(p.image_file)) ||
      (p.image_url && String(p.image_url)) ||
      "product-01.jpg";

    const specs = [];
    const specs_zh = [];
    if (Array.isArray(p.specs)) {
      for (const s of p.specs) {
        const le = s.label_en || s.label_zh || "";
        const lz = s.label_zh || s.label_en || "";
        const val = s.value || "";
        if (le || val) specs.push([le, val]);
        if (lz || val) specs_zh.push([lz, val]);
      }
    }

    return {
      id: p.id,
      category: p.category || defaultCategory,
      name_en: p.name_en,
      name_zh: p.name_zh || p.name_en,
      model: p.model || p.name_en,
      specs,
      specs_zh: specs_zh.length ? specs_zh : undefined,
      images: [image],
      moq: p.moq || "",
    };
  });
  console.log(`✓ products: ${pack.products.length} items`);
} else {
  console.warn("! no products in Sanity — products section unchanged");
}

writeFileSync(packPath, JSON.stringify(pack, null, 2) + "\n", "utf8");
console.log("Wrote", packPath);
console.log("Next: pnpm build && git commit site/content-pack.json && git push");
