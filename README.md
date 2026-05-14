# Nineyweb

Niney 的个人网站源码。**Editorial × AI** 视觉方向，写产品 × 模型边界的思考。

线上：[pyj9.com](https://pyj9.com)

## 技术栈

- Next.js 16 (App Router) + TypeScript
- Tailwind CSS v4
- next-intl（中文默认 + 英文）
- next-mdx-remote（文章用 MDX 写）
- Framer Motion / SVG SMIL（动效）
- 部署：Vercel

## 本地运行

```bash
npm install --legacy-peer-deps
npm run dev
# 打开 http://localhost:3000
```

## 写文章

新建 `content/writing/zh/your-slug.mdx`：

```mdx
---
title: "标题"
description: "一句话简介"
date: "2026-05-13"
tags: ["产品方法论", "AI"]
draft: false
---

正文 Markdown，可用 <Callout> / <Pullquote> / <SourceAttribution> 组件。
```

保存即热重载。

## 目录结构

```
app/[locale]/          中英双语路由
  page.tsx             首页
  writing/             文章列表 + 详情
  projects/            项目案例
  about/               关于
  contact/             联系
content/writing/       MDX 文章（zh/ + en/）
components/            React 组件
i18n/                  next-intl 路由配置
lib/                   工具：posts / projects / site
messages/              i18n 词条 (zh.json / en.json)
```

## 许可

代码 MIT。文章内容版权归作者所有。
