import { z } from "zod";
import Image from "next/image";
import { SectionHeading } from "@/components/ui/SectionHeading";

export const certWallSchema = z.object({
  heading: z.string().optional(),
  lead: z.string().optional(),
  headingAlign: z.enum(["start", "center"]).default("start"),
  certs: z.array(z.object({ type: z.string(), image: z.string() })),
});
export type CertWallProps = z.infer<typeof certWallSchema>;

// 认证墙：3:4 证书图 + 原生 Popover 放大（零 JS 的 lightbox；不支持的浏览器优雅退化为纯展示）。
export function CertWall({ heading, lead, headingAlign, certs }: CertWallProps) {
  return (
    <section data-section="cert_wall" className="section-pad bg-bg">
      <div className="container-site">
        {heading && <SectionHeading title={heading} lead={lead} align={headingAlign} />}
        <ul className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-5">
          {certs.map((c, i) => {
            const popId = `cert-pop-${i}`;
            return (
              <li key={`${c.type}-${i}`}>
                <button
                  type="button"
                  popoverTarget={popId}
                  className="group block w-full cursor-zoom-in text-left"
                  aria-label={c.type}
                >
                  <div className="relative aspect-3/4 overflow-hidden border border-line bg-surface transition-colors group-hover:border-ink/40">
                    <Image
                      src={c.image}
                      alt={c.type}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                      className="object-cover"
                    />
                  </div>
                  <p className="type-label mt-2.5 text-muted group-hover:text-ink">
                    {c.type}
                  </p>
                </button>

                <div
                  id={popId}
                  popover="auto"
                  className="m-auto w-[min(88vw,40rem)] border border-line bg-bg p-2 shadow-[0_8px_24px_oklch(0_0_0/0.18)] backdrop:bg-black/70"
                >
                  <div className="relative aspect-3/4 w-full">
                    <Image
                      src={c.image}
                      alt={c.type}
                      fill
                      sizes="40rem"
                      className="object-contain"
                    />
                  </div>
                  <p className="type-label px-2 py-3 text-center text-muted">
                    {c.type}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
