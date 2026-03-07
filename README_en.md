<div align="center">

  <img src="frontend/src/assets/icons/icon.png" width="88" alt="Lumina" style="border-radius: 20px; display: block; margin: 0 auto 0.75rem;" />

  # Lumina / 烛照

  <sub>App permissions & privacy policies — analyzed locally, risk at a glance.</sub>

  <br /><br />

  ![Platform](https://img.shields.io/badge/platform-Android-green?style=for-the-badge&logo=android)
  ![iOS](https://img.shields.io/badge/iOS-Planned-lightgrey?style=for-the-badge&logo=apple)
  ![React](https://img.shields.io/badge/React-18+-blue?style=for-the-badge&logo=react)
  ![Go](https://img.shields.io/badge/Go-Backend-00ADD8?style=for-the-badge&logo=go)

  <br /><br />

  **English** · [中文说明](README.md)

</div>

---

## 1. About

> Lumina (烛照) is an **Android-first, iOS later** tool for **app permission and privacy policy risk analysis**.</br>
> It analyzes installed apps’ permission usage and privacy policy content **on-device**, and assigns risk levels (High / Medium / Normal) with a clear app-detail UI.</br>
> Rules and versions are maintained by the backend and web admin; the mobile app **only fetches rules** and does **not** upload sensitive raw data.

- The tool is designed for local analysis to help users understand permission and privacy risks. Do not use it for any commercial or profit-making purpose.
- Suggestions and contributions are welcome via Issues or PRs.

**By using or contributing to this project, you acknowledge that you have read and understood the above.**

## 2. Quick Start

1. **Clone**: `git clone <repo-url>` and enter the `Lumina` directory.
2. **Frontend (rule admin)**: In `frontend/`, run `bun install` and `bun run dev`.
3. **Backend**: In `backend/`, follow `backend/README.md` to set up and run the service.
4. **Mobile**: In `mobile/`, follow the React Native setup to install deps and run (Android first).

## 3. Project Structure

- **`frontend/`** — Web UI (React + TypeScript + Bun): rule admin and interaction prototype.
- **`mobile/`** — Mobile app (React Native + TypeScript): Android first, iOS planned.
- **`backend/`** — Backend (Go + Gin): rule config, version releases, optional anonymous stats and account system.

## 4. Features

- **Local scan (mobile)**: Read installed app list and permission info (no Root), build permission profile on-device.
- **Privacy policy analysis (local)**: Parse pasted or shared policy text on-device; risk assessment via rules and keyword matching.
- **Local rule engine**: Map “permission combo + policy analysis” to High / Medium / Normal with explanatory text.
- **Rule center (Go backend + web admin)**: Maintain and publish rule sets by region/OS version; mobile only pulls rules, no sensitive data upload.

## 5. Tech Stack

| Module   | Stack |
|----------|--------|
| Frontend | React, TypeScript, Bun, Cspell, Prettier, ESLint |
| Mobile   | React Native, TypeScript; Android: Kotlin (e.g. permission scan); iOS: Swift (planned) |
| Backend  | Go, Gin, PostgreSQL (SQLite for development) |

## 6. Docs & Links

- **Backend**: [backend/README.md](backend/README.md) — modules and API outline.
- **Rule engine**: [docs/rules-engine-spec.md](docs/rules-engine-spec.md) — data structures and scoring logic.
- **Roadmap**: [docs/ROADMAP.md](docs/ROADMAP.md) — milestones and plans.
