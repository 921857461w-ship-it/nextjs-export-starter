import { z } from "zod";
import Image from "next/image";
import { ButtonLink } from "@/components/ui/Button";

export const heroSchema = z.object({
  // 版式变体：editorial = 左对齐钢印（自有语言默认）；centered = 居中大图白字（对标站常见版式）
  variant: z.enum(["editorial", "centered"]).default("editorial"),
  headline: z.string(),
  subline: z.string().optional(),
  ctas: z.array(z.object({ label: z.string(), href: z.string() })).max(2),
  image: z.string(),
  imageAlt: z.string().default(""),
  // 图纸标题栏徽章：ISO 编号 / Since 年份 / 认证名，数据化的信任元素（editorial 版式专属）
  badges: z.array(z.string()).max(4).default([]),
});
export type HeroProps = z.infer<typeof heroSchema>;

// 首屏。LCP 元素：背景图 priority preload；深底子树语义色自动翻转。
export function Hero({ variant, headline, subline, ctas, image, imageAlt, badges }: HeroProps) {
  if (variant === "centered") {
    return (
      <section data-section="hero" className="tone-dark relative isolate flex min-h-[min(72svh,44rem)] flex-col items-center justify-center overflow-hidden bg-bg">
        <Image src={image} alt={imageAlt} fill priority quality={50} sizes="100vw" className="object-cover" />
        {/* 遮罩带品牌色相（--hero-scrim 由 theme 生成）：贴近目标站"品牌色调蒙版大图"的常见处理 */}
        <div aria-hidden="true" className="absolute inset-0 bg-(--hero-scrim,black)/65" />
        <div className="container-site relative w-full py-24 text-center">
          <h1 className="type-display anim-rise mx-auto max-w-4xl text-[clamp(2.4rem,1.8rem+2.8vw,4rem)] text-white">
            {headline}
          </h1>
          {subline && (
            <p className="anim-rise-late mx-auto mt-6 max-w-2xl text-lg text-white/90">{subline}</p>
          )}
          {ctas.length > 0 && (
            <div className="anim-rise-late mt-9 flex flex-wrap justify-center gap-4">
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
    <section data-section="hero" className="tone-dark relative isolate flex min-h-[min(82svh,52rem)] flex-col justify-end overflow-hidden bg-bg">
      <Image
        src={image}
        alt={imageAlt}
        fill
        priority
        quality={50}
        sizes="100vw"
        className="object-cover"
      />
      {/* 左向 scrim 保证标题对比度（≥4.5:1 由深底渐变承担） */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-linear-to-r from-black/78 via-black/55 to-black/15"
      />

      <div className="container-site relative w-full pt-40 pb-14">
        <div className="max-w-3xl">
          <h1 className="type-display anim-rise text-white">{headline}</h1>
          {subline && (
            <p className="anim-rise-late mt-6 max-w-xl text-lg text-white/85">
              {subline}
            </p>
          )}
          {ctas.length > 0 && (
            <div className="anim-rise-late mt-9 flex flex-wrap gap-4">
              {ctas.map((cta, i) => (
                <ButtonLink
                  key={cta.href}
                  href={cta.href}
                  variant={i === 0 ? "primary" : "inverse"}
                >
                  {cta.label}
                </ButtonLink>
              ))}
            </div>
          )}
        </div>

        {/* 图纸标题栏：唯一的角部签名件 */}
        {badges.length > 0 && (
          <div className="mt-14 border-t border-white/25">
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
