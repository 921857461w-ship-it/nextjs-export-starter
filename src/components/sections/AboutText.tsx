import { z } from "zod";
import { SectionHeading } from "@/components/ui/SectionHeading";

export const aboutTextSchema = z.object({
  // split = 左标题右正文（默认）；centered = 居中标题+居中段落（对标站目录导语版式）
  variant: z.enum(["split", "centered"]).default("split"),
  heading: z.string(),
  body: z.string(),
  facts: z
    .array(z.object({ label: z.string(), value: z.string() }))
    .default([]),
});
export type AboutTextProps = z.infer<typeof aboutTextSchema>;

// About 散文块：对标站 about 页散文是普遍结构，15 个首发组件之外的最小补充。
// 内容来自 content_pack.company.about_*（Stage B 由执照+简介生成，150 词内）。
export function AboutText({ variant, heading, body, facts }: AboutTextProps) {
  if (variant === "centered") {
    return (
      <section data-section="about_text" className="section-pad bg-bg">
        <div className="container-site flex flex-col items-center text-center">
          <SectionHeading title={heading} align="center" />
          <p className="max-w-[75ch] text-ink">{body}</p>
          {facts.length > 0 && (
            <dl className="mt-8 flex flex-wrap justify-center gap-x-12 gap-y-4">
              {facts.map((f) => (
                <div key={f.label} className="flex flex-row-reverse items-baseline gap-3">
                  <dt className="text-sm text-muted">{f.label}</dt>
                  <dd className="type-figure text-2xl text-primary">{f.value}</dd>
                </div>
              ))}
            </dl>
          )}
        </div>
      </section>
    );
  }

  return (
    <section data-section="about_text" className="section-pad bg-bg">
      <div className="container-site grid grid-cols-1 gap-x-16 lg:grid-cols-[minmax(16rem,1fr)_2fr]">
        <div>
          <SectionHeading title={heading} />
          {facts.length > 0 && (
            <dl className="space-y-4">
              {facts.map((f) => (
                <div
                  key={f.label}
                  className="flex flex-row-reverse items-baseline justify-end gap-4"
                >
                  <dt className="text-sm text-muted">{f.label}</dt>
                  <dd className="type-figure text-2xl text-primary">{f.value}</dd>
                </div>
              ))}
            </dl>
          )}
        </div>
        <p className="max-w-[68ch] text-lg leading-relaxed text-ink">{body}</p>
      </div>
    </section>
  );
}
