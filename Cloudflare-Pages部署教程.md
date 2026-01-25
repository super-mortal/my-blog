# Cloudflare Pages 部署 Astro 博客完整教程

## 📋 为什么选择 Cloudflare Pages？

### Vercel 的问题
- ❌ 国内访问速度慢
- ❌ 经常被墙，不稳定
- ❌ 部分地区无法访问

### Cloudflare Pages 的优势
- ✅ **国内访问速度快**（比 Vercel 快 3-5 倍）
- ✅ **完全免费**，无限流量
- ✅ **自动 HTTPS**
- ✅ **全球 CDN**（300+ 节点）
- ✅ **自动部署**（连接 GitHub）
- ✅ **支持自定义域名**
- ✅ **不需要备案**（使用 Cloudflare 域名）

### 对比表格

| 特性 | Vercel | Cloudflare Pages | 腾讯云服务器 |
|------|--------|------------------|-------------|
| 国内速度 | ⭐ 慢 | ⭐⭐⭐⭐ 快 | ⭐⭐⭐⭐⭐ 最快 |
| 价格 | 免费 | 免费 | 50-300元/月 |
| 部署难度 | 简单 | 简单 | 中等 |
| 需要备案 | 否 | 否 | 是 |
| 自动部署 | ✅ | ✅ | 需配置 |
| 流量限制 | 100GB/月 | 无限 | 看套餐 |

---

## 🎯 部署步骤

### 第一步：注册 Cloudflare 账号

1. 访问：https://dash.cloudflare.com/sign-up
2. 填写邮箱和密码
3. 验证邮箱
4. 登录成功

**注意：** 注册是完全免费的，不需要信用卡。

---

### 第二步：创建 Pages 项目

#### 1. 进入 Pages 控制台

1. 登录 Cloudflare
2. 点击左侧菜单 **"Workers & Pages"**
3. 点击 **"Create application"**（创建应用）
4. 选择 **"Pages"** 标签
5. 点击 **"Connect to Git"**（连接到 Git）

#### 2. 连接 GitHub

1. 点击 **"Connect GitHub"**
2. 授权 Cloudflare 访问你的 GitHub
3. 选择授权范围：
   - **All repositories**（所有仓库）
   - 或 **Only select repositories**（选择 `my-blog` 仓库）
4. 点击 **"Install & Authorize"**

#### 3. 选择仓库

1. 在仓库列表中找到 **`my-blog`**
2. 点击 **"Begin setup"**（开始设置）

---

### 第三步：配置构建设置

在配置页面填写：

```
项目名称：my-blog（或其他名称）
生产分支：main
```

**构建设置：**
```
Framework preset：Astro（自动检测）
Build command：pnpm build
Build output directory：dist
Root directory：/（保持默认）
```

**环境变量：**（通常不需要）
- 如果有特殊配置，可以添加

点击 **"Save and Deploy"**（保存并部署）

---

### 第四步：等待部署完成

1. Cloudflare 开始构建项目
2. 可以看到实时构建日志
3. 大约 3-5 分钟后部署完成
4. 显示 **"Success!"** 和你的网站地址

**临时域名格式：**
```
https://my-blog-xxx.pages.dev
```

点击链接访问你的博客！

---

### 第五步：配置自定义域名

#### 方案一：使用 Cloudflare 管理的域名（推荐）

如果你的域名在 Cloudflare：

1. 在 Pages 项目页面，点击 **"Custom domains"**
2. 点击 **"Set up a custom domain"**
3. 输入你的域名：`supermortal.top`
4. 点击 **"Continue"**
5. Cloudflare 会自动配置 DNS
6. 点击 **"Activate domain"**
7. 等待 1-5 分钟生效

#### 方案二：域名在其他服务商（如腾讯云）

**步骤 1：在 Cloudflare Pages 添加域名**

1. 点击 **"Custom domains"**
2. 点击 **"Set up a custom domain"**
3. 输入域名：`supermortal.top`
4. Cloudflare 会显示需要添加的 DNS 记录

**步骤 2：在腾讯云 DNS 配置**

Cloudflare 会要求添加 CNAME 记录：

```
主机记录：@
记录类型：CNAME
记录值：my-blog-xxx.pages.dev
TTL：600
```

```
主机记录：www
记录类型：CNAME  
记录值：my-blog-xxx.pages.dev
TTL：600
```

**注意：** `@` 记录可能不支持 CNAME，需要改用 A 记录或 ALIAS 记录。

**步骤 3：验证域名**

1. 添加 DNS 记录后，回到 Cloudflare
2. 点击 **"Check DNS"**
3. 等待验证通过（5-30 分钟）
4. 验证成功后，HTTPS 自动配置

---

## 🔄 自动部署

### 工作原理

每次推送代码到 GitHub，Cloudflare Pages 会自动：
1. 检测到代码更新
2. 拉取最新代码
3. 执行构建命令
4. 部署到全球 CDN
5. 发送邮件通知

### 测试自动部署

```bash
# 修改一些内容
git add .
git commit -m "测试自动部署"
git push
```

1. 推送后，访问 Cloudflare Pages 控制台
2. 可以看到新的部署任务
3. 等待 3-5 分钟
4. 部署完成后，刷新网站查看更新

---

## 🌐 将域名迁移到 Cloudflare（推荐）

### 为什么要迁移？

- ✅ 免费 CDN 加速
- ✅ 免费 DDoS 防护
- ✅ 免费 SSL 证书
- ✅ 更快的 DNS 解析
- ✅ 更方便的域名管理

### 迁移步骤

#### 第一步：添加站点到 Cloudflare

1. 登录 Cloudflare
2. 点击 **"Add a site"**（添加站点）
3. 输入域名：`supermortal.top`
4. 选择 **Free 计划**
5. 点击 **"Continue"**

#### 第二步：导入 DNS 记录

1. Cloudflare 会自动扫描现有 DNS 记录
2. 检查记录是否正确
3. 点击 **"Continue"**

#### 第三步：更改域名服务器

Cloudflare 会提供两个 DNS 服务器地址，类似：
```
ns1.cloudflare.com
ns2.cloudflare.com
```

**在腾讯云修改 DNS 服务器：**

1. 登录腾讯云控制台
2. 进入 **"域名管理"**
3. 找到你的域名，点击 **"管理"**
4. 点击 **"DNS 服务器"** 或 **"修改 DNS"**
5. 将 DNS 服务器改为 Cloudflare 提供的地址
6. 保存

#### 第四步：等待生效

1. 回到 Cloudflare，点击 **"Done, check nameservers"**
2. 等待 DNS 服务器生效（通常 24 小时内）
3. Cloudflare 会发邮件通知激活成功

#### 第五步：配置 DNS 记录

DNS 迁移完成后，在 Cloudflare 配置：

1. 点击 **"DNS"** → **"Records"**
2. 添加记录指向 Pages：
   ```
   类型：CNAME
   名称：@
   目标：my-blog-xxx.pages.dev
   代理状态：已代理（橙色云朵）
   ```
   ```
   类型：CNAME
   名称：www
   目标：my-blog-xxx.pages.dev
   代理状态：已代理（橙色云朵）
   ```

**重要：** 开启"代理状态"（橙色云朵）可以启用 CDN 加速。

---

## ⚡ 性能优化

### 1. 开启 Cloudflare CDN

在 DNS 记录中，确保"代理状态"是橙色云朵（已代理）。

### 2. 配置缓存规则

1. 点击 **"Caching"** → **"Configuration"**
2. 设置缓存级别：**Standard**
3. 浏览器缓存 TTL：**4 hours**

### 3. 开启 Auto Minify

1. 点击 **"Speed"** → **"Optimization"**
2. 开启 **Auto Minify**：
   - ✅ JavaScript
   - ✅ CSS
   - ✅ HTML

### 4. 开启 Brotli 压缩

1. 在 **"Speed"** → **"Optimization"**
2. 开启 **Brotli** 压缩

### 5. 开启 HTTP/3

1. 点击 **"Network"**
2. 开启 **HTTP/3 (with QUIC)**

---

## 🔒 安全设置

### 1. 配置 SSL/TLS

1. 点击 **"SSL/TLS"** → **"Overview"**
2. 选择加密模式：**Full (strict)**（推荐）

### 2. 开启 Always Use HTTPS

1. 在 **"SSL/TLS"** → **"Edge Certificates"**
2. 开启 **Always Use HTTPS**
3. 所有 HTTP 请求自动跳转到 HTTPS

### 3. 启用 HSTS

1. 在 **"SSL/TLS"** → **"Edge Certificates"**
2. 开启 **HSTS**
3. 设置：
   - Max Age：6 months
   - ✅ Include subdomains
   - ✅ Preload

### 4. 配置防火墙规则

1. 点击 **"Security"** → **"WAF"**
2. 创建规则阻止恶意请求
3. 例如：阻止特定国家/地区的访问

---

## 📊 监控和分析

### 1. 查看访问统计

1. 点击 **"Analytics & Logs"**
2. 可以看到：
   - 访问量
   - 带宽使用
   - 请求数
   - 缓存命中率

### 2. 查看部署历史

1. 进入 Pages 项目
2. 点击 **"Deployments"**
3. 可以看到所有部署记录
4. 可以回滚到之前的版本

### 3. 查看构建日志

1. 点击某个部署
2. 查看详细的构建日志
3. 排查构建错误

---

## 🔄 其他 Vercel 替代方案

### 1. Netlify

**优点：**
- ✅ 国内访问速度比 Vercel 快
- ✅ 免费额度充足
- ✅ 功能强大

**缺点：**
- ❌ 比 Cloudflare Pages 慢
- ❌ 免费版有带宽限制（100GB/月）

**部署方法：**
1. 访问：https://www.netlify.com/
2. 连接 GitHub
3. 选择仓库
4. 配置构建：
   ```
   Build command: pnpm build
   Publish directory: dist
   ```
5. 部署

### 2. GitHub Pages

**优点：**
- ✅ 完全免费
- ✅ 与 GitHub 深度集成

**缺点：**
- ❌ 国内访问较慢
- ❌ 不支持服务端功能
- ❌ 需要手动配置 HTTPS

**部署方法：**
需要配置 GitHub Actions，相对复杂。

### 3. Render

**优点：**
- ✅ 支持静态网站和后端服务
- ✅ 免费额度

**缺点：**
- ❌ 国内访问速度一般
- ❌ 免费版有限制

### 4. Railway

**优点：**
- ✅ 现代化界面
- ✅ 支持多种部署方式

**缺点：**
- ❌ 免费额度有限
- ❌ 国内访问速度一般

### 推荐排序（国内访问速度）

1. 🥇 **Cloudflare Pages**（最推荐）
2. 🥈 **Netlify**
3. 🥉 **Vercel**
4. **GitHub Pages**
5. **Render**

---

## 🆚 详细对比

### Cloudflare Pages vs Vercel

| 特性 | Cloudflare Pages | Vercel |
|------|-----------------|--------|
| 国内访问速度 | ⭐⭐⭐⭐⭐ | ⭐⭐ |
| 全球 CDN 节点 | 300+ | 70+ |
| 免费流量 | 无限 | 100GB/月 |
| 免费构建时间 | 500次/月 | 100小时/月 |
| 自定义域名 | ✅ 无限 | ✅ 无限 |
| 自动 HTTPS | ✅ | ✅ |
| 边缘函数 | ✅ Workers | ✅ Edge Functions |
| 价格 | 完全免费 | 免费/付费 |

### 速度测试（国内）

**Ping 延迟：**
- Cloudflare Pages：50-100ms
- Vercel：200-500ms（不稳定）
- 腾讯云服务器：10-50ms

**首屏加载时间：**
- Cloudflare Pages：1-2秒
- Vercel：3-5秒
- 腾讯云服务器：0.5-1秒

---

## 🎯 最佳实践建议

### 方案一：纯 Cloudflare（推荐）

**适合：** 个人博客、小型网站

```
GitHub → Cloudflare Pages → 全球 CDN
```

**优点：**
- 完全免费
- 配置简单
- 国内访问快
- 不需要备案

### 方案二：Cloudflare + 腾讯云（最优）

**适合：** 对速度要求高的网站

```
国内用户 → 腾讯云服务器（需备案）
海外用户 → Cloudflare Pages
```

**实现方法：**
1. 部署到 Cloudflare Pages
2. 同时部署到腾讯云服务器
3. 使用 DNS 智能解析：
   - 国内线路 → 腾讯云 IP
   - 海外线路 → Cloudflare Pages

### 方案三：多平台部署

**适合：** 追求极致可用性

```
主站：Cloudflare Pages
备用：Vercel
镜像：腾讯云服务器
```

---

## ❓ 常见问题

### Q1：Cloudflare Pages 部署失败

**常见原因：**
- 构建命令错误
- 依赖安装失败
- 内存不足

**解决：**
1. 查看构建日志
2. 检查 `package.json` 中的脚本
3. 确认 Node.js 版本兼容

### Q2：自定义域名无法访问

**检查：**
1. DNS 记录是否正确
2. 是否等待 DNS 生效（最多 24 小时）
3. 清除浏览器缓存

### Q3：网站更新不生效

**原因：** CDN 缓存

**解决：**
1. 在 Cloudflare 控制台
2. 点击 **"Caching"** → **"Configuration"**
3. 点击 **"Purge Everything"**（清除所有缓存）

### Q4：如何回滚到之前的版本？

1. 进入 Pages 项目
2. 点击 **"Deployments"**
3. 找到之前的部署
4. 点击 **"Rollback to this deployment"**

### Q5：Cloudflare Pages 有什么限制？

**免费版限制：**
- 构建次数：500次/月
- 单次构建时间：20分钟
- 文件大小：25MB/文件
- 总项目大小：20,000个文件

**通常足够个人博客使用。**

---

## 📝 总结

### 为什么选择 Cloudflare Pages？

1. ✅ **国内访问速度快**（比 Vercel 快 3-5 倍）
2. ✅ **完全免费**，无限流量
3. ✅ **部署简单**，5 分钟搞定
4. ✅ **自动部署**，推送即更新
5. ✅ **全球 CDN**，300+ 节点
6. ✅ **不需要备案**

### 部署流程回顾

1. 注册 Cloudflare 账号
2. 连接 GitHub 仓库
3. 配置构建设置
4. 等待部署完成
5. 配置自定义域名（可选）

### 下一步

- 🎨 优化网站性能
- 🔒 配置安全设置
- 📊 查看访问统计
- 🌐 考虑将域名迁移到 Cloudflare

---

**文档版本：** v1.0  
**更新日期：** 2026-01-25  
**作者：** Kiro AI Assistant  
**推荐指数：** ⭐⭐⭐⭐⭐
