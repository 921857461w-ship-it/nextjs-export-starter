import { z } from "zod";
import { Link } from "@/i18n/navigation";

export const ctaBandSchema = z.object({
  // split = 左文右钮（默认）；centered = 居中堆叠（对标站常见）
  variant: z.enum(["split", "centered"]).default("split"),
  headline: z.string(),
  sub: z.string().optional(),
  cta: z.object({ label: z.string(), href: z.string() }),
});
export type CtaBandProps = z.infer<typeof ctaBandSchema>;

// 行动条：整面主色（Committed 用色第二处），贯穿页面复用。
export function CtaBand({ variant, headline, sub, cta }: CtaBandProps) {
  if (variant === "centered") {
    return (
      <section data-section="cta_band" className="on-primary-block bg-primary">
        <div className="container-site flex flex-col items-center gap-7 py-14 text-center md:py-16">
          <h2 className="type-display-sm max-w-3xl text-on-primary">{headline}</h2>
          {sub && <p className="max-w-xl text-on-primary/80">{sub}</p>}
          <Link
            href={cta.href}
            className="inline-flex min-h-11 items-center justify-center rounded-sm bg-white px-7 py-2.5 text-sm font-semibold tracking-wide text-ink transition-colors hover:bg-white/90"
          >
            {cta.label}
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section data-section="cta_band" className="on-primary-block bg-primary">
      <div className="container-site flex flex-col items-start gap-8 py-14 md:flex-row md:items-center md:justify-between md:py-16">
        <div>
          <h2 className="type-display-sm text-on-primary">{headline}</h2>
          {sub && <p className="mt-3 max-w-xl text-on-primary/80">{sub}</p>}
        </div>
        <Link
          href={cta.href}
          className="inline-flex min-h-11 shrink-0 items-center justify-center rounded-sm bg-white px-7 py-2.5 text-sm font-semibold tracking-wide text-ink transition-colors hover:bg-white/90"
        >
          {cta.label}
        </Link>
      </div>
    </section>
  );
}
