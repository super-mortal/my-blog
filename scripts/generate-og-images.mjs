// scripts/generate-og-images.mjs
// Build-time: 为每篇文章 + 站点生成 1200x630 Open Graph 分享卡
// 颜色: fm.heroImage.color > site.config.ts themeColor > app.css --primary
// prebuild 钩子 (Vercel build 时自动跑)

import { existsSync } from 'node:fs'
import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { Resvg } from '@resvg/resvg-js'
import satori from 'satori'

const ROOT = process.cwd()
const BLOG_DIR = join(ROOT, 'src/content/blog')
const OG_DIR = join(ROOT, 'public/og')
const SITE_CARD = join(ROOT, 'public/images/social-card.png')

function hslToHex(h, s, l) {
  s /= 100
  l /= 100
  const k = (n) => (n + h / 30) % 12
  const a = s * Math.min(l, 1 - l)
  const f = (n) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)))
  const to = (x) => Math.round(x * 255).toString(16).padStart(2, '0')
  return '#' + to(f(0)) + to(f(8)) + to(f(4))
}

function shadeHex(hex, factor) {
  const m = hex.replace('#', '').match(/.{2}/g)
  if (!m) return hex
  const [r, g, b] = m.map((h) => parseInt(h, 16))
  const ad = (c) => {
    const v = factor < 1 ? Math.round(c * factor) : Math.round(c + (255 - c) * (factor - 1))
    return Math.max(0, Math.min(255, v)).toString(16).padStart(2, '0')
  }
  return '#' + ad(r) + ad(g) + ad(b)
}

function hexToRgb(hex) {
  const m = hex.replace('#', '').match(/.{2}/g)
  if (!m) return '255, 255, 255'
  return m.map((h) => parseInt(h, 16)).join(', ')
}

async function loadSiteConfig() {
  const src = await readFile(join(ROOT, 'src/site.config.ts'), 'utf8')
  const t = src.match(/title:\s*['"](.+?)['"]/)
  const a = src.match(/author:\s*['"](.+?)['"]/)
  const d = src.match(/description:\s*['"](.+?)['"]/)
  const tcMatch = src.match(/^\s*themeColor:\s*['"](#[0-9a-fA-F]{3,8})['"]/m)
  return {
    title: t?.[1] ?? 'Blog',
    author: a?.[1] ?? 'Author',
    description: d?.[1] ?? '',
    themeColor: tcMatch?.[1] || null
  }
}

async function loadThemeColors(siteThemeColor) {
  let primary
  if (siteThemeColor && /^#[0-9a-fA-F]{6}$/.test(siteThemeColor)) {
    primary = siteThemeColor
  } else {
    const css = await readFile(join(ROOT, 'src/assets/styles/app.css'), 'utf8')
    const primaryMatch = css.match(/--primary:\s*(\d+)\s+(\d+)%\s+(\d+)%/)
    if (!primaryMatch) throw new Error('--primary not found in app.css')
    primary = hslToHex(+primaryMatch[1], +primaryMatch[2], +primaryMatch[3])
  }
  return {
    primary,
    primaryLight: shadeHex(primary, 1.4)
  }
}

let regularFont
async function loadFont() {
  if (!regularFont) regularFont = await readFile(join(ROOT, 'scripts/fonts/NotoSansSC-Regular.ttf'))
  return [{ name: 'Noto Sans SC', data: regularFont, weight: 400, style: 'normal' }]
}

function parseFrontmatter(raw) {
  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/)
  if (!m) return {}
  const fm = {}
  const lines = m[1].split(/\r?\n/)
  let i = 0
  while (i < lines.length) {
    const line = lines[i]
    const top = line.match(/^([A-Za-z]\w*):\s*(.*)$/)
    if (!top) {
      i++
      continue
    }
    const key = top[1]
    const val = top[2].trim()
    if (val === '') {
      const nested = {}
      i++
      while (i < lines.length && /^\s+/.test(lines[i])) {
        const nm = lines[i].match(/^\s+(\w+):\s*(.*)$/)
        if (nm) {
          let nv = nm[2].trim()
          if ((nv.startsWith("'") && nv.endsWith("'")) || (nv.startsWith('"') && nv.endsWith('"'))) nv = nv.slice(1, -1)
          nested[nm[1]] = nv
        }
        i++
      }
      fm[key] = nested
    } else {
      if ((val.startsWith("'") && val.endsWith("'")) || (val.startsWith('"') && val.endsWith('"'))) fm[key] = val.slice(1, -1)
      else if (val === 'true') fm[key] = true
      else if (val === 'false') fm[key] = false
      else if (/^\d+$/.test(val)) fm[key] = +val
      else fm[key] = val
      i++
    }
  }
  return fm
}

function buildOgTemplate(opts) {
  const {
    brand,
    badge,
    title,
    description,
    ctaText,
    ctaSubLines,
    codeLines,
    baseColor,
    articleRgb,
    primaryLightRgb,
    accentBright,
    accentText,
    ctaBg,
    terminalTitle
  } = opts
  const ink = '#1f2430'
  const muted = 'rgba(31, 36, 48, 0.66)'
  const faint = 'rgba(31, 36, 48, 0.42)'
  return {
    type: 'div',
    props: {
      style: {
        width: '1200px',
        height: '630px',
        display: 'flex',
        flexDirection: 'row',
        background: 'linear-gradient(135deg, #ffffff 0%, #eef3fb 100%)',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        position: 'relative',
        overflow: 'hidden'
      },
      children: [
        { type: 'div', props: { style: { position: 'absolute', top: '-180px', right: '-140px', width: '480px', height: '480px', borderRadius: '240px', background: `rgba(${articleRgb}, 0.14)`, filter: 'blur(50px)' } } },
        { type: 'div', props: { style: { position: 'absolute', bottom: '-160px', left: '-120px', width: '400px', height: '400px', borderRadius: '200px', background: `rgba(${primaryLightRgb}, 0.2)`, filter: 'blur(46px)' } } },
        {
          type: 'div',
          props: {
            style: { display: 'flex', flexDirection: 'column', flex: 1, padding: '56px 44px 48px 60px', position: 'relative' },
            children: [
              { type: 'div', props: { style: { display: 'flex', alignItems: 'center', gap: '14px' }, children: [
                { type: 'div', props: { style: { width: '44px', height: '44px', borderRadius: '12px', background: baseColor, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff', fontSize: '22px', fontWeight: 800 }, children: brand.initial } },
                { type: 'div', props: { style: { display: 'flex', flexDirection: 'column' }, children: [
                  { type: 'div', props: { style: { fontSize: '20px', fontWeight: 700, color: ink }, children: brand.name } },
                  { type: 'div', props: { style: { fontSize: '13px', color: faint, marginTop: '2px' }, children: brand.sub } }
                ] } }
              ] } },
              { type: 'div', props: { style: { display: 'flex', flexDirection: 'column', alignItems: 'flex-start', maxWidth: '540px', marginTop: '38px' }, children: [
                { type: 'div', props: { style: { display: 'flex', padding: '8px 18px', borderRadius: '999px', background: `rgba(${articleRgb}, 0.10)`, border: `1.5px solid rgba(${articleRgb}, 0.28)`, color: accentText, fontSize: '15px', fontWeight: 600 }, children: badge } },
                { type: 'div', props: { style: { display: 'flex', marginTop: '22px', fontSize: title.length > 18 ? '50px' : '60px', fontWeight: 800, lineHeight: 1.14, color: ink, letterSpacing: '0px' }, children: title } },
                ...(description ? [{ type: 'div', props: { style: { display: 'flex', marginTop: '18px', color: muted, fontSize: '20px', lineHeight: 1.5, maxWidth: '500px' }, children: description } }] : [])
              ] } },
              { type: 'div', props: { style: { flex: 1 } } },
              { type: 'div', props: { style: { display: 'flex', alignItems: 'center', gap: '18px' }, children: [
                { type: 'div', props: { style: { display: 'flex', alignItems: 'center', padding: '15px 28px', borderRadius: '12px', background: ctaBg, color: '#ffffff', fontSize: '18px', fontWeight: 700 }, children: ctaText } },
                { type: 'div', props: { style: { display: 'flex', flexDirection: 'column', color: faint, fontSize: '13px', lineHeight: 1.3 }, children: ctaSubLines.map((l, i) => ({ type: 'div', props: { style: { display: 'flex', color: l.muted ? muted : faint, fontSize: i === 0 ? '13px' : '12px' }, children: l.text } })) } }
              ] } }
            ]
          }
        },
        {
          type: 'div',
          props: {
            style: { display: 'flex', alignItems: 'center', width: '430px', padding: '56px 56px 48px 0', position: 'relative' },
            children: [
              {
                type: 'div',
                props: {
                  style: { display: 'flex', flexDirection: 'column', width: '100%', height: '400px', borderRadius: '22px', background: '#0f1522', border: '1px solid rgba(31, 36, 48, 0.08)', overflow: 'hidden' },
                  children: [
                    { type: 'div', props: { style: { display: 'flex', alignItems: 'center', gap: '8px', height: '48px', padding: '0 18px', background: 'rgba(255, 255, 255, 0.06)' }, children: [
                      { type: 'div', props: { style: { width: '11px', height: '11px', borderRadius: '6px', background: '#ff5f57' } } },
                      { type: 'div', props: { style: { width: '11px', height: '11px', borderRadius: '6px', background: '#febc2e' } } },
                      { type: 'div', props: { style: { width: '11px', height: '11px', borderRadius: '6px', background: '#28c840' } } },
                      { type: 'div', props: { style: { display: 'flex', marginLeft: '12px', color: 'rgba(255, 255, 255, 0.45)', fontSize: '13px' }, children: terminalTitle } }
                    ] } },
                    { type: 'div', props: { style: { display: 'flex', flexDirection: 'column', gap: '16px', padding: '24px 22px', flex: 1 }, children: [
                      ...codeLines.map((line) => ({
                        type: 'div',
                        props: {
                          style: { display: 'flex', alignItems: 'center', gap: '12px' },
                          children: [
                            { type: 'div', props: { style: { display: 'flex', color: line.p === '$' ? accentBright : line.p === '\u2713' ? '#7ee8a2' : 'rgba(255, 255, 255, 0.35)', fontSize: '16px', fontWeight: 700, width: '18px' }, children: line.p } },
                            { type: 'div', props: { style: { display: 'flex', color: line.c, fontSize: '16px', lineHeight: 1.4 }, children: line.t } }
                          ]
                        }
                      })),
                      { type: 'div', props: { style: { display: 'flex', width: '10px', height: '20px', background: accentBright, borderRadius: '2px' } } }
                    ] } }
                  ]
                }
              }
            ]
          }
        }
      ]
    }
  }
}

async function renderCard(vdom, outPath) {
  const svg = await satori(vdom, { width: 1200, height: 630, fonts: await loadFont() })
  const resvg = new Resvg(svg, { fitTo: { mode: 'width', value: 1200 } })
  const png = resvg.render().asPng()
  await writeFile(outPath, png)
  return png
}

async function generateOne(slug, fm, site, colors) {
  const title = String(fm.title || slug)
  const description = String(fm.description || '')
  const tags = Array.isArray(fm.tags) ? fm.tags : []
  const published = String(fm.publishDate || '').slice(0, 10)
  const titleDisplay = title.length > 24 ? title.slice(0, 23) + '...' : title
  const descDisplay = description.length > 58 ? description.slice(0, 57) + '...' : description

  const articleColor =
    fm.heroImage && typeof fm.heroImage.color === 'string' && /^#?[0-9a-fA-F]{3,8}$/.test(fm.heroImage.color)
      ? (fm.heroImage.color.startsWith('#') ? fm.heroImage.color : '#' + fm.heroImage.color)
      : null
  const baseColor = articleColor || colors.primary
  const articleRgb = hexToRgb(baseColor)
  const primaryLightRgb = hexToRgb(colors.primaryLight)
  const accentBright = shadeHex(baseColor, 1.5)
  const accentText = shadeHex(baseColor, 0.72)
  const ctaBg = shadeHex(baseColor, 0.78)

  const vdom = buildOgTemplate({
    brand: { initial: site.author.slice(0, 1).toUpperCase(), name: site.title, sub: '技术博客' },
    badge: tags[0] || '博客',
    title: titleDisplay,
    description: descDisplay,
    ctaText: '阅读全文 →',
    ctaSubLines: [{ text: site.title.toLowerCase() + '.cn' }, { text: published, muted: true }],
    codeLines: [
      { p: '$', t: 'npm run build', c: accentBright },
      { p: '>', t: '渲染文章分享卡...', c: 'rgba(255, 255, 255, 0.62)' },
      { p: '>', t: '生成 1200 x 630 封面', c: 'rgba(255, 255, 255, 0.62)' },
      { p: '\u2713', t: '发布成功 · 阅读全文', c: '#7ee8a2' }
    ],
    baseColor,
    articleRgb,
    primaryLightRgb,
    accentBright,
    accentText,
    ctaBg,
    terminalTitle: 'blog · build'
  })

  const png = await renderCard(vdom, join(OG_DIR, slug + '.png'))
  console.log('  + ' + slug + '.png (' + (png.length / 1024).toFixed(1) + ' KB)' + (articleColor ? ' [article-color]' : ''))
}

async function generateSiteCard(site, colors) {
  const baseColor = colors.primary
  const articleRgb = hexToRgb(baseColor)
  const primaryLightRgb = hexToRgb(colors.primaryLight)
  const accentBright = shadeHex(baseColor, 1.5)
  const accentText = shadeHex(baseColor, 0.72)
  const ctaBg = shadeHex(baseColor, 0.78)
  const tagline = '一个凡人程序员的 AI 与开源折腾记录'
  const titleDisplay = tagline.length > 24 ? tagline.slice(0, 23) + '...' : tagline
  const siteDesc = String(site.description || '')
  const descDisplay = siteDesc.length > 58 ? siteDesc.slice(0, 57) + '...' : siteDesc

  const vdom = buildOgTemplate({
    brand: { initial: site.author.slice(0, 1).toUpperCase(), name: site.title, sub: '技术博客' },
    badge: '技术 · 开源',
    title: titleDisplay,
    description: descDisplay,
    ctaText: '开始阅读 →',
    ctaSubLines: [{ text: site.title.toLowerCase() + '.cn' }],
    codeLines: [
      { p: '$', t: 'git clone super-mortal', c: accentBright },
      { p: '>', t: '拉取最新文章与项目...', c: 'rgba(255, 255, 255, 0.62)' },
      { p: '>', t: '每周三更新 · 欢迎 Star', c: 'rgba(255, 255, 255, 0.62)' },
      { p: '\u2713', t: '欢迎来到博客', c: '#7ee8a2' }
    ],
    baseColor,
    articleRgb,
    primaryLightRgb,
    accentBright,
    accentText,
    ctaBg,
    terminalTitle: 'super-mortal · home'
  })

  const png = await renderCard(vdom, SITE_CARD)
  console.log('  + social-card.png (' + (png.length / 1024).toFixed(1) + ' KB) [site]')
}

async function main() {
  console.log('-> Generating OG images...')
  if (!existsSync(OG_DIR)) await mkdir(OG_DIR, { recursive: true })
  const site = await loadSiteConfig()
  const colors = await loadThemeColors(site.themeColor)
  console.log('   site: ' + site.title + ' | primary: ' + colors.primary + (site.themeColor ? ' (overridden)' : ' (from app.css)'))

  await generateSiteCard(site, colors)

  const dirs = (await readdir(BLOG_DIR, { withFileTypes: true })).filter((d) => d.isDirectory())
  let count = 0
  for (const d of dirs) {
    const file = join(BLOG_DIR, d.name, 'index.md')
    if (!existsSync(file)) continue
    const raw = await readFile(file, 'utf8')
    const fm = parseFrontmatter(raw)
    if (fm.draft) {
      console.log('   skip ' + d.name + ' (draft)')
      continue
    }
    const outSlug = fm.slug || d.name
    await generateOne(outSlug, fm, site, colors)
    count++
  }
  console.log('Done. ' + count + ' images in public/og/ + 1 social card')
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})