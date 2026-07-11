import { z } from "zod";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { SectionHeading } from "@/components/ui/SectionHeading";

export const productGridSchema = z.object({
  heading: z.string().optional(),
  lead: z.string().optional(),
  headingAlign: z.enum(["start", "center"]).default("start"),
  // line = 白底细框（自有语言默认）；panel = 浅灰面板卡（对标站常见版式）
  cardStyle: z.enum(["line", "panel"]).default("line"),
  columns: z.union([z.literal(2), z.literal(3), z.literal(4)]).default(3),
  groupedByCategory: z.boolean().default(false),
  categories: z
    .array(z.object({ id: z.string(), name: z.string() }))
    .default([]),
  products: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      model: z.string().optional(),
      image: z.string(),
      href: z.string(),
      category: z.string().optional(),
    })
  ),
});
export type ProductGridProps = z.infer<typeof productGridSchema>;

type Product = ProductGridProps["products"][number];

const COLS: Record<2 | 3 | 4, string> = {
  2: "sm:grid-cols-2",
  3: "sm:grid-cols-2 lg:grid-cols-3",
  4: "sm:grid-cols-2 lg:grid-cols-4",
};

function ProductCard({ p, cardStyle }: { p: Product; cardStyle: "line" | "panel" }) {
  if (cardStyle === "panel") {
    return (
      <Link href={p.href} className="group block bg-surface p-4 transition-colors duration-150 hover:bg-surface-2">
        <div className="relative aspect-4/3 overflow-hidden bg-bg">
          <Image
            src={p.image}
            alt={p.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-300 ease-out group-hover:scale-[1.03]"
          />
        </div>
        <div className="px-1 pt-4 pb-1 text-center">
          <h3 className="text-sm font-semibold text-ink group-hover:text-primary">{p.name}</h3>
          {p.model && <p className="type-label mt-1.5 text-muted">{p.model}</p>}
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={p.href}
      className="group block border border-line bg-bg transition-colors duration-150 hover:border-ink/40"
    >
      <div className="relative aspect-4/3 overflow-hidden bg-surface">
        <Image
          src={p.image}
          alt={p.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-300 ease-out group-hover:scale-[1.03]"
        />
      </div>
      <div className="flex items-baseline justify-between gap-3 border-t border-line px-4 py-3.5">
        <h3 className="text-sm font-semibold text-ink group-hover:text-primary">
          {p.name}
        </h3>
        {p.model && (
          <span className="type-label shrink-0 text-muted">{p.model}</span>
        )}
      </div>
    </Link>
  );
}

// 产品网格：2/3/4 列，按类目分组可选（组标题 = 两级类目的 L1）。
export function ProductGrid({
  heading,
  lead,
  headingAlign,
  cardStyle,
  columns,
  groupedByCategory,
  categories,
  products,
}: ProductGridProps) {
  const catName = (id: string) =>
    categories.find((c) => c.id === id)?.name ?? id;

  const groups = groupedByCategory
    ? [...new Set(products.map((p) => p.category ?? ""))].map((cat) => ({
        cat,
        items: products.filter((p) => (p.category ?? "") === cat),
      }))
    : [{ cat: "", items: products }];

  return (
    <section data-section="product_grid" className="section-pad bg-bg">
      <div className="container-site">
        {heading && (
          <SectionHeading title={heading} lead={lead} align={headingAlign} />
        )}
        <div className="space-y-14">
          {groups.map(({ cat, items }) => (
            <div
              key={cat || "all"}
              id={groupedByCategory && cat ? `cat-${cat}` : undefined}
              className="scroll-mt-20"
            >
              {groupedByCategory && cat && (
                <div className="mb-6 flex items-baseline gap-4">
                  <h3 className="text-xl font-bold text-ink">{catName(cat)}</h3>
                  <span className="tabular text-sm text-muted">
                    {String(items.length).padStart(2, "0")}
                  </span>
                  <div className="dim-rule flex-1 self-center" />
                </div>
              )}
              <ul className={`grid grid-cols-1 gap-5 ${COLS[columns]}`}>
                {items.map((p) => (
                  <li key={p.id}>
                    <ProductCard p={p} cardStyle={cardStyle} />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
