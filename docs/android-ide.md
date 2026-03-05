# Android / Gradle 与 IDE 说明

## 推荐打开方式

- **只打开一个 Gradle 根目录**：用 Cursor/VS Code 打开 **`Lumina/frontend/android`** 作为项目根，再编辑代码。  
  不要用 **`Lumina`** 或 **`Lumina/frontend`** 作为唯一根并依赖 IDE 自动识别多个 Gradle 项目，否则容易出现「Workspace already contains a project with name capacitor-android」或重复根项目。

## 若出现以下提示

1. **「Workspace already contains a project with name capacitor-android」**  
   - 工作区里被识别到多个 Gradle 根，导致同一项目重复导入。  
   - **处理**：关闭当前工作区，只打开 **`frontend/android`** 这一层文件夹，再重新加载窗口（或执行 Java: Clean Java Language Server Workspace）。

2. **「The specified project directory .../Lumina/mobile/android does not exist」**  
   - 本地曾把 Android 插件放在 `mobile/android`，现已改为 **`mobile/app-scanner`**，但 IDE 仍缓存了旧路径。  
   - **处理**：  
     - 若当前根是 **`frontend/android`**：在 Cursor 里执行 **Java: Clean Java Language Server Workspace**，然后重新打开 `frontend/android`。  
     - 若当前根是 **`Lumina`**：本仓库已在 `.vscode/settings.json` 中设置 `java.import.gradle.projectPath: "frontend/android"`，只从该路径导入 Gradle；若仍报错，可先关闭 `Lumina`，只打开 **`frontend/android`** 再试。

3. **「Invalid Gradle project configuration file: .settings/org.eclipse.buildship.core.prefs」**  
   - 这是 IDE 在 workspaceStorage 里的 Eclipse Buildship 配置损坏或过期。  
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
