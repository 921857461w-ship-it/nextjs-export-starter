import {
  Archivo,
  Inter,
  Poppins,
  Manrope,
  Oswald,
  Source_Serif_4,
  Work_Sans,
  Barlow,
  Rubik,
  Jost,
} from "next/font/google";
import type { FontId } from "./theme-schema";

// 字体池：全部 preload:false —— @font-face 只在实际命中字符时才触发下载，
// 未被 theme 选中的字体不产生网络请求，只多出几 KB 的 CSS。
const archivo = Archivo({ subsets: ["latin"], variable: "--fp-archivo", axes: ["wdth"], display: "swap", preload: false });
const inter = Inter({ subsets: ["latin"], variable: "--fp-inter", display: "swap", preload: false });
const poppins = Poppins({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--fp-poppins", display: "swap", preload: false });
const manrope = Manrope({ subsets: ["latin"], variable: "--fp-manrope", display: "swap", preload: false });
const oswald = Oswald({ subsets: ["latin"], variable: "--fp-oswald", display: "swap", preload: false });
const sourceSerif = Source_Serif_4({ subsets: ["latin"], variable: "--fp-source-serif", display: "swap", preload: false });
const workSans = Work_Sans({ subsets: ["latin"], variable: "--fp-work-sans", display: "swap", preload: false });
const barlow = Barlow({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--fp-barlow", display: "swap", preload: false });
const rubik = Rubik({ subsets: ["latin"], variable: "--fp-rubik", display: "swap", preload: false });
const jost = Jost({ subsets: ["latin"], variable: "--fp-jost", display: "swap", preload: false });

const POOL: Record<FontId, { variable: string; css: string }> = {
  archivo: { variable: archivo.variable, css: "var(--fp-archivo)" },
  inter: { variable: inter.variable, css: "var(--fp-inter)" },
  poppins: { variable: poppins.variable, css: "var(--fp-poppins)" },
  manrope: { variable: manrope.variable, css: "var(--fp-manrope)" },
  oswald: { variable: oswald.variable, css: "var(--fp-oswald)" },
  "source-serif": { variable: sourceSerif.variable, css: "var(--fp-source-serif)" },
  "work-sans": { variable: workSans.variable, css: "var(--fp-work-sans)" },
  barlow: { variable: barlow.variable, css: "var(--fp-barlow)" },
  rubik: { variable: rubik.variable, css: "var(--fp-rubik)" },
  jost: { variable: jost.variable, css: "var(--fp-jost)" },
};

// 返回：需要挂到 <html> 的 className（选中字体的变量）+ 字体 CSS 值
export function resolveFonts(heading: FontId, body: FontId) {
  const classNames = [...new Set([POOL[heading].variable, POOL[body].variable])].join(" ");
  return {
    classNames,
    headingCss: POOL[heading].css,
    bodyCss: POOL[body].css,
  };
}
