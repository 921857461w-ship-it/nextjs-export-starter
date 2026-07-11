# 用 Sanity 管理内容（可选进阶）

> 先完成 [GO-LIVE.md](./GO-LIVE.md) 里的 **Resend 收信 + Vercel 上线**。  
> 本篇只解决：不想手改 JSON 时，用 Sanity 网页后台改公司 / 产品，再同步回本仓库。

## 适合谁

- 产品经常增减  
- 业务要自己改文案，不想碰代码仓库  

## 不适合谁

- 产品半年改一次 → 直接改 `site/content-pack.json` 更简单  
- 完全不能跑 Node、也不想找人 → 先别上 CMS  

## 思路（故意保持简单）

```
Sanity Studio（网页改）
      ↓  pnpm content:pull
site/content-pack.json
      ↓  git push → Vercel
线上站更新
```

构建时仍读本地 JSON，**运行时不依赖 Sanity**。CMS 挂了也不影响已上线页面。

---

## 1. 创建 Sanity 项目

1. [sanity.io](https://www.sanity.io/) 注册 → 新建 Project → 记下 **Project ID**  
2. Dataset 用 `production`  
3. API → Tokens → 建 **Viewer** token（给 pull 脚本读数据）  

单独建 Studio（建议与本站仓库分开）：

```bash
npm create sanity@latest
```

把本仓库 [`sanity/schema-stub.ts`](../sanity/schema-stub.ts) 里的 `company` / `product` 拷进 Studio 的 schema 并注册。

字段与 `content-pack.json` 对齐，例如 product 需要：

- `id`（URL slug）  
- `category`（对应 categories[].id，如 `hex-nuts`）  
- `name_en` / `name_zh` / `model` / `moq`  
- `specs[]`：`label_en` / `label_zh` / `value`  
- `image_file`（推荐填 `public/media` 下文件名）或上传 `image`  

---

## 2. 在 Studio 里填内容并 Publish

至少：1 条 Company、几条 Product。

---

## 3. 拉回网站仓库

```bash
cp .env.example .env.local
# 填写：
# SANITY_PROJECT_ID=xxxx
# SANITY_DATASET=production
# SANITY_API_TOKEN=sk...
```

```bash
pnpm content:pull
# 等同 node scripts/pull-from-sanity.mjs
```

脚本会：

- 合并 company 字段  
- 用 Sanity 的 products **整体替换** pack 里的 products（并转成站点用的 `specs` 二维数组、`images[]`）  
- 保留 categories / faq / hero 等未在 CMS 管理的块  

然后：

```bash
pnpm build
git add site/content-pack.json && git commit -m "content: sync from Sanity" && git push
```

---

## 4. 图片

| 做法 | 说明 |
|------|------|
| **推荐** | 图仍放 `public/media/`，Sanity 只填 `image_file`（如 `product-01.jpg`） |
| 省事 | Studio 上传图，脚本写入 CDN URL；需在 `next.config.ts` 放行 `cdn.sanity.io` |

---

## 和「全站实时 Sanity」的区别

| | 本方案 | 运行时直连 Sanity |
|--|--------|-------------------|
| 速度 | 构建静态，稳 | 要 ISR/SSR |
| 心智 | 改完拉一次 | token / webhook / 草稿预览 |
| CMS 故障 | 线上仍可用旧 JSON | 可能空数据 |

询盘站产品不天天爆改时，JSON + 偶尔 pull 足够。

---

## 代做

建 Studio、对字段、GitHub Action 自动 pull、或完整预览式 CMS：  
xqi@live.com · 微信 gav1nq · https://modalcube.com
