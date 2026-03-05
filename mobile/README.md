# Lumina Mobile

移动端原生能力实现，供烛照（Lumina）在 Android 上扫描本机已安装应用。

## 结构

- **app-scanner/**：Capacitor 插件 `AppScanner`，通过 `PackageManager.getInstalledApplications` 获取已安装应用（包名、名称、版本、安装时间、图标 base64）。
- **src/**：TypeScript 桥接，对外暴露 `AppScanner.getInstalledApps()`，供前端在原生环境下调用。

## 集成方式

- 前端通过 `"@lumina/mobile": "file:../mobile"` 依赖本模块。
- Android 工程在 `frontend/android/settings.gradle` 中 include 本模块：`project(':mobile').projectDir = new File(settingsDir, '../../mobile/app-scanner')`，并在 `app/build.gradle` 中 `implementation project(':mobile')`。
- `MainActivity` 中注册：`registerPlugin(AppScannerPlugin.class)`。

## Android 11+

在应用主 `AndroidManifest.xml` 中已声明 `<queries>`（LAUNCHER 意图），以便在 Android 11+ 上获取到带启动图标的已安装应用列表。
