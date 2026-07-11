import { z } from "zod";

export const statsBarSchema = z.object({
  stats: z
    .array(z.object({ label: z.string(), value: z.string() }))
    .min(2)
    .max(6),
});
export type StatsBarProps = z.infer<typeof statsBarSchema>;

// 数字信任条：钢印数字 + 尺寸标注线。对标站常把这些数埋在散文里，可视化即升级。
export function StatsBar({ stats }: StatsBarProps) {
  return (
    <section data-section="stats_bar" className="section-pad-tight bg-bg">
      <div className="container-site">
        <div className="dim-rule" />
        <dl
          className="grid grid-cols-2 gap-y-10 py-10 md:grid-cols-[repeat(var(--stat-cols),1fr)]"
          style={{ "--stat-cols": stats.length } as React.CSSProperties}
        >
          {stats.map((s, i) => (
            <div
              key={s.label}
              className={`flex flex-col-reverse px-6 first:pl-0 ${i > 0 ? "md:border-l md:border-line" : ""}`}
            >
              <dt className="mt-2 text-sm text-muted">{s.label}</dt>
              <dd className="type-figure text-[clamp(2.4rem,1.8rem+2vw,3.6rem)] text-ink">
                {s.value}
              </dd>
            </div>
          ))}
        </dl>
        <div className="dim-rule" />
      </div>
    </section>
  );
}
