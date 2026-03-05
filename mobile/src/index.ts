import { registerPlugin } from "@capacitor/core";

export interface NativeAppInfo {
  id: string;
  packageName: string;
  name: string;
  version?: string;
  installTime?: number;
  icon?: string;
}

export interface AppScannerPlugin {
  getInstalledApps(): Promise<{ apps: NativeAppInfo[] }>;
}

export const AppScanner = registerPlugin<AppScannerPlugin>("AppScanner");
