import { z } from "zod";
import { SectionHeading } from "@/components/ui/SectionHeading";

export const processTimelineSchema = z.object({
  heading: z.string().optional(),
  lead: z.string().optional(),
  headingAlign: z.enum(["start", "center"]).default("start"),
  // docs 建议 4–6 步；真实对标站出现过 9 步（dtnut），schema 放宽承接
  steps: z
    .array(z.object({ title: z.string(), desc: z.string().optional() }))
    .min(3)
    .max(9),
});
export type ProcessTimelineProps = z.infer<typeof processTimelineSchema>;

// 生产/合作流程：真实序列 → 编号合法。钢印序号 + 连接标注线。
export function ProcessTimeline({ heading, lead, headingAlign, steps }: ProcessTimelineProps) {
  return (
    <section data-section="process_timeline" className="section-pad bg-bg">
      <div className="container-site">
        {heading && <SectionHeading title={heading} lead={lead} align={headingAlign} />}
        <ol className="grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-[repeat(auto-fit,minmax(11rem,1fr))]">
          {steps.map((s, i) => (
            <li key={s.title} className="relative">
              <div className="flex items-center gap-4">
                <span className="type-figure text-3xl text-primary">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="dim-rule flex-1" aria-hidden="true" />
              </div>
              <h3 className="mt-4 font-bold text-ink">{s.title}</h3>
              {s.desc && <p className="mt-1.5 text-sm text-muted">{s.desc}</p>}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
