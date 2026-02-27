# 烛照 / Lumina Backend (Go)

本目录为「烛照 / Lumina」的 Go 后端服务代码，主要职责：

- 维护和发布权限/隐私合规规则集（规则中心）。
- 提供规则版本查询与下载接口，供移动端本地规则引擎更新。
- 可选：账号与多设备同步服务（仅同步规则偏好，不同步本地扫描结果）。
- 可选：匿名统计数据接收与聚合（严格脱敏）。

## 目录规划

（部分目录会在后续开发中逐步补齐）

- `cmd/lumina-api/`：主服务入口（`main.go`）。
- `internal/http/`：路由注册、HTTP Handler、Middleware。
- `internal/rules/`：规则集的增删改查、发布与版本管理。
- `internal/users/`：账号/授权相关逻辑（如需要登录）。
- `internal/stats/`：匿名统计聚合逻辑（可选特性）。
- `pkg/models/`：公共数据结构与数据库模型。
- `migrations/`：数据库迁移脚本。
- `config/`：配置文件（按环境划分，如 `dev.yaml` / `prod.yaml`）。

## 技术选型

- 语言：Go
- Web 框架：Gin
- 数据库：PostgreSQL（开发期可用 SQLite 替代）

后端与移动端/前端的交互主要集中在规则相关 API 上，具体接口设计见后续 `DESIGN.md`。