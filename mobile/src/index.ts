import { registerPlugin } from "@capacitor/core";

export interface NativeAppInfo {
  id: string;
  packageName: string;
  name: string;
  version?: string;
  installTime?: number;
  icon?: string;
}

/** 单条权限：来自系统，含授予状态（系统允许时） */
export interface NativeAppPermission {
  name: string;
  label: string;
  protectionLevel: "normal" | "dangerous" | "signature" | "unknown";
  /** 仅当系统返回时存在；对其它应用可能为 undefined */
  granted?: boolean;
}

export interface DeviceRiskApp {
  packageName: string;
  name: string;
  riskCount: number;
  icon?: string;
}

export interface AppScannerPlugin {
  getInstalledApps(): Promise<{ apps: NativeAppInfo[] }>;
  launchApp(options: { packageName: string }): Promise<void>;
  openUninstallScreen(options: { packageName: string }): Promise<void>;
  getAppPermissions(options: { packageName: string }): Promise<{
    permissions: NativeAppPermission[];
  }>;
  openAppInfo(options: { packageName: string }): Promise<void>;
  getDeviceRiskSummary(): Promise<{
    totalRiskPermissionCount: number;
    riskApps: DeviceRiskApp[];
  }>;
}

export const AppScanner = registerPlugin<AppScannerPlugin>("AppScanner");
