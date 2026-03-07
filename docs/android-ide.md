# Android / Gradle 与 IDE 说明

## 推荐打开方式

- **只用一个 Gradle 根**：用 Cursor/VS Code 打开 **`Lumina/frontend/android`** 作为项目根再编辑，或打开 **`Lumina`** / **`APP`** 时依赖本仓库与上层 `.vscode` 的配置，让 IDE 只导入 **`frontend/android`** 这一处 Gradle 项目。  
- 不要依赖 IDE 自动识别多个 Gradle 根，否则容易出现「Workspace already contains a project with name capacitor-android」或「Plugin with id 'com.android.library' not found」（app-scanner 被当成独立根）。

## 已做的配置

- **Lumina/.vscode/settings.json**：`java.import.gradle.projectPath`: `"frontend/android"`，在只打开 Lumina 时仅导入该路径。
- **APP/.vscode/settings.json**（若工作区根是 APP）：`java.import.gradle.projectPath`: `"Lumina/frontend/android"`，仅导入 Lumina 的 Android 工程，不把 `mobile/app-scanner` 当根项目。
- **Lumina/mobile** 与 **Lumina/mobile/app-scanner** 下均有 `java.import.gradle.enabled: false`，避免被当作独立 Gradle 根。

## 若出现以下提示

1. **「Workspace already contains a project with name capacitor-android」**  
   - 工作区里被识别到多个 Gradle 根或同一项目被重复导入。  
   - **处理**：执行 **Java: Clean Java Language Server Workspace**，重载窗口；并确认当前工作区根（Lumina 或 APP）的 `.vscode/settings.json` 里已设置 `java.import.gradle.projectPath` 为 `frontend/android` 或 `Lumina/frontend/android`。仍不行则关闭当前工作区，只打开 **`Lumina/frontend/android`** 再试。

2. **「The specified project directory .../mobile/android does not exist」** 或 **「Plugin with id 'com.android.library' not found」（app-scanner）**  
   - IDE 仍把已删除的 `mobile/android` 或把 `mobile/app-scanner` 当作独立 Gradle 根。  
   - **处理**：执行 **Java: Clean Java Language Server Workspace**，重载窗口；确保工作区根（APP 或 Lumina）的 `.vscode` 里已配置 `java.import.gradle.projectPath`（见上文），这样只会导入 `frontend/android`，不会单独导入 app-scanner。

3. **「Invalid Gradle project configuration file: .settings/org.eclipse.buildship.core.prefs」**  
   - IDE 在 workspaceStorage 里的 Eclipse Buildship 配置损坏或过期。  
   - **处理**：执行 **Java: Clean Java Language Server Workspace**，或删除 Cursor 对该工作区的缓存后重新打开 **`frontend/android`**。

## 构建与运行

在终端中构建不依赖 IDE 配置，在仓库根目录执行即可：

```bash
cd /path/to/Lumina && bash build.sh
```

或只构建 Android：

```bash
cd frontend/android && ./gradlew :app:assembleDebug
```
