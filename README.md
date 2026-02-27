# 烛照 / Lumina

面向安卓优先、后续支持 iOS 的「应用权限与隐私条款风险分析」工具。

应用在本地分析手机上已安装应用的权限使用情况与隐私条款内容，给出高危/中等/常规等风险分级，并提供直观的应用详情界面。

## 总体结构

仓库采用 monorepo 形式，主要包含：

- `frontend/`：Web 前端（React + TS + Bun），用于规则管理后台和交互原型。
- `mobile/`：移动端 App（计划使用 React Native + TypeScript），安卓先行，后续支持 iOS。
- `backend/`：后端服务（Go），负责规则配置、版本发布、可选的匿名统计与账号体系。

## 技术栈

### Frontend (`frontend/`)

- React + TypeScript
- Bun
- Cspell + Prettier + Eslint

### Mobile (`mobile/`)

- React Native + TypeScript
- Android 原生：Kotlin（用于权限扫描等 Native Module）
- iOS 原生：Swift（后续引入）

### Backend (`backend/`)

- Go
- Web 框架：Gin（RESTful API）
- 数据库：PostgreSQL（或开发期 SQLite）

## 核心模块概览

- **本地扫描模块（移动端）**：读取已安装应用列表及权限信息（不需要 Root），并在本地生成权限画像。
- **隐私条款本地分析模块**：在本地解析用户粘贴或分享过来的隐私条款文本，通过规则+关键词匹配做风险判定。
- **本地风险规则引擎**：将「权限组合 + 隐私条款分析」映射为 High/Medium/Normal 等风险等级与解释文案。
- **规则中心（Go Backend + Web 管理台）**：维护和发布不同地区/系统版本下的规则集，移动端只拉取规则，不上传敏感原始数据。

更多详细设计请参考：

- `backend/README.md`：后端模块与 API 规划。
- `docs/rules-engine-spec.md`：本地规则引擎数据结构与评分逻辑。
- `docs/ROADMAP.md`：开发里程碑与路线图。