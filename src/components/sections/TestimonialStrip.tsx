import { z } from "zod";
import { SectionHeading } from "@/components/ui/SectionHeading";

export const testimonialStripSchema = z.object({
  heading: z.string().optional(),
  headingAlign: z.enum(["start", "center"]).default("start"),
  testimonials: z.array(
    z.object({
      quote: z.string(),
      author: z.string(),
      country: z.string().optional(),
    })
  ),
});
export type TestimonialStripProps = z.infer<typeof testimonialStripSchema>;

// 客户评价：有素材才启用。克制版式——引文不加花，作者行用标注样式。
export function TestimonialStrip({ heading, headingAlign, testimonials }: TestimonialStripProps) {
  return (
    <section data-section="testimonial_strip" className="section-pad-tight bg-bg">
      <div className="container-site">
        {heading && <SectionHeading title={heading} align={headingAlign} />}
        <ul className="grid grid-cols-1 gap-10 md:grid-cols-[repeat(auto-fit,minmax(18rem,1fr))] md:gap-14">
          {testimonials.map((t) => (
            <li key={t.author}>
              <blockquote className="border-l border-line pl-6">
                <p className="text-lg text-ink">&ldquo;{t.quote}&rdquo;</p>
                <footer className="mt-4 flex items-baseline gap-3">
                  <cite className="text-sm font-semibold not-italic text-ink">
                    {t.author}
                  </cite>
                  {t.country && (
                    <span className="type-label text-muted">{t.country}</span>
                  )}
                </footer>
              </blockquote>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
