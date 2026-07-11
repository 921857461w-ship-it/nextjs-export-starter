import { z } from "zod";
import Image from "next/image";
import { SectionHeading } from "@/components/ui/SectionHeading";

export const factoryGallerySchema = z.object({
  heading: z.string().optional(),
  lead: z.string().optional(),
  headingAlign: z.enum(["start", "center"]).default("start"),
  images: z.array(z.object({ src: z.string(), alt: z.string() })).min(1),
});
export type FactoryGalleryProps = z.infer<typeof factoryGallerySchema>;

// 厂房实拍：深底 + 坐标纸纹理段落（Committed 用色的一处），首图加大。
export function FactoryGallery({ heading, lead, headingAlign, images }: FactoryGalleryProps) {
  const [featured, ...rest] = images;

  return (
    <section
      data-section="factory_gallery"
      className="tone-dark section-pad graph-paper bg-bg"
    >
      <div className="container-site">
        {heading && <SectionHeading title={heading} lead={lead} align={headingAlign} />}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <figure className="relative col-span-2 row-span-2 aspect-16/9 overflow-hidden border border-line md:aspect-auto">
            <Image
              src={featured.src}
              alt={featured.alt}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          </figure>
          {rest.slice(0, 4).map((img) => (
            <figure
              key={img.src}
              className="relative aspect-16/9 overflow-hidden border border-line"
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                className="object-cover"
              />
            </figure>
          ))}
        </div>
        {rest.length > 4 && (
          <div className="mt-4 grid grid-cols-3 gap-4 md:grid-cols-6">
            {rest.slice(4).map((img) => (
              <figure
                key={img.src}
                className="relative aspect-16/9 overflow-hidden border border-line"
              >
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  sizes="(max-width: 768px) 33vw, 16vw"
                  className="object-cover"
                />
              </figure>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
