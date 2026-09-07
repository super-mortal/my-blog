---
title: 'DeepSeek Harness 蓝皮书：我开源了一套 dsh 实战指南'
publishDate: 2026-09-06
description: '从第一个能验收的 Agent 到可复用的工作系统，我开源了一套 E-INK 风格的 DeepSeek Harness (dsh) 实战指南，6 种语言，一切皆插件'
slug: 'deepseek-harness-guide'
tags:
  - AI
  - OpenClaw
  - 开源项目
language: '中文'
category: 教程
---

> **一句话**：从 0 到 1 搭一套可复用 Agent 工作系统的开源实战指南 —— E-INK 视觉、6 种语言、一切皆插件，命令可复制、报错可复现，照着做就能跑通。

# DeepSeek Harness 蓝皮书

想搭一套能跑、能验收、还能复用的 Agent 工作系统，但翻了一圈 dsh 官方仓库只有 API 文档、没有一份完整的"从入门到生产"的实战教程？最近把折腾 [DeepSeek Harness](https://github.com/super-mortal/DeepSeekHarnessGuide)（简称 dsh）半年多踩的坑整理成了一份开源实战指南 —— **[DeepSeek Harness 蓝皮书](https://dsh.supermortal.top/)**（[GitHub 仓库](https://github.com/super-mortal/DeepSeekHarnessGuide)）。

![DeepSeek Harness 蓝皮书（dsh 实战指南）网站首页 Hero 区：标题「DeepSeek Harness 蓝皮书」+ 副标题「以真实任务为主线的 dsh 实战指南」，配 deepdrink 鲸鱼品牌 Logo，标语「everything is a plugin · Agent = Model + Harness」，统计 34 篇（30 章 + 4 附录）、6 个 PART 分段、120 张配图、7.5 万字总字数、3 天入门，并支持中/英/日/韩/西/葡 6 种语言与 E-INK 纸感 × DeepSeek 墨蓝主题](homepage.png)

## 这是什么

一份**以真实任务为主线**的 dsh 学习指南：从跑通第一个能验收的 Agent 开始，到搭出一套可复用的工作系统。它不是 API 文档的翻译，而是把"怎么用起来"这件事拆成了循序渐进的章节 —— 每一步的命令、截图、甚至报错，都是真实操作记录下来的，**照着做就能复现**。

视觉上做了一套 **E-INK 纸感 × DeepSeek 墨蓝** 主题：米白纸底、墨色文字、荧光黄标注，刻意把动效做到几乎为零，读起来更像一本纸书。支持中/英/日/韩/西/葡 **6 种语言**，内置了自研图片灯箱（点击放大、Ctrl+滚轮缩放、拖拽平移）。

## 这份指南适合谁

- 刚接触 dsh，想从"装上能跑"走到"搭一套工作系统"的开发者
- 用过一阵 dsh，但对插件树、消息流、调度、MCP 还没串起来的进阶用户
- 想给团队沉淀一套 Agent 工作流模板、而不是每次从零写脚本的负责人

## 讲些什么

全书按 PART 组织，从入门一路到生产环境：

- **PART 00-01 · 入门**：为什么是 Agent 的乐高时代；认识 dsh、安装、Web UI、headless 模式、模型配置与排错
- **PART 02-03 · 核心机制**：插件树、核心子系统与消息流、会话日志；工具与沙箱、MCP、子代理、Skill、调度、本地部署
- **PART 04 · 插件开发**：dsh 的精髓"一切皆插件" —— 从安装插件到编写插件再到发布插件，defineTool、Hooks、UI 一条龙
- **PART 05-06 · 实战与生产**：个人网站、PPT、视频三个实战场景；部署、安全、可观测性与上下文管理
- **附录**：术语表、命令速查、学习路径、面试题

每章遵循同一个模板：**本章目标 → 动手 → 分节实操 → 这一章你学到了什么**。实操章节还附赠"让 dsh 自己来：一句提示词"的玩法 —— 毕竟学 Agent 工具最好的方式，就是用 Agent 来干活。

## 怎么读

- **想跑起来**：直接看 PART 00-01，跟着命令敲一遍，30 分钟内能跑通第一个 Agent
- **想搞懂原理**：从 PART 02 开始读，重点看插件树、消息流、调度三块
- **想自己写插件**：直奔 PART 04，把 defineTool / Hooks / UI 三件套跑通一遍就能上手
- **要上生产**：PART 05-06 看部署、安全、可观测性，附录有命令速查和面试题

## 写在最后

如果你也在用 dsh，或者对 Agent 工作流感兴趣，可以直接在仓库按 PART 目录阅读。觉得有用的话，点个 Star 就是最大的鼓励 ⭐

- 在线阅读：**[dsh.supermortal.top](https://dsh.supermortal.top/)**
- 仓库地址：**[super-mortal/DeepSeekHarnessGuide](https://github.com/super-mortal/DeepSeekHarnessGuide)**
