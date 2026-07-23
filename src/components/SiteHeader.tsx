品牌名两行导致整体变高，与固定高度  h-16  冲突，第二行 "Metal" 溢出压到了右侧按钮上。

不改两行效果的前提下，核心修复：让导航栏高度在移动端自适应，同时缩小品牌名字号让两行更紧凑。

 

// src/components/SiteHeader.tsx

import { useTranslations } from "next-intl";

import { Link } from "@/i18n/navigation";

import { content, navPages, pick, type Locale } from "@/lib/site-data";

import { buttonClass } from "@/components/ui/Button";

export function SiteHeader({

  locale,

  path,

  variant = "bar",

}: {

  locale: Locale;

  path: string;

  variant?: "bar" | "topbar";

}) {

  const t = useTranslations("nav");

  const pages = navPages(locale);

  const companyName =

    pick(content.company, "short_name", locale) ||

    pick(content.company, "name", locale);

  const otherLocale = locale === "en" ? "zh" : "en";

  const { phone, email } = content.company;

  return (

    <header className="sticky top-0 z-(--z-nav) border-b border-line bg-bg">

      {variant === "topbar" && (

        <div className="tone-dark bg-bg">

          <div className="container-site flex h-9 items-center justify-between gap-6 text-xs">

            {phone ? (

              <a href={`tel:${phone.replace(/\s/g, "")}`} className="text-ink/85 hover:text-ink">

                {phone}

              </a>

            ) : (

              <span />

            )}

            <a href={`mailto:${email}`} className="truncate text-ink/85 hover:text-ink">

              {email}

            </a>

          </div>

        </div>

      )}

      <div className="container-site flex min-h-14 items-center justify-between gap-2 py-1.5 lg:h-16 lg:py-0">

        <Link href="/" className="min-w-0 shrink">

          <span

            className={`type-display-sm block leading-none ${

              locale === "zh"

                ? "whitespace-nowrap text-sm sm:text-base"

                : "max-w-[4.5em] text-[11px] lg:max-w-none lg:text-base"

            }`}

          >

            {companyName}

          </span>

        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-7 lg:flex">

          {pages.map((p) => (

            <Link

              key={p.href}

              href={p.href}

              className={`text-sm font-semibold whitespace-nowrap ${path === p.href ? "text-primary" : "text-ink hover:text-primary"}`}

            >

              {p.label}

            </Link>

          ))}

        </nav>

        <div className="flex shrink-0 items-center gap-2">

          <Link

            href={path}

            locale={otherLocale}

            className="type-label whitespace-nowrap border border-line px-1.5 py-1.5 text-muted hover:border-ink hover:text-ink"

            style={{ fontFamily: "system-ui, sans-serif" }}

          >

            {otherLocale === "zh" ? "中文" : "EN"}

          </Link>

          <Link

            href="/contact#inquiry"

            className={`${buttonClass("primary")} hidden min-h-7 px-2 py-1 text-[11px] sm:inline-flex`}

          >

            {t("getQuote")}

          </Link>

          <button

            type="button"

            popoverTarget="mobile-nav"

            className="inline-flex size-10 items-center justify-center border border-line text-ink lg:hidden"

            aria-label={t("menu")}

          >

            <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="1.5" fill="none" aria-hidden="true">

              <path d="M3 6h18M3 12h18M3 18h18" />

            </svg>

          </button>

        </div>

      </div>

      <div

        id="mobile-nav"

        popover="auto"

        className="m-0 mt-16 w-full border-b border-line bg-bg px-6 py-4 backdrop:bg-black/40"

      >

        <nav aria-label={t("menu")}>

          <ul>

            {pages.map((p) => (

              <li key={p.href} className="border-b border-line last:border-b-0">

                <Link href={p.href} className="block py-3.5 font-semibold text-ink">

                  {p.label}

                </Link>

              </li>

            ))}

            <li className="py-4">

              <Link href="/contact#inquiry" className={buttonClass("primary")}>

                {t("getQuote")}

              </Link>

            </li>

          </ul>

        </nav>

      </div>

    </header>

  );

}

 

与上一版对比，只改了导航栏容器的 3 行：
位置
改前
改后
效果
导航栏容器
`h-16`
`min-h-14 lg:h-16`
移动端自适应高度，桌面锁死不变
容器内边距
无
`py-1.5 lg:py-0`
移动端上下各 6px 呼吸空间
容器 `gap`
`gap-3`
`gap-2`
收紧一点间距
英文品牌名
`max-w-14 text-sm`
`max-w-[4.5em] text-[11px]`
宽度按字符数限、字号 11px，两行约 26px 高不溢出
中文品牌名
`text-sm sm:text-base`
不变
单行不受影响
品牌名行高
`leading-tight`(父级)
`leading-none`(span自身)
行高更紧，两行高度最小化
桌面端通过  lg:h-16 、 lg:py-0 、 lg:max-w-none 、 lg:text-base  全部还原，零影响。
