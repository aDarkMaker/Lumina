<div align="center">
  # 烛照 / Lumina

  ![Platform](https://img.shields.io/badge/platform-Android-green?style=for-the-badge&logo=android)
  ![iOS](https://img.shields.io/badge/iOS-计划中-lightgrey?style=for-the-badge&logo=apple)
  ![React](https://img.shields.io/badge/React-18+-blue?style=for-the-badge&logo=react)
  ![Go](https://img.shields.io/badge/Go-后端-00ADD8?style=for-the-badge&logo=go)

  **移动端应用权限与隐私政策风险分析工具**
  <br />

  [English](README_en.md) • **中文说明**
</div>

---

## 1. 项目简介

Lumina（烛照）是一款面向移动端的**应用权限与隐私政策风险分析**工具，当前以 Android 为主要支持平台，iOS 支持处于规划阶段。

本产品在**设备本地**完成已安装应用的权限使用情况与隐私政策文本的分析，并依据预设规则输出高 / 中 / 低等风险等级及说明，同时提供结构化应用详情展示。规则与版本由服务端及 Web 管理后台维护，移动端仅拉取规则配置，**不向服务端上传用户敏感原始数据**。

本工具仅供个人或合规场景下的权限与隐私风险认知使用，禁止用于任何商业或营利目的。欢迎通过 Issue 或 Pull Request 反馈问题与贡献代码。使用或参与本项目即视为同意上述约定。

## 2. 快速开始

1. **克隆仓库**：执行 `git clone <repo-url>`，并进入项目根目录 `Lumina`。
2. **前端（规则管理后台）**：进入 `frontend/`，执行 `bun install` 与 `bun run dev` 启动开发环境。
3. **后端**：进入 `backend/`，按 `backend/README.md` 中的说明配置运行环境并启动服务。
4. **移动端**：进入 `mobile/`，按 React Native 项目规范安装依赖并运行（当前以 Android 为主）。

## 3. 项目结构

- **`frontend/`**：Web 前端（React + TypeScript + Bun），用于规则管理后台及交互原型。
- **`mobile/`**：移动端应用（React Native + TypeScript），优先支持 Android，iOS 为规划中。
- **`backend/`**：后端服务（Go + Gin），负责规则配置、版本发布及可选的匿名统计与账号体系。

## 4. 功能概述

- **本地扫描模块（移动端）**：在无需 Root 的前提下，读取已安装应用列表及权限信息，于本地生成权限画像。
- **隐私政策本地分析**：在设备本地解析用户提供的隐私政策文本，基于规则与关键词匹配进行风险判定。
- **本地风险规则引擎**：将权限组合与隐私政策分析结果映射为 High / Medium / Normal 等风险等级及对应说明文案。
- **规则中心（后端 + Web 管理台）**：维护并发布按地区与系统版本划分的规则集；移动端仅拉取规则，不上传敏感原始数据。

## 5. 技术栈

| 模块 | 技术 |
|------|------|
| Frontend | React、TypeScript、Bun、Cspell、Prettier、ESLint |
| Mobile | React Native、TypeScript；Android：Kotlin（权限扫描等）；iOS：Swift（计划中） |
| Backend | Go、Gin、PostgreSQL（开发期可用 SQLite） |

## 6. 相关文档

- [backend/README.md](backend/README.md) — 后端模块与 API 说明
- [docs/rules-engine-spec.md](docs/rules-engine-spec.md) — 规则引擎数据结构与评分逻辑
- [docs/ROADMAP.md](docs/ROADMAP.md) — 开发路线图与里程碑
