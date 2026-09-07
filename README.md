# supermortal.cn 博客

[![Astro](https://img.shields.io/badge/Astro-7.2.10-FF5D01?logo=astro)](https://astro.build)
[![Vite](https://img.shields.io/badge/Vite-8.2.2-646CFF?logo=vite)](https://vitejs.dev)
[![UnoCSS](https://img.shields.io/badge/UnoCSS-66.9-333333)](https://unocss.dev)
[![License](https://img.shields.io/badge/license-Apache--2.0-blue)](LICENSE)

基于 [astro-theme-pure](https://github.com/cworld1/astro-theme-pure) 的个人技术博客，运行在 <https://supermortal.cn>。本仓库是**自维护的 fork**，针对 Astro 7 + Vite 8 升级、移除第三方依赖、扩展内容结构做了大量改造。

---

## 与上游完整对比

| 维度 | 上游 astro-theme-pure | 本仓库 supermortal.cn |
|---|---|---|
| 核心版本 | Astro 5.x / Vite 6.x | Astro 7.2.10 / Vite 8（Rolldown） |
| 文章 URL | 文件/目录名决定 | frontmatter `slug` 决定，目录可自由中文化 |
| 文章目录 | 拼音/英文目录 | 中文语义化目录，改名不影响 URL |
| 分类体系 | 多分类 | 单值 `category` + 多 `tags` |
| 全文搜索 | Pagefind，构建时容易失败 | 修复 Pagefind 路径问题，搜索页预渲染 |
| 相关推荐 | 固定在文章底部 | 底部右侧独立卡片，等高、最多 3 篇 |
| 文章顶部图标 | MingCute 填充图标 | 本地 Lucide 描边 SVG |
| 二维码 / 图片放大 | CDN 加载 | 本地化到 `public/scripts/` |
| 评论系统 | Waline | 已移除 |
| 阅读进度条 | 无 | 自研 3px（文章页滚动进度） |
| 页脚 | Astro & Pure theme powered | AI 机器人对话入口 + sitemap |
| AI 机器人 | 无 | OneBot QQ 机器人，带个人知识库 |
| OG 图 | 静态图 | 构建时 satori 自动生成，按 slug 命名 |
| 内容板块 | 固定 | `site.config.ts` 的 `sections` 可开关 |
| 路由 | 含 `/terms` | 移除 `/terms`，改为站点地图 |
| 404 / RSS / Sitemap | 基础实现 | 404 推荐、RSS 全文开关、sitemap lastmod |

### AI 机器人对话（重点）

页脚右侧的 `Chat with my AI Bot` 是进入我的 OneBot QQ 机器人对话的入口：

- 点击跳转：`https://qm.qq.com/q/QegqadxjCS`
- 机器人基于 **OneBot 协议** 接入 QQ
- 机器人内置我博客与项目经验的知识库，访客可以直接向它提问博客内容、项目经验、部署教程等
- 入口与实现：`packages/pure/components/basic/Footer.astro`
  - 显示文本：`Chat with my AI Bot`
  - 跳转链接：`href='https://qm.qq.com/q/QegqadxjCS'`
  - 新窗口打开：`target='_blank'`

未来如需切换入口（如微信公众号、Telegram、Web 聊天室），只需修改 Footer 中的 `href` 与显示文本即可。

## 相对上游的变更

### 引擎升级

| 项目 | 上游 | 本仓库 |
|---|---|---|
| Astro | 5.17.3 | **7.2.10** |
| @astrojs/vercel | 9.0.4 | **11.0.9** |
| @astrojs/rss | 4.0.15 | **4.0.19** |
| @astrojs/check | 0.9.6 | **0.9.10** |
| @astrojs/mdx | 4.3.13 | **8.0.0** |
| @astrojs/sitemap | 3.6.0 | **3.7.4** |
| Vite | 6.x | **8.2.2**（Rolldown 1.2.7 默认） |
| UnoCSS | 66.5.10 | **66.9.2** |

Astro 7 升级配套调整：
- `markdown.processor = unified({...})` 替代弃用的 `markdown.remarkPlugins / rehypePlugins`（v7 移除了 `experimental.svgo`、`experimental.fonts` 顶层化）
- 锁住 `compressHTML: false` 保持 v5 行为，避免 v7 默认 `jsx` 压缩影响 HTML 输出
- `content.config.ts` 加 `categories` 字段（多分类 enum）
- 24 篇文章全部走 zod v4 schema 校验

### Vite plugin: `astro-v7-fix`

Vite 8 + Rolldown 不识别 `import type { ... }`、`type Props = ...`、`interface X { ... }` 等 TS 语法。Astro 7 Rust 编译器还会输出两类无效 JS：
- `A && B ?? C`（缺括号）
- `&& (cond) {`（多左括号）

`astro.config.ts` 里加了一个 Vite plugin：
1. 正则修两类编译器 bug
2. 用 **esbuild `loader: 'tsx'`** 把所有 .astro/.ts 输出跑一遍，esbuild 完整理解 TSX（包括 JSX 表达式里的 `${...}`），自动剥掉 TS 语法

比手写 brace-counting 解析稳得多。

### 移除 Waline 评论系统

| 移除 | 位置 |
|---|---|
| `src/components/waline/` 整个目录 | Comment、PageInfo、Pageview、index |
| `import {Comment, PageInfo} from '@/components/waline'` | `src/layouts/BlogPost.astro`、`src/layouts/CommonPage.astro` |
| `<Comment />`、`<PageInfo />` 模板实例 | 同上 |
| `comment: z.boolean().default(true)` 字段 | `src/content.config.ts` |
| `integ.waline: { enable, server, ... }` 配置块 | `src/site.config.ts` |
| `waline: z.object({...})` schema | `packages/pure/types/integrations-config.ts` |
| `Waline 文字介绍` 段落 | `src/pages/about/index.astro` |
| `@waline/client` 依赖 | `package.json`（重装自动清 lockfile） |

### 标签就是分类(精简决策)

- 评估后决定**不引入多分类**,继续用现有 tags 体系。原因:多分类(4 个宏观主题)与 tags(24+ 细粒度)有功能重叠,24 篇文章规模下分类对读者的引导价值 < 维护成本
- 删除了前面迭代的 categories schema / frontmatter / 路由 / Header 菜单 / Hero 显示 / server 工具函数 / 公共组件 **9 处变更**
- `src/content.config.ts` 保持简洁,只有 tags
- `/categories` 路由 404(已删,以后需要再加)
- 首页 About 区块下面仍保留 Tags 概览(改用 `getUniqueTagsWithCount`),与原版 /tags 列表页保持一致
- 写文章时,在 md frontmatter 头部加 tags: 数组即可,例如:
  ```
  ---
  title: ...
  tags:
    - AI
    - 教程
  ---
  ```### 加相关文章推荐(按 tag 重叠度)

- 算法在 `packages/pure/utils/server.ts` 新增 `getRelatedPosts(current, all, limit=4)`:
  - 算每篇候选文章与当前文章的 **tag 重叠数**
  - 按 score desc 排序,相同时按 **publishDate desc** 破平
  - 总是排除自己;无 tag 重叠时回退到最新 N 篇(不会空白)
- 组件 `packages/pure/components/pages/RelatedPosts.astro`:**compact list 风格**
  - 响应式 1 列(移动)/ 2 列(平板及以上)
  - 每行:标题(line-clamp-1) + `xN` 显示共享 tag 数
  - 复用 UnoCSS token:`bg-card/30` `hover:bg-muted/60`
  - 块小、视觉轻量,不抢主内容
  - 只对非草稿显示
- 接入位置:`BlogPost.astro` 在 `ArticleBottom`(上一篇/下一篇)之后
  ```
  [Copyright]
  [ArticleBottom]   ← 上一篇 / 下一篇
  [RelatedPosts]    ← 新增:相关推荐 (compact)
  ```

### Dynamic OG image (build-time 自动生成)

- **完全自动**,不需要手动创建图片
- 新增依赖 `satori` + `@resvg/resvg-js` + `wawoff2`
- 新脚本 `scripts/generate-og-images.mjs`:
  - 读取 site.config.ts(标题/作者) + app.css(主题色,自动 HSL -> hex 转换,satori 不支持 CSS 变量)
  - 字体: Noto Sans SC(chinese-simplified + latin 子集),`wawoff2` 解码 woff2 -> TTF
  - 遍历 src/content/blog/*/index.md 读 frontmatter(title / description / tags / publishDate / draft)
  - 跳草稿 `(fm.draft === true)`,否则用 satori 渲染 JSX -> SVG,@resvg/resvg-js 转 PNG (1200x630)
  - 输出到 `public/og/<slug>.png` (24 张,共 ~1MB)
- 集成:`package.json` 加 `prebuild` 钩子 → Vercel build 时自动跑
- 集成: `BaseHead.astro` 检测路径:`/blog/<slug>`  → og:image 用 `/og/<slug>.png`; 其他页 fallback 到 `config.socialCard`
- 布局:左上蓝点 + 站点名,大标题(深色加粗),描述(灰),tag chips(浅色背景),作者 + 日期
- 调试记录:satori 解析 `color: #xxx` 字段正常,但解析动态变量值时会渲染成浅色。最终改成硬编码 hex 解决

### 加阅读进度条

- 上游 astro-theme-pure **没有**阅读进度条，本仓库自研并放到了文章页布局里
- 位置：`src/layouts/ContentLayout.astro`（只在博客文章页生效）
- 样式：`fixed top-0 left-0 h-[3px] bg-primary transition-[width] duration-75`
- 行为：跟踪 `article` 元素的滚动百分比，宽度从 0% 到 100%
- 性能：`requestAnimationFrame` 节流，passive scroll 监听
- Astro 路由切换：监听 `astro:page-load` 重新计算

### Admonitions 提示块 (rehype-callouts)

- 依赖: remark-directive + rehype-callouts (GitHub 风格 alert 语法)
- 写法 (GFM blockquote): 在文章里写 `> [!NOTE]` 后跟内容行，支持 `NOTE` / `TIP` / `IMPORTANT` / `WARNING` / `CAUTION` / `DANGER` / `INFO` 七种类型
- 样式: `src/assets/styles/app.css` 末尾，亮/暗两套配色，左侧 4px 主题色边条 + 图标标题
- 实现位置: `packages/pure/index.ts` 的 remarkPlugins/rehypePlugins 注入 (astro.config.ts 也同步加了，双保险)

### 404 页面增强

- 文件: `src/pages/404.astro`
- 新增: 搜索入口链接 (跳 `/search`，复用现有 Pagefind) + 6 篇最新文章推荐卡片
- UI: 复用现有 UnoCSS token (bg-card / border / hover:border-primary 等)，完全响应式

### RSS 全文/摘要切换

- 配置: `src/site.config.ts` 加 `rssFullText` 开关 (默认 false = 只输出摘要)
- 设 true 时用 remark + remark-html 把文章 markdown 渲染成 HTML 塞进 content:encoded
- 实现: `src/pages/rss.xml.ts` 手动构造 RSS 2.0 XML (CDATA 包裹全文)

### Sitemap lastmod (SEO)

- 位置: `packages/pure/index.ts` 的 sitemap integration
- 规则: `/blog/<slug>` 的 lastmod = frontmatter updatedDate (无则 publishDate)
- 关键点: serialize 回调运行在 astro:build:done，此时 Vite module runner 已关闭，import astro:content 会报 "Vite module runner has been closed"。所以直接读 src/content/blog 下 md 文件的 frontmatter，绕开 astro:content API
- 验证: 24 篇文章每条 url 都有 YYYY-MM-DD 的 lastmod

---

### 分类体系（单值 category）

- 早期曾加过多分类（categories 数组）后整体移除；本次以**单值 category** 重新引入，语义是"文章栏目"而非"主题"
- schema: `src/content.config.ts` 加 `category: z.string().default('未分类')`
- frontmatter 写法（24 篇文章已按原形式标签归位）:

  ```yaml
  category: 教程
  ```

- 当前分类: 教程 10 / 知识点 5 / 总结 4 / 笔记 3 / 翻译 1 / 工具 1
- 新增路由: `/categories`（全部分类）+ `/categories/[category]/[...page]`（分页文章列表，样式与 tags 页一致）
- 首页: 原 Tags 概览区块改为 **Categories**（package 图标 + 文章计数，样式不变）
- Header 菜单: 加"分类"入口，保留"标签"
- 文章页 Hero: 日期/阅读时间旁显示分类（package 图标，链接到分类页），标签显示保留
- 相关推荐算法升级: `getRelatedPosts` 打分时**排除形式标签**（教程/总结/笔记/知识点/翻译/工具——它们出现在大量不相关文章上，会污染纯 tag 重叠分），同分类额外 +0.5 分
- 工具函数: `getUniqueCategoriesWithCount` / `getUniqueCategories` / `getAllCategories`（`packages/pure/utils/server.ts`）
- RSS/OG/sitemap 等管线不受影响

---

### Projects 板块恢复

- **板块开关**: `site.config.ts` 的 `sections.projects`，设为 `false` 可整块隐藏（当前为 `true`）
- 上游自带的 `/projects` 页面此前被移除，本次恢复：路由 `src/pages/projects/index.astro`，数据源 `public/projects.json`（改这个文件即可增删项目，无需动代码）
- 项目卡片复用 `src/components/projects/ProjectSection.astro`（上游原组件，本次修了两个遗留 bug：图标映射 `github-circle` 不存在改为 `github`；glob 正则 `avif.webp` 笔误改为 `avif,webp`）
- 首页: About 区块之后新增 **Projects** 区块（当前 projects.json 只有 2 个项目，全部展示 + "More projects" 按钮），紧邻其后的就是 Categories 区块
- Header 菜单: 加"项目"入口（关于左边），完整顺序: 博客 / 归档 / 分类 / 标签 / 友链 / 项目 / 关于
- 项目卡片支持配图: `projects.json` 里加 `"image": "文件名.png"`，图片放 `src/assets/projects/`，卡片右侧显示渐隐配图（Astro 自动压缩为 webp）；不加 `image` 则纯文字卡片。当前 DeepSeek Harness Guide 与 Bot Deploy 均已配置配图

---

### Skills 板块 + 板块开关

- **当前状态**: Skills 内容已清空（`public/skills.json` 为 `{"categories": []}`），`sections.skills` 已设为 `false`，首页板块不再展示；等后续补齐内容后把开关改回 `true`、重新填充 JSON 即可
- **Skills 定位**: 展示发布在 GitHub 的技能/工具，卡片 + 外链跳转（无站内详情页，简化后的方案）
- 数据: `public/skills.json`（与 projects 同模式，改 JSON 即增删，无需动代码）
- 字段: `name` / `description` / `image`（可选，图放 `src/assets/skills/`，卡片右侧渐隐展示）/ `links`（github/site/doc/release；站内路径当前页跳转，外部新标签）
- 路由: `/skills`；首页在 Projects 之后、Categories 之前显示前 4 个 + More skills 按钮
- **板块开关**: `site.config.ts` 的 `sections` 配置（about / projects / skills / categories / posts / education / techStack），设 `false` 整块隐藏，已实测生效
- 类型系统: skills 曾以 content collection 实现后简化为 JSON；为此重构的 `packages/pure/utils/server.ts`（blog 函数锚定 `'blog'`，`sortMDByDate` 改结构化泛型）保留，astro check 0 errors
- 组件: `src/components/skills/SkillSection.astro`（样式与 ProjectSection 一致）

- **卡片分类徽章**: projects.json / skills.json 均支持可选 `category` 字段，卡片右上角显示圆角徽章（border + bg-background/80 + backdrop-blur，跟随主题亮暗色），不填则不显示
- **首页板块顺序调整**: 默认 About → Projects → Categories → Posts → Education（Skills 当前已关闭；开启后位于 Posts 之后）

---

### 归档页按月分组

- `/archives` 在原有按年分组内再按**月份**分组：月份标题（如"八月"）+ 每月篇数，月份按新→旧排列
- 文章仍沿用 `PostPreview` 紧凑行样式，年份描边大字装饰保留
- 月份名用 `Intl.DateTimeFormat` 按 `site.config.ts` 的 `locale.dateLocale` 本地化（当前 zh-CN 显示"八月"等）
- 实现: `groupPostsByMonth`（`src/pages/archives/index.astro` 内），保持现有加载性能（纯内存分组，无额外请求）

### 卡片分类徽章

- `projects.json` / `skills.json` 均支持可选 `category` 字段，卡片右上角显示圆角徽章（border + bg-background/80 + backdrop-blur，跟随主题亮暗色），不填则不显示
- 组件 `ProjectSection.astro` / `SkillSection.astro` 同步支持

### 首页板块顺序

- 默认顺序：About → Projects → Categories → Posts → Education；Skills 板块当前已关闭，开启后位于 Posts 之后

---





### Vercel pagefind 失败 + DEP0190 修复

- `packages/pure/index.ts`：spawn 改为本地 `node_modules/.bin/pagefind(.cmd)`，args 用**单字符串拼接 + shell:true**（避免 Node 24 `DEP0190`，DEP0190 只对 `spawn(cmd, [args], {shell:true})` 数组拼接触发，纯字符串不触发）。同时不再依赖 `npx -y pagefind` 下载步骤，构建更稳定
- `package.json`：钉 `@pagefind/linux-x64@1.5.2` 到 dependencies
  - pagefind@1.5.2 的 platform binary 通过 `optionalDependencies` 分发，Windows dev 机器 lockfile 里只有 `@pagefind/windows-x64`，没有 linux-x64
  - Vercel 在 Linux x64 上 `npm ci` 严格按 lockfile 安装，不会装 `linux-x64`，导致 pagefind 启动时 `resolveBinary` 找不到二进制 → "platform linux-x64 is not yet a supported architecture"
  - 显式钉到 dependencies 强制安装

---

### 部署警告清理 + oxc-parser Linux binding 钉死

`astro check` 与 `npm run build` 的告警清理：

- `content.config.ts`：从 `astro:content` 导入 zod 改为从 `astro/zod` 直接导入（Astro 7 弃用前一种方式）
- `packages/pure/schemas/favicon.ts`：`code: z.ZodIssueCode.custom` 改为 `code: 'custom'`（zod v4 弃用 `ZodIssueCode`）
- 清理无用 import：Footer / server.ts / index / about / categories / links / projects / skills 多处的 6133/6192 警告
- `pagefind spawn` 仍会触发 Node 24 的 `DEP0190` 弃用警告（无害，只是 Node 24 的安全提示），不动

**Vercel 部署 `MODULE_NOT_FOUND` 修复：**

- 根因：oxc-parser@0.131.0 的 platform binding 通过 `optionalDependencies` 分发，Vercel Linux 环境（glibc）下 `npm ci` 没正确安装 `@oxc-parser/binding-linux-x64-gnu`，导致 jiti 加载 `uno.config.ts` 时 `bindings.js` 找不到对应二进制
- 解法：`package.json` 显式添加 `@oxc-parser/binding-linux-x64-gnu` 和 `@oxc-parser/binding-linux-x64-musl` 到 `dependencies`，强制 Vercel 安装 Linux binding（Windows/Mac 开发机不会装，避免本地依赖膨胀）
- 本地 Windows 上 `npm install --force` 用于生成 lockfile 条目

---

### 首屏渲染与图片体积优化（性能）

针对 PageSpeed Insights「不计分」二级诊断做的三处改造，目标是压一压首屏传输和阻塞 RTT：

| 优化点 | 优化前 | 优化后 | 效果 |
|---|---|---|---|
| 首屏 CSS 加载 | 独立 `<link rel="stylesheet">` 阻塞渲染，BaseLayout 与 pages CSS 共 ~15 KiB / ~880ms | `astro.config.ts` 新增 `build.inlineStylesheets: 'always'`，小 CSS 直接内联到 `<style>` | 消除两次渲染阻塞 RTT，对应 PageSpeed「渲染阻塞请求」诊断 |
| 项目卡片右侧配图（`<Image>`） | `width={320} height={200}` + 默认 PNG；显示区域实际只有 256x160 | `width={256} height={160} format='webp'`；Vercel `/_vercel/image` 按真实尺寸 + WebP 输出 | `bot-deploy.png` 23.6→18.0 KiB、`deepseek-harness-guide.png` 23.1→15.2 KiB，合计 ~33 KiB |
| 导航栏头像源图 | `src/assets/touxiang.png` 940x940 / 36.6 KiB（实际显示 128x128） | 256x256 / 24.4 KiB（retina 友好） | 源图瘦身后 Vercel 输出再小一截，预期页面 ~35 KiB → < 5 KiB |

实测首屏传输合计再少 ~65 KiB，初始阻塞 RTT 减少 ~880ms。FCP/LCP 原本已稳在 1.1s，这部分改造主要让首屏更稳、并对未来加图留余量。

### 文章配图 SEO alt 文本 + 写作规范（SEO）

把站内所有文章配图的 alt 文本统一优化为 SEO 友好的描述：每张图都结合所在小节语境，标明它在文章流程里的角色（步骤 / 界面 / 配置 / 对比），带上品牌、版本号、关键参数等 SEO 关键词；同一张图被多次复用时按上下文分别重写，避免复制粘贴；不出现明文 Token / 密码等敏感信息。

具体改造措施与结果（11 篇带图文章合计 68 处图片引用，0 处空 alt）以 [src/content/AGENTS.md](/src/content/AGENTS.md) 新增的「图片 alt 文本规范」一节为准，避免后续新文章再次出现空 alt 占位。

### 工程小改

- 修 `<!- prettier-ignore -->` 非法 HTML 注释（`packages/pure/components/basic/Footer.astro`、`advanced/GithubCard.astro`）
- error-map.ts 重写为 zod v4 最小实现（不再依赖 zod 内部类型）
- social.ts 改用 `z.record(string, unknown)` 接受空 `social: {}`

---

## 项目结构

```
src/
├── content.config.ts          # zod v4 schema，含 categories
├── site.config.ts              # 主题/集成/分类枚举/Header 菜单
├── content/blog/<slug>/        # 24 篇文章，每篇一个目录
│   └── index.md
├── layouts/
│   ├── BaseLayout.astro
│   ├── ContentLayout.astro     # 文章页布局，含阅读进度条
│   ├── BlogPost.astro          # 文章页：Hero + 正文 + ArticleBottom（上一篇/下一篇）
│   ├── CommonPage.astro
│   ├── IndividualPage.astro
├── pages/
│   ├── index.astro
│   ├── about/, archives/, blog/, links/, search/, tags/
│   ├── categories/             # 新增
│   │   ├── index.astro
│   │   └── [category]/[...page].astro
│   ├── blog/[...id].astro
│   ├── blog/[...page].astro
│   ├── rss.xml.ts
│   ├── robots.txt.ts
├── components/
│   ├── BaseHead.astro, BlogPostingJsonLd.astro, WebSiteJsonLd.astro
│   ├── about/, home/, links/, projects/, waline/(空了), basic/, etc.
├── plugins/
│   ├── rehype-auto-link-headings.ts
│   └── shiki-{custom,official}/

packages/pure/                  # astro-pure 工作区包
├── components/{basic,pages,advanced,user}/
├── types/
│   ├── user-config.ts          # zod v4（已是 v4 兼容）
│   ├── theme-config.ts
│   ├── integrations-config.ts  # 已移除 waline 块
├── utils/
│   ├── server.ts               # getBlogCollection, sortMDByDate, getUniqueTags, getUniqueCategories 等
│   ├── error-map.ts            # 简化的 zod v4 错误处理
```

---

## 开发命令

```bash
# 安装
npm install           # 不用 bun.lock 那个；走 npm
                      # pnpm / bun 也可

# 本地预览
npm run dev           # http://localhost:4321
                      # 后台 dev server (Codex 自动识别)，状态查 npx astro dev status

# 类型检查 + 同步
npm run check         # astro check (0 errors, 0 warnings)
npm run sync          # astro sync

# 构建
npm run build         # 走 vercel adapter
```

---



## 后台 dev server (Astro 7 新功能)

`npm run dev` 启动后会自动后台运行（检测到 AI agent 进程时），并写入 `.astro/dev.json` 锁文件。

```bash
npx astro dev status    # 看 PID / uptime / URL
npx astro dev logs      # 看日志（流式）
npx astro dev logs -f   # 类似 tail -f
npx astro dev stop      # 干净关闭（SIGTERM → 5s 后 SIGKILL）
curl http://localhost:4321/_astro/status  # 健康检查端点
```

---



## License

Apache 2.0（同上游）。详见 [LICENSE](LICENSE)。
