# 从零搭建一个像 pyj9.com 的个人网站

写给一个想自己拥有一个站，但被「域名、服务器、HTTPS、CI/CD」这些词吓住的人。

读完之后你应该能：
- 用四层心智模型理解"网站"这件事
- 跟着实操章节，独立把一个新站搭起来上线
- 出问题时知道去哪一层查

本文档以 [pyj9.com](https://pyj9.com) 的真实搭建过程为蓝本。技术栈：Next.js 16 + Tailwind v4 + MDX + next-intl，部署在 Vercel，域名在阿里云。

---

## Part 1 / 心智模型：网站是分层的

一个看起来很简单的"个人网站"，背后是**四层独立的系统**串在一起。理解分层，你就知道任何问题该去哪一层查。

```
┌─────────────────────────────────────────────────────────┐
│  内容层（Content）                                       │
│  你的文章、项目、简介——你每天关心的东西                  │
│  形式：MDX 文件、Markdown、图片、视频                    │
└───────────────────────┬─────────────────────────────────┘
                        │
┌───────────────────────▼─────────────────────────────────┐
│  应用层（Application）                                   │
│  网站的"皮"和"骨架"——把内容渲染成网页                    │
│  形式：Next.js 代码 / 组件 / 路由 / 设计系统             │
└───────────────────────┬─────────────────────────────────┘
                        │
┌───────────────────────▼─────────────────────────────────┐
│  托管层（Hosting）                                       │
│  让你的代码 24 小时跑在公网某台机器上                    │
│  形式：Vercel / Netlify / Cloudflare Pages              │
└───────────────────────┬─────────────────────────────────┘
                        │
┌───────────────────────▼─────────────────────────────────┐
│  域名层（Domain）                                        │
│  把"pyj9.com"这个人话名字翻译成机器能找到的 IP 地址      │
│  形式：注册商（阿里云）+ DNS 解析记录                    │
└─────────────────────────────────────────────────────────┘
                        ▲
                        │
                      用户
```

### 每一层在出问题时怎么定位

| 现象 | 通常是哪一层的事 |
|---|---|
| 域名打不开 / DNS 查不到 | **域名层** |
| 域名能打开但显示"Vercel 默认页"或 404 | **托管层**（项目没绑域名 / 没部署） |
| 网站能开但样式错乱 / 报错 | **应用层** |
| 网站能开但内容显示不对 / 文章不见 | **内容层** |

---

## Part 2 / 四层逐层讲清楚

### 第一层：域名层（Domain）

#### 域名是什么

域名是给 IP 地址起的人话名字。互联网上每台机器都有一个 IP（比如 `76.76.21.21`），但人类记不住数字。所以有了 DNS（域名系统）：你输入 `pyj9.com`，DNS 帮你查到 `76.76.21.21`，浏览器再去连那台机器。

#### 域名怎么来的

去**域名注册商**买。

| 注册商 | 适合 | 价格（.com 年费） |
|---|---|---|
| **阿里云** | 国内开发者，支付方便，控制台中文 | ¥80 左右 |
| 腾讯云 | 同上 | ¥80 左右 |
| Cloudflare Registrar | 没溢价、最便宜、但需要海外信用卡 | $9.77（≈¥70） |
| Namecheap / GoDaddy | 海外通用，英文界面 | $10-15 |

> 国内身份的话，**首选阿里云**——支付宝直接付、控制台中文、买完即用。代价是必须做"实名认证"（上传身份证），首次 1-3 天。

#### 买域名要注意的几件事

1. **后缀**：`.com` 永远是首选。`.dev` `.io` `.me` 适合极客。`.cn` 需要 ICP 备案（你的站如果不在国内服务器上，**别用 .cn**）
2. **隐私保护**：买完去控制台开启 **WHOIS 信息保护**，否则你的手机号、邮箱、家庭住址会公开在 WHOIS 数据库里被骚扰
3. **域名锁**：开启 **注册商锁定**，防止域名被恶意转移
4. **自动续费**：开启，过期被人抢注后悔莫及

#### DNS 解析：把域名指到服务器

买了域名，还得告诉 DNS：「`pyj9.com` 这个名字，请指向那台 IP 是 `76.76.21.21` 的机器」。这就叫**加解析记录**。

最常用的两种记录类型：

| 类型 | 干嘛的 | 例子 |
|---|---|---|
| **A** | 把域名指向一个 IPv4 地址 | `pyj9.com → 76.76.21.21` |
| **CNAME** | 把域名指向另一个域名（别名） | `www.pyj9.com → cname.vercel-dns.com` |

> 还有 MX（邮件）、TXT（验证）、AAAA（IPv6）等，做个人站基本用不上 A + CNAME 就够。

#### 国内 DNS 的特殊性

- 国内 DNS 服务器（阿里云、114、电信公共 DNS）通常 **10-30 分钟生效**
- 海外 DNS（Google `8.8.8.8`、Cloudflare `1.1.1.1`）可能要 **30 分钟 - 数小时**
- 极端情况 24 小时

验证 DNS 是否生效：

```bash
dig pyj9.com +short              # 看返回的 IP
dig @8.8.8.8 pyj9.com +short     # 用 Google DNS 看
```

或者上 https://www.whatsmydns.net/ 看全球各地解析情况。

---

### 第二层：托管层（Hosting）

#### 为什么不放自己服务器

理论上你可以买台 VPS（云服务器）自己跑——但你要处理：
- Linux 系统维护、安全补丁
- Nginx / Caddy 配置
- HTTPS 证书申请 + 90 天续期
- 进程守护、日志、备份
- 防 DDoS

对一个个人站来说，**纯属浪费时间**。现代做法是用**托管平台**，它把上面所有事都帮你做了，免费。

#### 主流托管平台对比

| 平台 | 强项 | 免费额度 | 建议 |
|---|---|---|---|
| **Vercel** | Next.js 亲爹，零配置，自动 CI/CD | Hobby 计划完全免费 | **首选**，本教程用它 |
| Netlify | 老牌，对静态站友好 | 类似 | 备选 |
| Cloudflare Pages | 全球 CDN 最快，国内访问加分 | 慷慨 | 备选（界面英文） |
| GitHub Pages | 静态站、纯免费 | 1 GB | 不支持 Next.js SSR |

#### Vercel 的核心机制：Git 触发部署

```
你本地写代码
    ↓ git push
GitHub 仓库（代码的"权威副本"）
    ↓ Vercel 监听 push
Vercel 构建机器（拉代码 → npm install → next build）
    ↓ 部署
全球 CDN 节点（用户访问最近的节点）
    ↓
用户的浏览器
```

**关键概念：你不需要登录任何服务器去"上传"任何东西**。你只 `git push`，剩下的全是自动的。

#### HTTPS 证书：免费、自动、永不过期

- Vercel 在你绑定自定义域名后，**自动**用 Let's Encrypt 签发 HTTPS 证书
- 证书 90 天过期，**Vercel 在到期前 30 天自动续**
- 你这辈子都不需要碰证书

---

### 第三层：应用层（Application）

这一层是「网站本身」。前两层都是基础设施，这一层是**你的设计、你的代码、你的产品决策**。

#### 框架选型为什么用 Next.js

| 框架 | 适合的人 |
|---|---|
| **Next.js** | 想要"会写代码 + 想要 SEO + 想要博客 + 想要交互"的全栈个人站 |
| Astro | 内容主导（博客）、强 SEO、性能极致 |
| Vue + Vite | 偏好 Vue 生态，做 SPA |
| 纯静态（Hugo/Jekyll） | 只发文章、追求构建极快 |

我们选 **Next.js 16 + App Router**，因为：
- React 生态最庞大，组件、动效、库都最全
- Vercel 是 Next.js 亲爹，零配置部署
- 既支持静态生成（SEO 友好），又能跑 Server Component（未来想接 AI 接口直接用）

#### 关键依赖与作用

| 库 | 作用 |
|---|---|
| **next** | 框架本身 |
| **react / react-dom** | UI 基础 |
| **typescript** | 类型安全 |
| **tailwindcss v4** | 原子化 CSS，写样式快 |
| **next-intl** | 中英双语路由 + 翻译 |
| **@next/mdx + next-mdx-remote** | 用 MDX 写文章（Markdown + JSX） |
| **gray-matter** | 解析 MDX 文件头部的 frontmatter |
| **reading-time** | 计算文章阅读时长 |
| **rehype-slug / rehype-autolink-headings** | 文章标题自动生成 id 和锚点链接 |
| **remark-gfm** | 支持 GitHub 风味 Markdown（表格、删除线等） |
| **feed** | 生成 RSS 订阅源 |
| **framer-motion** | React 动效库 |
| **lucide-react** | 图标 |

#### 项目目录结构

```
nineyweb/
├─ app/
│  ├─ [locale]/                    多语言路由根
│  │  ├─ layout.tsx                共用布局：导航 + 页脚 + 字体加载
│  │  ├─ page.tsx                  首页
│  │  ├─ writing/
│  │  │  ├─ page.tsx               文章列表
│  │  │  └─ [slug]/page.tsx        文章详情（动态路由）
│  │  ├─ projects/
│  │  ├─ about/
│  │  ├─ now/
│  │  └─ contact/
│  ├─ rss.xml/route.ts             RSS 端点
│  └─ globals.css                  全局样式 + 设计 token
├─ components/                     React 组件
│  ├─ Nav.tsx / Footer.tsx
│  ├─ HeroPulse.tsx                首页主视觉
│  ├─ Ticker.tsx / Chips.tsx
│  ├─ TimelineRow.tsx
│  ├─ CopyEmail.tsx
│  └─ mdx/MDXComponents.tsx        MDX 渲染时用到的组件
├─ content/                        所有内容
│  └─ writing/
│     ├─ zh/                       中文文章
│     │  └─ *.mdx
│     └─ en/                       英文文章
├─ i18n/                           next-intl 配置
│  ├─ routing.ts                   定义 locales
│  ├─ navigation.ts                Link/router 包装
│  └─ request.ts                   按 locale 加载翻译
├─ lib/                            工具函数
│  ├─ posts.ts                     读 MDX、解析 frontmatter
│  ├─ projects.ts                  项目数据
│  ├─ site.ts                      站点配置（域名、邮箱、社交）
│  └─ cn.ts                        Tailwind className 合并工具
├─ messages/                       i18n 翻译
│  ├─ zh.json
│  └─ en.json
├─ public/                         静态资源（图片、favicon）
├─ next.config.ts                  Next.js + MDX 配置
├─ proxy.ts                        请求中间件（Next 16 改名，原 middleware.ts）
├─ tailwind.config.ts / postcss.config.mjs
└─ package.json
```

#### 设计系统在哪里

打开 `app/globals.css`，所有色板和字体都是 CSS 变量：

```css
:root {
  --ink: #0F0F12;             /* 主文字色 */
  --paper: #FAFAF7;           /* 主背景米白 */
  --volt: #7C5CFF;            /* 签名色（Volt 紫） */
  --volt-tint: #EFEAFF;       /* 签名色浅版 */
  ...
}
```

**改这一个文件就能换全站调性**。把 `--volt` 改成你喜欢的颜色，整站立刻变。

字体在 `app/[locale]/layout.tsx` 通过 `next/font/google` 加载：

```tsx
const fraunces = Fraunces({ ... });   // 衬线大标题
const inter = Inter({ ... });         // 无衬线正文
const jbMono = JetBrains_Mono({ ... }); // 等宽
const notoSerifSC = Noto_Serif_SC({ ... });  // 中文衬线
const notoSansSC = Noto_Sans_SC({ ... });    // 中文无衬线
```

---

### 第四层：内容层（Content）

内容层独立于应用层——理论上你换一套代码、内容不变就能上线一个新外观的站。

#### MDX 文件结构

每篇文章是 `content/writing/zh/<slug>.mdx`，开头是 frontmatter（用 `---` 包起来的 YAML），后面是正文：

```mdx
---
title: "文章标题"
description: "一句话简介，列表页和 SEO 都会用"
date: "2026-05-13"
tags: ["产品方法论", "AI"]
draft: false
---

正文从这里开始。**Markdown 全部支持**：

## 二级标题

普通段落、**加粗**、*斜体*、[链接](https://example.com)、`行内代码`。

> 引用块

- 无序列表
- 项二

1. 有序列表
2. 项二

```js
代码块也行
```

<Callout type="tip">
带颜色的提示框，type 可选 note / tip / warn
</Callout>

<Pullquote>
编辑部风格的大号引言
</Pullquote>

<SourceAttribution url="https://..." />
```

#### frontmatter 字段说明

| 字段 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `title` | ✓ | string | 文章标题，出现在列表、详情页、`<title>` |
| `date` | ✓ | YYYY-MM-DD | 发布日期，决定排序 |
| `description` | | string | 摘要，列表页 + Open Graph meta |
| `tags` | | string[] | 标签数组 |
| `draft` | | boolean | `true` 则不会发布（写一半时用） |

#### 发布流程

```bash
# 1. 新建文件
cd ~/Desktop/nineyweb
vim content/writing/zh/my-new-post.mdx

# 2. 本地预览（dev server 自动热重载）
npm run dev
# 打开 http://localhost:3000/writing/my-new-post

# 3. 推送上线
git add -A
git commit -m "新文章：标题"
git push

# 4. 等 60 秒 Vercel 自动部署完成
# 5. https://pyj9.com/writing/my-new-post 可访问
```

#### 多语言

- 中文：`content/writing/zh/*.mdx` → 显示在 `/writing`
- 英文：`content/writing/en/*.mdx` → 显示在 `/en/writing`
- 同一个 slug 可以有中英两个版本，互不依赖
- 只有中文版本的文章，英文列表里不会出现

---

## Part 3 / 手把手实操：从零搭一个新站

假设你想搭一个新站，叫 `your-site.com`，照下面顺序走。

### Step 0：准备

注册三个账号（都免费）：
1. **GitHub** — https://github.com/signup
2. **Vercel** — https://vercel.com/signup（建议用 GitHub 登录）
3. **域名注册商** — 阿里云 / Cloudflare / Namecheap 任一

装三个工具：
1. **Node.js** ≥ 20 — https://nodejs.org/
2. **git** — macOS 自带；Windows 装 https://git-scm.com/
3. **代码编辑器** — VS Code / Cursor / Zed 任一

### Step 1：买域名

去你选的注册商，搜索想要的名字，加购付款。注意：
- 实名认证（国内注册商）
- 开 WHOIS 隐私保护
- 开自动续费

### Step 2：本地创建项目

```bash
# 选个目录
mkdir ~/Desktop && cd ~/Desktop

# 创建 Next.js 项目（注意目录名必须小写）
npx create-next-app@latest your-site \
  --ts --tailwind --eslint --app \
  --no-src-dir --import-alias "@/*" \
  --use-npm --turbopack --skip-install --yes

cd your-site

# 装依赖（如果 npm 缓存权限有问题，加 --cache /tmp/npm-cache 参数）
npm install --legacy-peer-deps

# 装内容层和 i18n 相关依赖
npm install --legacy-peer-deps \
  next-intl \
  framer-motion \
  @next/mdx @mdx-js/loader @mdx-js/react @types/mdx \
  gray-matter \
  remark-gfm rehype-slug rehype-autolink-headings \
  next-mdx-remote \
  feed \
  lucide-react \
  reading-time \
  clsx tailwind-merge

# 测试本地跑起来
npm run dev
# 打开 http://localhost:3000，看到默认 Next.js 欢迎页
```

### Step 3：搭建项目结构

照 Part 2 的目录结构，逐个文件建。核心文件有 11 个，参照本仓库代码就行——下面列出最关键的：

```
i18n/routing.ts             定义 locales: ['zh','en']
i18n/navigation.ts          Link / router 包装
i18n/request.ts             按 locale 加载翻译
proxy.ts                    next-intl 中间件（Next 16）
messages/zh.json / en.json  所有 UI 文案
next.config.ts              加 MDX + next-intl 插件
app/globals.css             设计 token（颜色、字体、字号）
app/[locale]/layout.tsx     根布局 + 字体加载
app/[locale]/page.tsx       首页
components/Nav.tsx          导航
components/Footer.tsx       页脚
lib/posts.ts                MDX 加载器
lib/site.ts                 站点配置（域名、邮箱、社交账号）
app/[locale]/writing/page.tsx                 文章列表
app/[locale]/writing/[slug]/page.tsx          文章详情
components/mdx/MDXComponents.tsx              MDX 渲染组件
content/writing/zh/hello.mdx                  第一篇文章
```

### Step 4：本地跑通 + 写一篇文章

```bash
npm run dev
# 修任何文件保存即热重载，刷新浏览器看效果
```

写一篇文章在 `content/writing/zh/hello.mdx`，能在 `/writing/hello` 访问。

### Step 5：推 GitHub

1. 去 https://github.com/new 创建公开仓库 `your-site`
   - **不要勾**任何初始化选项（README / .gitignore / License），保持空仓库
2. 拿到仓库 URL，类似 `https://github.com/<你的名字>/your-site.git`

回本地执行：

```bash
git add -A
git commit -m "Initial site"

git remote add origin https://github.com/<你的名字>/your-site.git
git branch -M main
git push -u origin main
```

> 第一次推会让你登录 GitHub。最简单的方式：装 GitHub Desktop 或在终端跑 `gh auth login`。

### Step 6：接 Vercel

1. https://vercel.com → 用 GitHub 登录授权
2. Dashboard → **Add New → Project**
3. 找到 `your-site` 仓库 → **Import**
4. 配置页**什么都别改** → **Deploy**
5. 等 1-3 分钟 → 部署成功
6. 你会拿到一个临时 URL，比如 `your-site.vercel.app`

打开它，确认站工作。

### Step 7：绑定自定义域名

#### 在 Vercel 这边

1. 项目 → **Settings → Domains**
2. 输入 `your-site.com` → **Add** → 默认环境选 Production → **Save**
3. 输入 `www.your-site.com` → **Add** → 选 Redirect to `your-site.com` → **Save**
4. Vercel 会显示需要配置的 DNS 记录（A + CNAME）

#### 在域名注册商这边（以阿里云为例）

1. 去阿里云 DNS 控制台 https://dns.console.aliyun.com/
2. 点 `your-site.com` 旁的 **解析设置**
3. **删掉**所有阿里云默认加的解析（避免冲突）
4. 添加两条新解析：

| 类型 | 主机记录 | 线路 | 记录值 | TTL |
|---|---|---|---|---|
| A | `@` | 默认 | `76.76.21.21` | 10 分钟 |
| CNAME | `www` | 默认 | `cname.vercel-dns.com` | 10 分钟 |

5. 保存

### Step 8：等 DNS 生效 + HTTPS 自动签

```bash
# 验证 DNS（用 Google DNS 绕开运营商缓存）
dig @8.8.8.8 your-site.com +short

# 应该看到 76.76.21.21
```

DNS 生效后回 Vercel Domains 页，对两个域名各点一次 **Refresh**。红色变绿色后，等 1-2 分钟 Vercel 自动签 HTTPS，打开 `https://your-site.com` 即可。

---

## Part 4 / 我踩过的坑（你大概率也会踩）

按出现顺序排：

### 1. `create-next-app` 不允许大写目录名

```
Could not create a project called "Nineyweb" because of npm naming restrictions:
    * name can no longer contain capital letters
```

**解决**：目录名必须全小写。`mv Nineyweb nineyweb` 改名后重试。

### 2. `~/.npm` 缓存被 root 占了

```
npm error errno EACCES
npm error Your cache folder contains root-owned files
```

**解决**：用项目内临时缓存绕过：

```bash
npm install --legacy-peer-deps --cache /tmp/npm-cache
```

或彻底修复：`sudo chown -R $(id -u):$(id -g) ~/.npm`

### 3. Next 16 + React 19 的 peerDep 报错

```
npm error ERESOLVE unable to resolve dependency tree
```

**解决**：加 `--legacy-peer-deps`。

### 4. Next 16 把 `middleware.ts` 改名 `proxy.ts`

```
The "middleware" file convention is deprecated. Please use "proxy" instead.
```

**解决**：`mv middleware.ts proxy.ts`。功能不变，只是改名。

### 5. GitHub 创建仓库时勾了 README/LICENSE 导致 push 冲突

```
! [rejected]        main -> main (fetch first)
```

**解决**：

```bash
git pull origin main --allow-unrelated-histories --no-rebase --no-edit
# 解决 README 冲突
git add README.md
git commit --no-edit
git push -u origin main
```

**预防**：创建 GitHub 仓库时**不要勾**任何初始化选项。

### 6. 本地代理软件劫持 DNS

`dig your-site.com` 返回 `198.18.0.x` 这类奇怪 IP，说明 ClashX / Surge / Shadowsocks 开了 TUN 模式 / 增强模式。

**解决**：

- 临时关代理：菜单栏图标 → 关闭"系统代理"或"增强模式"
- 长期方案：把自己的域名加进代理白名单
  - ClashX/Verge：规则里加 `DOMAIN-SUFFIX,your-site.com,DIRECT`
  - Surge：`[Rule] DOMAIN-SUFFIX, your-site.com, DIRECT`
- 临时验证：用手机 4G 流量访问，绕开 Mac 上的代理

### 7. DNS 生效慢

DNS 修改后 10 分钟到 24 小时不等。**别频繁刷新或重新提交记录**，越改越慢。耐心等。

---

## Part 5 / 上线后可以继续做的事

按性价比从高到低：

| 工作 | 工作量 | 收益 |
|---|---|---|
| 接 **Vercel Analytics** | 1 分钟 | 知道有多少人看了什么 |
| 接 **Plausible / Umami** 隐私友好分析 | 10 分钟 | 不污染访客 cookie 的统计 |
| 加 **自定义 404 页** | 30 分钟 | 编辑部完成度 |
| 加 **动态 OG image**（用 `next/og`） | 1 小时 | 分享链接预览好看，对社交分发巨大加分 |
| 加 **暗色模式切换** | 1-2 小时 | 个人品味 |
| 加 **`/now` 页**（实时状态） | 1 小时 | 内容人格化 |
| 接 **Buttondown / Resend** 邮件订阅 | 1 小时 | 沉淀长期读者 |
| **项目案例研究**（深度 MDX） | 看内容长度 | 求职/合作最有力的资产 |
| 加 **sitemap.xml** 给搜索引擎 | 10 分钟 | SEO 基础 |

---

## Part 6 / 命令速查表

```bash
# === 本地开发 ===
npm run dev                          # 启动本地开发服务器
npm run build                        # 生产构建（验证没有编译错误）
npm run start                        # 跑构建后的产物（很少用）
npm run lint                         # ESLint 检查

# === 写文章 ===
# 在 content/writing/zh/ 下新建 .mdx 文件即可

# === 发布 ===
git add -A
git commit -m "描述"
git push                             # 推完 Vercel 自动部署

# === DNS 验证 ===
dig your-site.com +short             # 看本地 DNS 解析
dig @8.8.8.8 your-site.com +short    # 用 Google DNS 看
curl -I https://your-site.com        # 看 HTTPS 是否就绪

# === 紧急回滚 ===
# 在 Vercel Dashboard → Deployments → 找到上一个好版本 → 三点菜单 → Promote to Production
```

---

## 结语

整个站从打开终端到 `https://pyj9.com` 真正上线，技术工作约 **4-6 小时**（不算写内容）。

最贵的是**做决策**——选什么色、写什么文案、要不要多语言。技术只是给决策落地。

如果你卡在某一层，回到本文档对应的章节，多半能找到答案。

—— 写于 2026-05
