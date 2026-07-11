import type { Metadata } from "next";
import { Noto_Sans_SC } from "next/font/google";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { content, pick, site, type Locale } from "@/lib/site-data";
import { theme, themeCssVars } from "@/lib/theme";
import { resolveFonts } from "@/lib/font-pool";
import "../globals.css";

// 中文按 unicode-range 分片按需加载；en 页面不会下载任何 CJK 分片
const notoSansSC = Noto_Sans_SC({
  subsets: [],
  variable: "--font-noto-sc",
  display: "swap",
  preload: false,
});

const fonts = resolveFonts(theme.type.heading_font, theme.type.body_font);

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const l = (locale === "zh" ? "zh" : "en") as Locale;
  const name = pick(content.company, "name", l);
  return {
    title: { default: name, template: `%s — ${name}` },
    description: pick(content.company, "tagline", l) || undefined,
    metadataBase: new URL(site.base_url),
  };
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const l = locale as Locale;
  const orgJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: pick(content.company, "name", l),
    url: site.base_url,
    email: content.company.email,
    foundingDate: content.company.founded ? String(content.company.founded) : undefined,
    address: {
      "@type": "PostalAddress",
      streetAddress: pick(content.company, "address", l),
      addressCountry: "CN",
    },
  };

  // theme.json → CSS 变量（inline style 优先级高于 stylesheet 默认值）
  const cssVars = {
    ...themeCssVars(),
    "--font-heading": fonts.headingCss,
    "--font-body": fonts.bodyCss,
  } as React.CSSProperties;

  return (
    <html
      lang={locale === "zh" ? "zh-CN" : "en"}
      className={`${fonts.classNames} ${notoSansSC.variable}`}
      style={cssVars}
    >
      <body className="antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
        <NextIntlClientProvider>{children}</NextIntlClientProvider>
      </body>
    </html>
  );
}
