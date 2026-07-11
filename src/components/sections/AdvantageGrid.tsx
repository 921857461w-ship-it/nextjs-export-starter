import { z } from "zod";
import { Icon } from "@/components/ui/icons";
import { SectionHeading } from "@/components/ui/SectionHeading";

export const advantageGridSchema = z.object({
  heading: z.string().optional(),
  lead: z.string().optional(),
  headingAlign: z.enum(["start", "center"]).default("start"),
  // rows = hairline 行（自有语言默认）；tiles = 居中图标块（对标站常见的信任锚点四联排）
  variant: z.enum(["rows", "tiles"]).default("rows"),
  items: z.array(
    z.object({ icon: z.string(), title: z.string(), desc: z.string() })
  ),
});
export type AdvantageGridProps = z.infer<typeof advantageGridSchema>;

// 为什么选我们：hairline 行版式为主，tiles 变体承接对标站的图标锚点排。
export function AdvantageGrid({
  heading,
  lead,
  headingAlign,
  variant,
  items,
}: AdvantageGridProps) {
  if (variant === "tiles") {
    return (
      <section data-section="advantage_grid" className="section-pad bg-surface">
        <div className="container-site">
          {heading && (
            <SectionHeading title={heading} lead={lead} align={headingAlign} />
          )}
          <ul className="grid grid-cols-2 gap-5 lg:grid-cols-4">
            {items.map((it) => (
              <li
                key={it.title}
                className="flex flex-col items-center border border-line bg-bg px-6 py-9 text-center"
              >
                <Icon name={it.icon} className="size-8 text-primary" />
                <h3 className="mt-4 font-bold text-ink">{it.title}</h3>
                <p className="mt-2 text-sm text-muted">{it.desc}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>
    );
  }

  return (
    <section data-section="advantage_grid" className="section-pad bg-surface">
      <div className="container-site">
        {heading && (
          <SectionHeading title={heading} lead={lead} align={headingAlign} />
        )}
        <ul className="grid grid-cols-1 border-t border-line md:grid-cols-2 md:gap-x-16">
          {items.map((it) => (
            <li
              key={it.title}
              className="flex gap-5 border-b border-line py-7 md:py-8"
            >
              <Icon
                name={it.icon}
                className="mt-0.5 size-7 shrink-0 text-primary"
              />
              <div>
                <h3 className="font-bold text-ink">{it.title}</h3>
                <p className="mt-1.5 max-w-prose text-sm text-muted">
                  {it.desc}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
