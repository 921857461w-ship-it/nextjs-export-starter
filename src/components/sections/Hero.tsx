import { z } from "zod";
import Image from "next/image";
import { ButtonLink } from "@/components/ui/Button";

export const heroSchema = z.object({
  variant: z.enum(["editorial", "centered"]).default("editorial"),
  headline: z.string(),
  subline: z.string().optional(),
  ctas: z.array(z.object({ label: z.string(), href: z.string() })).max(2),
  image: z.string(),
  imageAlt: z.string().default(""),
  badges: z.array(z.string()).max(4).default([]),
});
export type HeroProps = z.infer<typeof heroSchema>;

export function Hero({ variant, headline, subline, ctas, image, imageAlt, badges }: HeroProps) {
  if (variant === "centered") {
    return (
      <section
        data-section="hero"
        className="tone-dark relative isolate flex min-h-[min(70svh,34rem)] flex-col items-center justify-center overflow-hidden bg-bg sm:min-h-[min(72svh,44rem)]"
      >
        <Image src={image} alt={imageAlt} fill priority quality={50} sizes="100vw" className="object-cover" />
        <div aria-hidden="true" className="absolute inset-0 bg-(--hero-scrim,black)/65" />
        <div className="container-site relative w-full py-16 text-center sm:py-24">
          <h1 className="type-display anim-rise mx-auto max-w-4xl text-[clamp(2.4rem,1.8rem+2.8vw,4rem)] text-white">
            {headline}
          </h1>
          {subline && (
            <p className="anim-rise-late mx-auto mt-4 max-w-2xl text-base text-white/90 sm:mt-6 sm:text-lg">
              {subline}
            </p>
          )}
          {ctas.length > 0 && (
            <div className="anim-rise-late mt-6 flex flex-wrap justify-center gap-4 sm:mt-9">
              {ctas.map((cta, i) => (
                <ButtonLink key={cta.href} href={cta.href} variant={i === 0 ? "primary" : "inverse"}>
                  {cta.label}
                </ButtonLink>
              ))}
            </div>
          )}
        </div>
      </section>
    );
  }

  return (
    <section
      data-section="hero"
      className="tone-dark relative isolate flex min-h-[min(70svh,34rem)] flex-col justify-end overflow-hidden bg-bg sm:min-h-[min(82svh,52rem)]"
    >
      <Image src={image} alt={imageAlt} fill priority quality={50} sizes="100vw" className="object-cover" />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-linear-to-r from-black/78 via-black/55 to-black/15"
      />
      <div className="container-site relative w-full pt-24 pb-10 sm:pt-40 sm:pb-14">
        <div className="max-w-3xl">
          <h1 className="type-display anim-rise text-white">{headline}</h1>
          {subline && (
            <p className="anim-rise-late mt-4 max-w-xl text-base text-white/85 sm:mt-6 sm:text-lg">
              {subline}
            </p>
          )}
          {ctas.length > 0 && (
            <div className="anim-rise-late mt-6 flex flex-wrap gap-4 sm:mt-9">
              {ctas.map((cta, i) => (
                <ButtonLink key={cta.href} href={cta.href} variant={i === 0 ? "primary" : "inverse"}>
                  {cta.label}
                </ButtonLink>
              ))}
            </div>
          )}
        </div>
        {badges.length > 0 && (
          <div className="mt-10 border-t border-white/25 sm:mt-14">
            <ul className="grid grid-cols-2 gap-x-8 md:flex md:flex-wrap md:gap-x-0">
              {badges.map((b, i) => (
                <li
                  key={b}
                  className={`py-3 pr-8 md:border-white/25 md:pl-8 ${i > 0 ? "md:border-l" : "md:pl-0"}`}
                >
                  <span className="type-label text-white/75">{b}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}
