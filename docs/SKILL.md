# SKILL: 一键搭建个人网站（pyj9.com 技术栈）

## Skill 元信息

- **名称**：build-personal-website
- **版本**：1.0.0
- **技术栈**：Next.js 16 + Tailwind v4 + MDX + next-intl + Vercel + 阿里云域名
- **执行方式**：AI Agent 读取本文件后，按 Phase 顺序逐步执行所有命令和文件创建操作
- **前置条件**：macOS / Linux，已安装 Node.js ≥ 20、git、代码编辑器

---

## 用户输入参数（执行前先向用户确认）

在开始之前，AI 需要向用户收集以下信息：

| 参数 | 说明 | 示例 |
|---|---|---|
| `SITE_NAME` | 项目目录名（全小写，无空格） | `mysite` |
| `SITE_DOMAIN` | 目标域名 | `mysite.com` |
| `SITE_TITLE` | 网站标题 | `My Site` |
| `AUTHOR_NAME` | 作者姓名 | `张三` |
| `AUTHOR_EMAIL` | 作者邮箱 | `hi@mysite.com` |
| `GITHUB_USERNAME` | GitHub 用户名 | `zhangsan` |
| `LOCALE_PRIMARY` | 主语言（zh / en） | `zh` |
| `LOCALE_SECONDARY` | 副语言（zh / en） | `en` |
| `INSTALL_DIR` | 安装目录 | `~/Desktop` |

> **AI 执行说明**：收集完参数后，将下文所有 `{{SITE_NAME}}`、`{{SITE_DOMAIN}}` 等占位符替换为用户填写的值，再逐步执行。

---

## Phase 0：环境检查

```bash
# 检查 Node.js 版本（需 ≥ 20）
node -v

# 检查 git
git --version

# 检查 npm
npm -v
```

**AI 判断逻辑**：
- 若 Node.js < 20，提示用户去 https://nodejs.org/ 下载安装后再继续
- 若 git 未安装，提示 macOS 用户运行 `xcode-select --install`

---

## Phase 1：创建 Next.js 项目

```bash
# 进入安装目录
cd {{INSTALL_DIR}}

# 创建 Next.js 16 项目（必须全小写目录名）
npx create-next-app@latest {{SITE_NAME}} \
  --ts --tailwind --eslint --app \
  --no-src-dir --import-alias "@/*" \
  --use-npm --turbopack --skip-install --yes

cd {{SITE_NAME}}

# 安装基础依赖（加 --legacy-peer-deps 兼容 Next 16 + React 19）
npm install --legacy-peer-deps

# 安装内容层 + i18n + MDX + 动效依赖
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
```

**常见报错处理**：

```bash
# 若出现 npm error EACCES（缓存权限问题）
npm install --legacy-peer-deps --cache /tmp/npm-cache

# 彻底修复缓存权限
sudo chown -R $(id -u):$(id -g) ~/.npm
```

---

## Phase 2：创建目录结构

```bash
# 在项目根目录执行
mkdir -p i18n
mkdir -p messages
mkdir -p content/writing/zh
mkdir -p content/writing/en
mkdir -p components/mdx
mkdir -p lib
mkdir -p public
```

---

## Phase 3：写入核心配置文件

### 3.1 `next.config.ts`

```typescript
// next.config.ts
import type { NextConfig } from 'next'
import createMDX from '@next/mdx'
import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin('./i18n/request.ts')

const withMDX = createMDX({
  options: {
    remarkPlugins: [['remark-gfm']],
    rehypePlugins: [
      'rehype-slug',
      ['rehype-autolink-headings', { behavior: 'wrap' }],
    ],
  },
})

const nextConfig: NextConfig = {
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
}

export default withNextIntl(withMDX(nextConfig))
```

### 3.2 `i18n/routing.ts`

```typescript
// i18n/routing.ts
import { defineRouting } from 'next-intl/routing'

export const routing = defineRouting({
  locales: ['{{LOCALE_PRIMARY}}', '{{LOCALE_SECONDARY}}'],
  defaultLocale: '{{LOCALE_PRIMARY}}',
})
```

### 3.3 `i18n/navigation.ts`

```typescript
// i18n/navigation.ts
import { createNavigation } from 'next-intl/navigation'
import { routing } from './routing'

export const { Link, redirect, usePathname, useRouter } =
  createNavigation(routing)
```

### 3.4 `i18n/request.ts`

```typescript
// i18n/request.ts
import { getRequestConfig } from 'next-intl/server'
import { routing } from './routing'

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale
  if (!locale || !routing.locales.includes(locale as any)) {
    locale = routing.defaultLocale
  }
  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  }
})
```

### 3.5 `proxy.ts`（Next 16 中间件，原 middleware.ts）

```typescript
// proxy.ts
import createMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'

export default createMiddleware(routing)

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
}
```

> **注意**：Next.js 16 已将 `middleware.ts` 改名为 `proxy.ts`，功能不变。

### 3.6 `messages/zh.json`

```json
{
  "nav": {
    "home": "首页",
    "writing": "文章",
    "projects": "项目",
    "about": "关于",
    "now": "近况",
    "contact": "联系"
  },
  "home": {
    "tagline": "{{SITE_TITLE}}"
  },
  "writing": {
    "title": "文章",
    "readMore": "阅读全文",
    "minRead": "分钟阅读"
  }
}
```

### 3.7 `messages/en.json`

```json
{
  "nav": {
    "home": "Home",
    "writing": "Writing",
    "projects": "Projects",
    "about": "About",
    "now": "Now",
    "contact": "Contact"
  },
  "home": {
    "tagline": "{{SITE_TITLE}}"
  },
  "writing": {
    "title": "Writing",
    "readMore": "Read more",
    "minRead": "min read"
  }
}
```

### 3.8 `lib/site.ts`

```typescript
// lib/site.ts
export const siteConfig = {
  name: '{{SITE_TITLE}}',
  domain: '{{SITE_DOMAIN}}',
  url: 'https://{{SITE_DOMAIN}}',
  author: '{{AUTHOR_NAME}}',
  email: '{{AUTHOR_EMAIL}}',
  description: '{{AUTHOR_NAME}} 的个人网站',
  social: {
    github: 'https://github.com/{{GITHUB_USERNAME}}',
    twitter: '',
  },
}
```

### 3.9 `lib/cn.ts`

```typescript
// lib/cn.ts
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

### 3.10 `lib/posts.ts`

```typescript
// lib/posts.ts
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import readingTime from 'reading-time'

const contentDir = path.join(process.cwd(), 'content/writing')

export interface PostMeta {
  slug: string
  title: string
  date: string
  description?: string
  tags?: string[]
  draft?: boolean
  readingTime: string
}

export function getPostSlugs(locale: string): string[] {
  const dir = path.join(contentDir, locale)
  if (!fs.existsSync(dir)) return []
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith('.mdx'))
    .map((f) => f.replace(/\.mdx$/, ''))
}

export function getPostBySlug(slug: string, locale: string) {
  const filePath = path.join(contentDir, locale, `${slug}.mdx`)
  if (!fs.existsSync(filePath)) return null
  const raw = fs.readFileSync(filePath, 'utf-8')
  const { data, content } = matter(raw)
  const rt = readingTime(content)
  return {
    meta: {
      slug,
      title: data.title ?? slug,
      date: data.date ?? '',
      description: data.description ?? '',
      tags: data.tags ?? [],
      draft: data.draft ?? false,
      readingTime: Math.ceil(rt.minutes).toString(),
    } as PostMeta,
    content,
  }
}

export function getAllPosts(locale: string): PostMeta[] {
  return getPostSlugs(locale)
    .map((slug) => getPostBySlug(slug, locale)?.meta)
    .filter((p): p is PostMeta => !!p && !p.draft)
    .sort((a, b) => (a.date > b.date ? -1 : 1))
}
```

---

## Phase 4：写入应用层文件

### 4.1 `app/globals.css`

```css
/* app/globals.css */
@import "tailwindcss";

:root {
  --ink: #0F0F12;
  --paper: #FAFAF7;
  --volt: #7C5CFF;
  --volt-tint: #EFEAFF;
  --muted: #6B7280;
  --border: #E5E5E0;
  --surface: #F5F5F0;
}

@media (prefers-color-scheme: dark) {
  :root {
    --ink: #F5F5F0;
    --paper: #0F0F12;
    --volt: #9D80FF;
    --volt-tint: #1E1A2E;
    --muted: #9CA3AF;
    --border: #27272A;
    --surface: #18181B;
  }
}

* {
  box-sizing: border-box;
}

body {
  background-color: var(--paper);
  color: var(--ink);
  font-family: 'Inter', 'Noto Sans SC', sans-serif;
  line-height: 1.7;
  -webkit-font-smoothing: antialiased;
}

a {
  color: var(--volt);
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}
```

### 4.2 `app/[locale]/layout.tsx`

```tsx
// app/[locale]/layout.tsx
import type { Metadata } from 'next'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { Inter, JetBrains_Mono, Noto_Sans_SC } from 'next/font/google'
import '../globals.css'
import { siteConfig } from '@/lib/site'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const jbMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' })
const notoSansSC = Noto_Sans_SC({
  subsets: ['chinese-simplified'],
  weight: ['400', '500', '700'],
  variable: '--font-sc',
})

export const metadata: Metadata = {
  title: { default: siteConfig.name, template: `%s | ${siteConfig.name}` },
  description: siteConfig.description,
  metadataBase: new URL(siteConfig.url),
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const messages = await getMessages()
  return (
    <html lang={locale} className={`${inter.variable} ${jbMono.variable} ${notoSansSC.variable}`}>
      <body>
        <NextIntlClientProvider messages={messages}>
          <Nav />
          <main style={{ minHeight: '80vh', maxWidth: '720px', margin: '0 auto', padding: '2rem 1.5rem' }}>
            {children}
          </main>
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
```

### 4.3 `app/[locale]/page.tsx`

```tsx
// app/[locale]/page.tsx
import { useTranslations } from 'next-intl'
import { siteConfig } from '@/lib/site'

export default function HomePage() {
  const t = useTranslations('home')
  return (
    <section style={{ paddingTop: '4rem' }}>
      <h1 style={{ fontSize: '2.5rem', fontWeight: 700, lineHeight: 1.2, marginBottom: '1rem' }}>
        {siteConfig.author}
      </h1>
      <p style={{ fontSize: '1.25rem', color: 'var(--muted)', marginBottom: '2rem' }}>
        {t('tagline')}
      </p>
      <p>
        👋 欢迎来到我的个人网站。这里有我的{' '}
        <a href="/writing">文章</a>、<a href="/projects">项目</a> 和{' '}
        <a href="/about">关于我</a>。
      </p>
    </section>
  )
}
```

### 4.4 `app/[locale]/writing/page.tsx`

```tsx
// app/[locale]/writing/page.tsx
import { getAllPosts } from '@/lib/posts'
import Link from 'next/link'

export default async function WritingPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const posts = getAllPosts(locale)

  return (
    <section>
      <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '2rem' }}>文章</h1>
      {posts.length === 0 && (
        <p style={{ color: 'var(--muted)' }}>还没有文章，快去写第一篇吧。</p>
      )}
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {posts.map((post) => (
          <li key={post.slug} style={{ marginBottom: '2rem', borderBottom: '1px solid var(--border)', paddingBottom: '2rem' }}>
            <time style={{ fontSize: '0.875rem', color: 'var(--muted)' }}>{post.date}</time>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600, margin: '0.25rem 0' }}>
              <Link href={`/writing/${post.slug}`}>{post.title}</Link>
            </h2>
            {post.description && (
              <p style={{ color: 'var(--muted)', margin: 0 }}>{post.description}</p>
            )}
          </li>
        ))}
      </ul>
    </section>
  )
}
```

### 4.5 `app/[locale]/writing/[slug]/page.tsx`

```tsx
// app/[locale]/writing/[slug]/page.tsx
import { getPostBySlug, getPostSlugs } from '@/lib/posts'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

export async function generateStaticParams({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  return getPostSlugs(locale).map((slug) => ({ slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}): Promise<Metadata> {
  const { locale, slug } = await params
  const post = getPostBySlug(slug, locale)
  if (!post) return {}
  return { title: post.meta.title, description: post.meta.description }
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale, slug } = await params
  const post = getPostBySlug(slug, locale)
  if (!post) notFound()

  return (
    <article>
      <header style={{ marginBottom: '2rem', borderBottom: '1px solid var(--border)', paddingBottom: '1.5rem' }}>
        <time style={{ fontSize: '0.875rem', color: 'var(--muted)' }}>
          {post.meta.date} · {post.meta.readingTime} 分钟阅读
        </time>
        <h1 style={{ fontSize: '2rem', fontWeight: 700, lineHeight: 1.3, marginTop: '0.5rem' }}>
          {post.meta.title}
        </h1>
        {post.meta.description && (
          <p style={{ color: 'var(--muted)', fontSize: '1.1rem' }}>{post.meta.description}</p>
        )}
      </header>
      <div className="prose">
        <MDXRemote source={post.content} />
      </div>
    </article>
  )
}
```

### 4.6 `components/Nav.tsx`

```tsx
// components/Nav.tsx
'use client'
import Link from 'next/link'
import { siteConfig } from '@/lib/site'

export default function Nav() {
  return (
    <nav style={{
      borderBottom: '1px solid var(--border)',
      padding: '1rem 1.5rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      maxWidth: '720px',
      margin: '0 auto',
    }}>
      <Link href="/" style={{ fontWeight: 700, color: 'var(--ink)', fontSize: '1rem' }}>
        {siteConfig.author}
      </Link>
      <div style={{ display: 'flex', gap: '1.5rem' }}>
        {[
          { href: '/writing', label: '文章' },
          { href: '/projects', label: '项目' },
          { href: '/about', label: '关于' },
        ].map((item) => (
          <Link
            key={item.href}
            href={item.href}
            style={{ color: 'var(--muted)', fontSize: '0.9rem' }}
          >
            {item.label}
          </Link>
        ))}
      </div>
    </nav>
  )
}
```

### 4.7 `components/Footer.tsx`

```tsx
// components/Footer.tsx
import { siteConfig } from '@/lib/site'

export default function Footer() {
  return (
    <footer style={{
      borderTop: '1px solid var(--border)',
      padding: '2rem 1.5rem',
      textAlign: 'center',
      color: 'var(--muted)',
      fontSize: '0.875rem',
      maxWidth: '720px',
      margin: '0 auto',
    }}>
      <p>© {new Date().getFullYear()} {siteConfig.author} · <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a></p>
    </footer>
  )
}
```

---

## Phase 5：写入第一篇示例文章

```bash
# 创建示例 MDX 文件
cat > content/writing/zh/hello.mdx << 'EOF'
---
title: "Hello World"
description: "我的第一篇文章，记录这个网站的诞生。"
date: "{{TODAY_DATE}}"
tags: ["随笔"]
draft: false
---

这是我用 Next.js + MDX 搭建个人网站后写的第一篇文章。

## 为什么要有个人网站？

个人网站是你在互联网上唯一真正属于自己的地方。

- 不被算法控制
- 内容永久保留
- 完全自定义

## 技术栈

本站技术栈：**Next.js 16 + Tailwind v4 + MDX + next-intl**，部署在 Vercel。

开始写吧。
EOF
```

> **AI 注意**：将 `{{TODAY_DATE}}` 替换为当天日期，格式 `YYYY-MM-DD`。

---

## Phase 6：本地验证

```bash
# 启动开发服务器
npm run dev
```

**AI 验证清单**：
1. 打开 `http://localhost:3000` → 首页正常显示
2. 打开 `http://localhost:3000/writing` → 文章列表显示"Hello World"
3. 打开 `http://localhost:3000/writing/hello` → 文章详情正常渲染
4. 若有报错，优先检查 `proxy.ts` 是否存在（不是 `middleware.ts`）

---

## Phase 7：推送到 GitHub

```bash
# 初始化 git
git add -A
git commit -m "Initial site: {{SITE_NAME}}"

# 添加远程仓库（用户需要先在 github.com/new 创建空仓库，不要勾任何初始化选项）
git remote add origin https://github.com/{{GITHUB_USERNAME}}/{{SITE_NAME}}.git
git branch -M main
git push -u origin main
```

**AI 提示用户**：
1. 去 https://github.com/new 创建仓库名为 `{{SITE_NAME}}` 的**空仓库**
2. **不要勾** README / .gitignore / License 任何选项
3. 拿到仓库 URL 后返回继续执行 push

若出现 push 冲突（勾了初始化选项）：
```bash
git pull origin main --allow-unrelated-histories --no-rebase --no-edit
git add README.md
git commit --no-edit
git push -u origin main
```

---

## Phase 8：部署到 Vercel（需用户手动操作）

以下步骤需用户在浏览器操作，AI 提供指引：

1. 访问 https://vercel.com，用 GitHub 账号登录
2. Dashboard → **Add New → Project**
3. 找到 `{{SITE_NAME}}` 仓库 → **Import**
4. 配置页**什么都不改** → **Deploy**
5. 等待 1-3 分钟，获得临时 URL `{{SITE_NAME}}.vercel.app`
6. 打开临时 URL，确认站点正常

---

## Phase 9：绑定自定义域名（需用户手动操作）

### 9.1 Vercel 侧添加域名

1. 项目 → **Settings → Domains**
2. 添加 `{{SITE_DOMAIN}}` → Production → Save
3. 添加 `www.{{SITE_DOMAIN}}` → Redirect to `{{SITE_DOMAIN}}` → Save
4. 记录 Vercel 要求配置的 DNS 记录值

### 9.2 阿里云 DNS 配置

访问 https://dns.console.aliyun.com/，在 `{{SITE_DOMAIN}}` 的解析设置中：

1. **删除**所有阿里云默认解析
2. 添加以下两条记录：

| 类型 | 主机记录 | 记录值 | TTL |
|---|---|---|---|
| A | `@` | `76.76.21.21` | 10 分钟 |
| CNAME | `www` | `cname.vercel-dns.com` | 10 分钟 |

### 9.3 验证 DNS 生效

```bash
# 用 Google DNS 验证（绕开本地运营商缓存）
dig @8.8.8.8 {{SITE_DOMAIN}} +short
# 应返回：76.76.21.21

# 验证 HTTPS
curl -I https://{{SITE_DOMAIN}}
```

**DNS 生效时间**：国内 10-30 分钟，海外最长 24 小时。生效后回 Vercel Domains 页点 Refresh，红→绿后 HTTPS 自动签发。

---

## 常见错误速查

| 错误信息 | 原因 | 解决方案 |
|---|---|---|
| `name can no longer contain capital letters` | 目录名含大写 | 改成全小写 |
| `npm error EACCES` | npm 缓存被 root 占用 | 加 `--cache /tmp/npm-cache` 或 `sudo chown -R $(id -u):$(id -g) ~/.npm` |
| `ERESOLVE unable to resolve dependency tree` | peerDep 冲突 | 加 `--legacy-peer-deps` |
| `middleware convention is deprecated` | 用了旧文件名 | 把 `middleware.ts` 改名为 `proxy.ts` |
| `rejected: fetch first` | GitHub 仓库非空 | `git pull origin main --allow-unrelated-histories` |
| dig 返回 `198.18.0.x` | 本地代理劫持 DNS | 关闭 ClashX/Surge 增强模式，或用手机 4G 测试 |

---

## 发布新文章（日常工作流）

```bash
# 1. 新建 MDX 文件
vim content/writing/zh/my-new-post.mdx

# frontmatter 模板：
# ---
# title: "文章标题"
# description: "一句话摘要"
# date: "YYYY-MM-DD"
# tags: ["标签1", "标签2"]
# draft: false
# ---

# 2. 本地预览
npm run dev
# 访问 http://localhost:3000/writing/my-new-post

# 3. 推送上线（Vercel 自动部署，约 60 秒）
git add -A
git commit -m "新文章：标题"
git push
```

---

## 上线后推荐配置

| 任务 | 工作量 | 优先级 |
|---|---|---|
| Vercel Analytics（访问统计） | 1 分钟 | ⭐⭐⭐ |
| `sitemap.xml`（SEO） | 10 分钟 | ⭐⭐⭐ |
| 自定义 404 页 | 30 分钟 | ⭐⭐ |
| 动态 OG image（`next/og`） | 1 小时 | ⭐⭐ |
| 暗色模式切换 | 1-2 小时 | ⭐⭐ |
| `/now` 实时状态页 | 1 小时 | ⭐ |
| 邮件订阅（Resend） | 1 小时 | ⭐ |

---

## 设计定制说明（给想改样式的用户）

所有颜色定义在 `app/globals.css` 的 CSS 变量中，**改这一个文件就能换整站风格**：

```css
:root {
  --volt: #7C5CFF;   /* ← 改成你喜欢的品牌色，整站立刻变 */
}
```

---

*本 Skill 基于 [pyj9.com](https://pyj9.com) 真实搭建过程提炼，技术栈 Next.js 16 + Tailwind v4 + MDX + next-intl。*
*最后更新：2026-05*
