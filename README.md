# Next.js Export Starter — 外贸 / 工厂询盘站模板

[![Next.js](https://img.shields.io/badge/Next.js-16-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](./LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/sasharun/nextjs-export-starter)

> 一套可直接跑起来的 **Next.js 外贸独立站 / 工厂 B2B 询盘站** 起步模板。  
> 英中双语 · 产品目录 · 询盘表单 · SEO 全套 · 移动端优先。  
> 改 `site/` 里的 JSON 就能换成你自己的工厂内容；询盘可一键接到邮箱（Resend）。

**不会写代码？** 先看 **[小白上线指南 docs/GO-LIVE.md](./docs/GO-LIVE.md)**：Fork → Vercel 部署 → 配邮箱 → 改内容。

---

## 这个模板解决什么

工厂老板和外贸业务员要的不是「又一个漂亮官网」，而是：

1. 海外买家 **3 秒看懂你做什么**
2. 产品规格 **能翻、能搜、能对比**
3. 想询价时 **表单真的能提交到你邮箱**
4. Google 能收录，手机打开不卡

---

## 功能清单

| 模块 | 说明 |
|------|------|
| **双语** | `en` 默认 + `zh`，`next-intl`，hreflang / canonical |
| **页面** | Home / Products / About / Quality / FAQ / Contact + 产品详情 |
| **Section 组件** | Hero、Stats、产品栅格、类目、认证墙、工厂图集、FAQ、询盘表单等 15+ |
| **数据驱动** | `site/blueprint.json` + `content-pack.json` + `theme.json` |
| **SEO** | Metadata、JSON-LD、sitemap、robots、Open Graph |
| **询盘后端** | `/api/inquiries`：Resend 发信 / Webhook / 本地日志；honeypot 防垃圾 |
| **可选 CMS** | Sanity 拉内容脚本（见 [docs/SANITY.md](./docs/SANITY.md)） |

**刻意不做**：购物车支付、重型自助 CMS、多租户后台。B2B 询盘站就该轻。

---

## 快速开始

```bash
git clone https://github.com/sasharun/nextjs-export-starter.git
cd nextjs-export-starter
pnpm install   # 或 npm i
pnpm dev
```

打开 [http://localhost:3000](http://localhost:3000)。

```bash
pnpm build && pnpm start
```

部署：GitHub 推送后接 [Vercel](https://vercel.com) 一键上线。

---

## 询盘怎么接到邮箱（后端）

默认：未配置时提交只打服务器日志（方便本地调试）。

**推荐（Resend，免费额度够起步）：**

1. 注册 [resend.com](https://resend.com)，创建 API Key  
2. 在 Vercel → Environment Variables 填写：

```bash
RESEND_API_KEY=re_xxxx
INQUIRY_TO_EMAIL=sales@yourcompany.com
INQUIRY_FROM_EMAIL=Inquiry Form <onboarding@resend.dev>
```

3. Redeploy，在 Contact 页提交一封测试  

测试发件人 `onboarding@resend.dev` **只能发到你的 Resend 注册邮箱**。正式对外请验证自己的域名，详见 **[docs/GO-LIVE.md](./docs/GO-LIVE.md)**。

**备选：** 设 `INQUIRY_WEBHOOK_URL` 转到 Make / 企微 / n8n。可与 Resend 同时开。

完整环境变量见 `.env.example`。

---

## 怎么换成你的工厂内容

主要改 `site/`：

| 文件 | 作用 |
|------|------|
| `content-pack.json` | 公司、产品、证书、FAQ（中英） |
| `site.json` | `base_url`（SEO） |
| `theme.json` | 主色方案 |
| `blueprint.json` | 页面与板块顺序 |
| `public/media/` | 图片（须有版权） |

可选：用 Sanity 网页改产品 → `node scripts/pull-from-sanity.mjs` 写回 JSON → 再部署。见 **[docs/SANITY.md](./docs/SANITY.md)**。

---

## 文档

| 文档 | 给谁看 |
|------|--------|
| [docs/GO-LIVE.md](./docs/GO-LIVE.md) | 小白：从 Fork 到收到第一封询盘 |
| [docs/SANITY.md](./docs/SANITY.md) | 进阶：Sanity 内容后台 |
| [DESIGN.md](./DESIGN.md) | 设计 tokens / 气质 |
| [PRODUCT.md](./PRODUCT.md) | 产品边界 |

---

## 技术栈

Next.js 16 · React 19 · TypeScript · Tailwind v4 · next-intl · zod  
询盘发信：Resend HTTP API（**无额外 npm 依赖**）

---

## 定制开发

我是 **Gavin**，[模酷科技 ModalCube](https://modalcube.com) 主理人，专注外贸独立站 / 工厂官网 / 询盘站 / 出海品牌站（Next.js）。

> 📧 xqi@live.com　💬 微信 gav1nq　🌐 https://modalcube.com

<p align="center">
  <img src="assets/qr-fuwuhao.png" width="160" alt="模酷科技微信">
  &nbsp;&nbsp;&nbsp;
  <img src="assets/qr-gongzhonghao.png" width="160" alt="模酷科技服务号">
</p>

- [外贸独立站资源大全](https://github.com/sasharun/awesome-waimao-dulizhan)
- [工厂官网资源大全](https://github.com/sasharun/awesome-gongchang-website)
- [询盘转化自查清单](https://github.com/sasharun/dulizhan-inquiry-checklist)

---

## License

代码 [MIT](./LICENSE)。样板文案与图片仅演示用，上线前请全部替换为你自己的内容与有版权素材。
