import { defineRouting } from "next-intl/routing";

// EN 默认 + zh；Phase 2 扩西语/阿语只是往 locales 加项 + 加 messages 文件
export const routing = defineRouting({
  locales: ["en", "zh"],
  defaultLocale: "en",
  // hreflang/canonical 由 lib/seo.ts 的 Metadata 统一输出；
  // 关闭中间件的 Link 头注入，避免与 canonical 冲突（Lighthouse canonical 审计）
  alternateLinks: false,
});
