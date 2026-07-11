/**
 * Sanity schema stub — COPY into your Sanity Studio project.
 * Not imported by the Next.js app (see tsconfig exclude).
 *
 * Field names align with site/content-pack.json for scripts/pull-from-sanity.mjs.
 */

// @ts-nocheck

export const company = {
  name: "company",
  title: "Company",
  type: "document",
  fields: [
    { name: "name_en", title: "Name (EN)", type: "string", validation: (r) => r.required() },
    { name: "name_zh", title: "Name (ZH)", type: "string" },
    { name: "short_name_en", title: "Short name (EN)", type: "string" },
    { name: "short_name_zh", title: "Short name (ZH)", type: "string" },
    { name: "tagline_en", title: "Tagline (EN)", type: "text" },
    { name: "tagline_zh", title: "Tagline (ZH)", type: "text" },
    { name: "about_en", title: "About (EN)", type: "text" },
    { name: "about_zh", title: "About (ZH)", type: "text" },
    { name: "founded", title: "Founded year", type: "number" },
    { name: "employees", title: "Employees", type: "string" },
    { name: "email", title: "Sales email", type: "string" },
    { name: "phone", title: "Phone", type: "string" },
    { name: "whatsapp", title: "WhatsApp", type: "string" },
    { name: "address_en", title: "Address (EN)", type: "string" },
    { name: "address_zh", title: "Address (ZH)", type: "string" },
    { name: "map_image", title: "Map image filename", type: "string" },
  ],
};

export const product = {
  name: "product",
  title: "Product",
  type: "document",
  fields: [
    {
      name: "id",
      title: "ID (URL slug)",
      type: "string",
      description: "e.g. hn-iso4032-cl8 — used in /products/[id]",
      validation: (r) => r.required(),
    },
    {
      name: "category",
      title: "Category id",
      type: "string",
      description: "Must match categories[].id in content-pack (e.g. hex-nuts)",
      validation: (r) => r.required(),
    },
    { name: "name_en", title: "Name (EN)", type: "string", validation: (r) => r.required() },
    { name: "name_zh", title: "Name (ZH)", type: "string" },
    { name: "model", title: "Model / standard", type: "string" },
    { name: "moq", title: "MOQ", type: "string", description: 'e.g. "1,000 pcs"' },
    {
      name: "image_file",
      title: "Image filename (public/media)",
      type: "string",
      description: "Preferred: product-01.jpg already in the repo",
    },
    {
      name: "image",
      title: "Or upload image",
      type: "image",
      options: { hotspot: true },
      description: "If set and image_file empty, CDN URL is written into content-pack",
    },
    {
      name: "specs",
      title: "Specs",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "label_en", type: "string", title: "Label EN" },
            { name: "label_zh", type: "string", title: "Label ZH" },
            { name: "value", type: "string", title: "Value" },
          ],
        },
      ],
    },
  ],
};
