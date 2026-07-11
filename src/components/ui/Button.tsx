import type { ComponentProps } from "react";
import { Link } from "@/i18n/navigation";

type Variant = "primary" | "accent" | "outline" | "inverse";

const BASE =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-(--radius-btn) px-6 py-2.5 text-sm font-semibold tracking-wide transition-colors duration-150 select-none";

const VARIANTS: Record<Variant, string> = {
  primary: "bg-primary text-on-primary hover:bg-primary/90",
  accent: "bg-accent text-on-accent hover:bg-accent/90",
  // 浅底描边；进入 .tone-dark 子树后 border/文字自动跟随语义色
  outline: "border border-ink/30 text-ink hover:border-ink hover:bg-ink/5",
  // 深色/主色底上的白描边
  inverse:
    "border border-white/40 text-white hover:border-white hover:bg-white/10",
};

export function buttonClass(variant: Variant = "primary") {
  return `${BASE} ${VARIANTS[variant]}`;
}

type ButtonLinkProps = {
  href: string;
  variant?: Variant;
  external?: boolean;
} & Omit<ComponentProps<"a">, "href" | "className">;

// 站内链接走 locale 感知 Link；external（wa.me / mailto 等）走原生 <a>
export function ButtonLink({
  href,
  variant = "primary",
  external,
  children,
  ...rest
}: ButtonLinkProps) {
  const cls = buttonClass(variant);
  if (external || /^(https?:|mailto:|tel:)/.test(href)) {
    return (
      <a href={href} className={cls} {...rest}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={cls} {...rest}>
      {children}
    </Link>
  );
}
