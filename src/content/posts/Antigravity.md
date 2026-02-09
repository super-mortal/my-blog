---
title: Antigravity反代部署实战笔记
published: 2026-02-09
pinned: false
description: 如何通过Antigravity反代部署，白嫖Claude和Gemini大模型
tags: [AI][笔记]
category: AI
licenseName: "未授权"
author: mortal
# sourceLink: "https://github.com/emn178/markdown"
draft: false
slug: Antigravity
---

# Antigravity 的 AI 模型反代部署

> **反向代理（Antigravity tools）技术原理**：通过在本地搭建代理服务器，将客户端的 API 请求转发至 Google Antigravity 服务端点，实现对 Claude 和 Gemini 模型的统一访问。Antigravity tools 兼容了OpenAI协议，Anthropic 协议和Gemini协议，同时实现了多账户负载均衡和智能配额管理。这使得自己可以将这些模型接入其他AI工具中进行使用

## Antigravity 介绍

Antigravity 是 Google 推出的 AI 驱动的集成开发环境（IDE），提供了强大的 Claude 和 Gemini 模型访问能力。其免费版按周刷新额度，并且采用模型隔离机制（两个模型免费额度分开计算），通过Antigravity tools，可以将这些模型接入到其他AI工具中使用。

## 使用到的工具

**Antigravity tools** [github下载链接](https://github.com/lbjlaq/Antigravity-Manager)

**核心特性：**
- ✅ **免费使用**：Antigravity 公开预览期间可免费使用 Claude 和 Gemini 模型
- ✅ **多账户管理**：支持多个 Google 账户轮换，突破单账户配额限制
- ✅ **兼容性强**：提供OpenAI，Anthropic 和Gemini 兼容的 API 接口，可接入各种 AI 工具
- ✅ **智能路由**：自动选择可用账户，优化请求分配
- ✅ **图形界面**：相比命令行工具更加直观易用
- ✅ **实时监控：** 实时监控对应模型剩余额度

以及我使用的AI工具 **cherry studio** [下载地址](https://www.cherry-ai.com)

>**cherry studio** 是一款github开源的具备自主编码、智能自动化和统一访问前沿大型语言模型的代理型 AI 桌面应用

## 前置要求

- ✔️ 一个或多个 Google 账户（需要个人账户，企业不行）
- ✔️ 已登录 [Antigravity IDE](https://antigravity.google/)

> **注意**：Google AI Pro好像可以通过学生认证获得，有一年使用期，Pro版的Antigravity模型是5小时和周双刷新机制，额度更加充足，后面再研究

## 使用步骤

### 1. 下载安装 Antigravity tools

1. 访问 [Releases 页面](https://github.com/lbjlaq/Antigravity-Manager/releases/tag/v4.1.10) 下载安装对应的版本
2. 点击"添加账号"按钮，浏览器会自动打开 Google OAuth 授权页面，登录准备好的 Google 账户并授权访问
3. 点击API反代，然后右上角点击启动服务即可开始使用

>Antigravity tools 默认使用的是本机8045端口，启动服务之后检查8045端口是否被监听，打开命令提示符执行以下命令，有LISTENING状态即表示成功

```bash
netstat -ano | findstr ":8045"
```

### 2. 接入AI工具

1. 进入cherry studio设置中模型服务页面，点击下方添加，添加模型提供方
2. 添加成功后，右侧填入Antigravity tools中的API密钥
3. 添加API访问地址，因为是本地部署所以是填写  http://127.0.0.1:8045

![配置页面](/assets/images/peizhi.png)

4. 成功后可以根据Antigravity tools反代API 页面所提取到的模型按需加入cherry studio中进行使用
5. 最后测试模型是否可以正常使用，因为是通过Antigravity进行反代的，所以他的第一次回答会说他是Antigravity模型

![测试模型](/assets/images/ceshi.png)

>值得注意的是：整个过程需要在科学上网的环境中完成，包括后续的使用也需要在这样的网络环境下

## 常见问题

### 1. Antigravity无法启动（登录失败）

**解决方案：**

* 代理工具需要开启全局tun模式
* 确保已在浏览器中登录过 Antigravity IDE

### 3. Antigravity tools服务无法启动

**解决方案：**
- 检查端口 8045 是否被其他程序占用
- 在 Antigravity tools设置中更改端口
- 确认至少添加了一个 Google 账户

### 4. 使用过程中报错

>请求速率超过限制，请稍后再试    这个是因为免费版对每分钟以及每天请求次数都有限制

**解决方案：**
- 添加更多 Google 账户进行轮换
- 等待配额重置
- 升级到 Google 订阅

## 工作原理

反代的核心流程：

1. **请求接收**：客户端 发送 API 格式的请求到本地代理（`localhost:8045`）
2. **格式转换**：Antigravity tools 将请求转换为对应的 API 格式
3. **账户选择**：智能选择可用的 Google 账户
4. **OAuth 认证**：使用选中账户的 OAuth token 发送请求到 Antigravity
5. **响应转换**：将 Antigravity 的响应转换回对应的API格式
6. **流式返回**：支持流式响应，实时返回生成内容

```
┌─────────────┐      ┌──────────────────┐      ┌─────────────┐
│    客户端    │─────>│ Antigravity      │─────>│ Antigravity │
│             │      │ tools            │            API     │
└─────────────┘      └──────────────────┘      └─────────────┘
                              │
                              ├─ 账户 1 (OAuth)
                              ├─ 账户 2 (OAuth)
                              └─ 账户 3 (OAuth)
```

## Antigravity tools 高级功能

### 账户管理

- **自动切换**：配额用完自动切换到下一个账户
- **手动切换**：可以手动选择使用特定账户
- **账户状态**：实时显示每个账户的配额使用情况
- **批量导入**：支持批量添加多个账户

### 配置备份

- **自动备份**：定期自动备份配置和进度
- **手动备份**：可以手动创建备份点
- **恢复功能**：出现问题时可以快速恢复到之前的状态

### 日志查看

在应用中可以查看详细的请求日志，方便排查问题：
- 请求时间
- 使用的账户
- 请求的模型
- 响应状态
- 错误信息

## 适用场景

- 🎓 学生和个人开发者
- 🔬 AI 技术探索和实验
- 🚀 副项目和原型开发
- 📚 学习 AI 辅助编程
- 💡 小团队协作开发

## 🙏 致谢

感谢以下开源项目的支持：

-[**Antigravity tools**](https://github.com/lbjlaq/Antigravity-Manager)

-[**cherry studio**](https://www.cherry-ai.com)