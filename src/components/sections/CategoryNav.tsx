import { z } from "zod";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { SectionHeading } from "@/components/ui/SectionHeading";

const categoryNode = z.object({
  id: z.string(),
  name: z.string(),
  href: z.string(),
  image: z.string().optional(),
});

export const categoryNavSchema = z.object({
  heading: z.string().optional(),
  lead: z.string().optional(),
  headingAlign: z.enum(["start", "center"]).default("start"),
  categories: z.array(
    categoryNode.extend({ children: z.array(categoryNode).default([]) })
  ),
});
export type CategoryNavProps = z.infer<typeof categoryNavSchema>;

// 类目导航（两级封顶）：也用于"行业应用"式导航网格（对标站常见）。
// 有图 → 图块网格；无图 → 索引行版式（工程目录页样式）。
export function CategoryNav({
  heading,
  lead,
  headingAlign,
  categories,
}: CategoryNavProps) {
  const withImages = categories.some((c) => c.image);

  return (
    <section data-section="category_nav" className="section-pad bg-surface">
      <div className="container-site">
        {heading && (
          <SectionHeading title={heading} lead={lead} align={headingAlign} />
        )}

        {withImages ? (
          <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {categories.map((c) => (
              <li key={c.id}>
                <Link href={c.href} className="group block">
                  <div className="relative aspect-4/3 overflow-hidden border border-line bg-bg">
                    {c.image && (
                      <Image
                        src={c.image}
                        alt={c.name}
                        fill
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                        className="object-cover transition-transform duration-300 ease-out group-hover:scale-[1.03]"
                      />
                    )}
                  </div>
                  <p className="mt-2.5 text-sm font-semibold text-ink group-hover:text-primary">
                    {c.name}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <ul className="grid grid-cols-1 gap-x-12 md:grid-cols-2">
            {categories.map((c) => (
              <li key={c.id} className="border-b border-line py-5">
                <Link
                  href={c.href}
                  className="group flex items-baseline justify-between gap-4"
                >
                  <span className="text-lg font-bold text-ink group-hover:text-primary">
                    {c.name}
                  </span>
                  {c.children.length > 0 && (
                    <span className="tabular shrink-0 text-sm text-muted">
                      {String(c.children.length).padStart(2, "0")}
                    </span>
                  )}
                </Link>
                {c.children.length > 0 && (
                  <ul className="mt-2.5 flex flex-wrap gap-x-5 gap-y-1.5">
                    {c.children.map((ch) => (
                      <li key={ch.id}>
                        <Link
                          href={ch.href}
                          className="text-sm text-muted underline-offset-4 hover:text-primary hover:underline"
                        >
                          {ch.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
