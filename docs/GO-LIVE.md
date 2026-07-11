# 小白上线指南：从 clone 到收到第一封询盘邮件

目标：不太会写代码，也能把这个外贸询盘站挂上线，并在有人填表时**真的收到邮件**。

整条路径大约 30–60 分钟。按顺序做即可。

---

## 你需要准备

| 东西 | 做什么用 | 要不要付钱 |
|------|----------|------------|
| GitHub 账号 | 放代码 | 免费 |
| [Vercel](https://vercel.com) 账号 | 免费部署网站（建议用 GitHub 登录） | 免费额度够用 |
| [Resend](https://resend.com) 账号 | 把询盘发到你的邮箱 | 免费额度够起步 |
| 一个收信邮箱 | 比如 `sales@你的公司.com` 或个人邮箱 | — |
| （可选）自己的域名 | 正式站、发信域名 | 域名年费 |

**不需要**自己买服务器、不需要会 Node 后端。

---

## 路线总览

```
1. 复制本仓库到你的 GitHub
2. 用 Vercel 一键部署（先能打开网页）
3. 配 Resend，让表单能发到你邮箱
4. 改 site/ 里的公司名、产品、图片
5. （可选）接自己的域名
6. （进阶）用 Sanity 在网页后台改产品，再一键拉回本仓库
```

内容后台（Sanity）不是第一步。**先让站上线、询盘能进邮箱**，再考虑 CMS。

---

## 第 1 步：拿到代码

### 方式 A（推荐）：GitHub 网页 Fork / Use this template

1. 打开本仓库页面  
2. 点 **Fork** 或 **Use this template** → 进你自己的账号  
3. 记住仓库地址，例如 `https://github.com/你的用户名/nextjs-export-starter`

### 方式 B：本机命令行

```bash
git clone https://github.com/sasharun/nextjs-export-starter.git
cd nextjs-export-starter
pnpm install   # 没有 pnpm 就用 npm install
pnpm dev
```

浏览器打开 http://localhost:3000 ，应能看到英文样板站。

---

## 第 2 步：部署到 Vercel（先能访问）

1. 打开 [vercel.com](https://vercel.com) → 用 GitHub 登录  
2. **Add New Project** → 选中你 fork 的仓库 → **Deploy**  
3. 不用改构建设置，默认即可  
4. 等 1–2 分钟，拿到一个地址，类似：  
   `https://nextjs-export-starter-xxx.vercel.app`

打开后：

- 英文：`/en` 或根路径（会进默认语言）  
- 中文：`/zh`

此时**表单能提交，但邮件还不会发到你邮箱**（没配密钥时只在服务器日志里）。继续第 3 步。

---

## 第 3 步：让询盘发到你邮箱（Resend）

### 3.1 注册 Resend

1. 打开 [resend.com](https://resend.com) 注册  
2. **API Keys** → Create → 复制一串 `re_xxxx`（只显示一次，先存好）

### 3.2 先用「测试发信」（最快验证）

Resend 新账号可以用测试发件人：`onboarding@resend.dev`  
**限制**：只能发到**你注册 Resend 时用的那个邮箱**。

在 Vercel 项目里：

1. **Settings → Environment Variables**  
2. 添加：

| Name | Value | 说明 |
|------|--------|------|
| `RESEND_API_KEY` | `re_xxxx` | 刚复制的密钥 |
| `INQUIRY_TO_EMAIL` | 你的邮箱 | 接收询盘的地址（测试期建议 = Resend 注册邮箱） |
| `INQUIRY_FROM_EMAIL` | `Inquiry Form <onboarding@resend.dev>` | 测试发件人 |

3. 保存后 **Redeploy** 一次（Deployments → 最新那次 → Redeploy）

### 3.3 测一封询盘

1. 打开线上站 → Contact  
2. 填姓名、邮箱、留言 → Submit  
3. 去 `INQUIRY_TO_EMAIL` 收件箱（含垃圾箱）看是否收到  
4. 点邮件里 Reply，应能直接回给填写表单的买家邮箱（`reply_to` 已设）

收到 = 后端已经接通。

### 3.4 正式环境：用自己的域名发信（推荐）

测试发件人只能发给自己。给真实买家用时：

1. Resend → **Domains** → 添加你的域名（如 `mail.yourfactory.com` 或根域）  
2. 按提示在域名 DNS 加 SPF / DKIM 记录，等到 **Verified**  
3. Vercel 环境变量改成例如：

```text
INQUIRY_FROM_EMAIL=Inquiry <inquiry@mail.yourfactory.com>
INQUIRY_TO_EMAIL=sales@yourfactory.com
```

4. 再 Redeploy

### 3.5 不想用 Resend？用 Webhook

在 Make.com / n8n / 自建接口收 JSON，然后转发到企微、飞书、邮箱：

```text
INQUIRY_WEBHOOK_URL=https://hook.eu1.make.com/xxxx
```

可与 Resend **同时开**（邮件 + 群通知）。

---

## 第 4 步：换成你自己的工厂内容

**不用改 React 代码。** 主要改这几个文件：

| 文件 | 改什么 |
|------|--------|
| `site/content-pack.json` | 公司名、简介、WhatsApp、邮箱、产品、证书、FAQ（中英都有） |
| `site/site.json` | `base_url` 改成你的正式域名（影响 SEO / sitemap） |
| `site/theme.json` | 主色方案（`machine` / `signal` / `oxide`） |
| `site/blueprint.json` | 页面有哪些、板块顺序（一般先不动） |
| `public/media/` | 产品图、厂房、证书（**请用你有版权的图**） |

### 最小必改清单（上线前）

- [ ] `company.name_en` / `name_zh`  
- [ ] `company.email` / `whatsapp` / `phone` / `address_*`  
- [ ] `hero` 标题与副文案  
- [ ] 至少 3–6 个真实产品（名称、参数、图）  
- [ ] `public/media/` 换成自己的图  
- [ ] `site.json` → `base_url`  
- [ ] 删掉或改掉样板站虚构品牌「Haiwei Fastener」相关文案  

改完 → `git push` → Vercel 自动重新部署。

本地预览：

```bash
pnpm dev
```

---

## 第 5 步：绑自己的域名（可选）

1. Vercel 项目 → **Settings → Domains** → 添加 `www.yourfactory.com`  
2. 按提示改 DNS（A / CNAME）  
3. 证书自动签  
4. 更新 `site/site.json` 的 `base_url` 为 `https://www.yourfactory.com` 并 push  

---

## 第 6 步（进阶）：用 Sanity 在网页里改产品

适合：经常改产品、不想每次手改 JSON 的人。

说明见 **[docs/SANITY.md](./SANITY.md)**。  
思路是：

1. 在 Sanity 网页后台改公司 / 产品  
2. 运行一条命令，把内容拉进 `site/content-pack.json`  
3. 再部署  

不会写代码也能用 Studio；拉内容那一步需要本机装 Node，或让开发帮你配 GitHub Action。

---

## 常见问题

### 提交显示成功，但没收到邮件？

1. 看 Vercel 是否配置了 `RESEND_API_KEY` 和 `INQUIRY_TO_EMAIL`  
2. 是否 Redeploy 过  
3. 测试发件人是否只能发到 Resend 注册邮箱  
4. 查垃圾箱  
5. Vercel → Deployments → 点进 → **Functions / Logs**，搜 `[inquiries]`

### 表单一直报错？

- 姓名、邮箱、留言为必填  
- 邮箱格式要合法  
- 若配了 Resend 但密钥错误，接口会返回失败（页面显示 error）

### 会不会被垃圾询盘刷爆？

表单带了隐藏 honeypot 字段。进阶可再加 [Cloudflare Turnstile](https://developers.cloudflare.com/turnstile/)（需要的话可提 Issue 或找我加）。

### 一定要 Sanity 吗？

**不需要。** 多数工厂站产品不天天改，直接改 `content-pack.json` 最省事。产品上百、多人协作再上 Sanity。

### 我想要「登录后台点几下就改站」全托管？

那是定制交付范围（本开源模板故意不做重 CMS / 多租户）。可联系：

- 邮箱：xqi@live.com  
- 微信：gav1nq  
- 案例：https://modalcube.com  

---

## 检查清单（上线日）

- [ ] Vercel 能打开中英文页面  
- [ ] 自己提交一封测试询盘，邮箱收到  
- [ ] 点回复能回到测试用的买家邮箱  
- [ ] 公司名 / 联系方式 / 产品已不是样板数据  
- [ ] 图片是自己的  
- [ ] `base_url` 与正式域名一致  
- [ ] 手机微信里打开首页，排版正常  

做完以上，你的询盘站就算真正「接上后端」了。
