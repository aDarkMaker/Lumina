package com.lumina.appscanner;

import android.content.Intent;
import android.content.pm.ApplicationInfo;
import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;
import android.content.pm.PermissionInfo;
import android.net.Uri;
import android.os.Build;
import android.provider.Settings;
import android.graphics.Bitmap;
import android.graphics.Canvas;
import android.graphics.drawable.BitmapDrawable;
import android.graphics.drawable.Drawable;
import android.util.Base64;
import android.util.Log;

import com.getcapacitor.JSArray;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

import java.io.ByteArrayOutputStream;
import java.util.List;

/**
 * 扫描本机已安装应用列表，供前端权限/隐私分析使用。
 */
@CapacitorPlugin(name = "AppScanner")
public class AppScannerPlugin extends Plugin {

    private static final String TAG = "AppScannerPlugin";

    @PluginMethod
    public void getInstalledApps(PluginCall call) {
        PluginCall callRef = call;
        new Thread(() -> {
            try {
                PackageManager pm = getContext().getPackageManager();
                List<ApplicationInfo> apps = pm.getInstalledApplications(PackageManager.GET_META_DATA);
                String selfPackage = getContext().getPackageName();

                JSArray result = new JSArray();
                for (ApplicationInfo info : apps) {
                    if (info.packageName.equals(selfPackage)) continue;
                    if (pm.getLaunchIntentForPackage(info.packageName) == null) continue;

                    JSObject item = new JSObject();
                    item.put("id", info.packageName);
                    item.put("packageName", info.packageName);
                    CharSequence label = info.loadLabel(pm);
                    item.put("name", label != null ? label.toString() : info.packageName);

                    try {
                        PackageInfo pkgInfo = pm.getPackageInfo(info.packageName, 0);
                        if (pkgInfo.versionName != null) {
                            item.put("version", pkgInfo.versionName);
                        }
                        item.put("installTime", pkgInfo.firstInstallTime);
                    } catch (PackageManager.NameNotFoundException e) {
                        // skip version/installTime
                    }

                    String iconBase64 = drawableToBase64(info.loadIcon(pm));
                    if (iconBase64 != null) {
                        item.put("icon", "data:image/png;base64," + iconBase64);
                    }

                    result.put(item);
                }
                JSObject ret = new JSObject();
                ret.put("apps", result);
                JSObject finalRet = ret;
                getActivity().runOnUiThread(() -> callRef.resolve(finalRet));
            } catch (Exception e) {
                Log.e(TAG, "getInstalledApps failed", e);
                getActivity().runOnUiThread(() -> callRef.reject("GET_INSTALLED_APPS_FAILED", e));
            }
        }).start();
    }

    @PluginMethod
    public void launchApp(PluginCall call) {
        String packageName = call.getString("packageName");
        if (packageName == null || packageName.isEmpty()) {
            call.reject("MISSING_PACKAGE_NAME");
            return;
        }
        try {
            PackageManager pm = getContext().getPackageManager();
            Intent launchIntent = pm.getLaunchIntentForPackage(packageName);
            if (launchIntent == null) {
                call.reject("APP_NOT_LAUNCHABLE");
                return;
            }
            getContext().startActivity(launchIntent);
            call.resolve();
        } catch (Exception e) {
            Log.e(TAG, "launchApp failed", e);
            call.reject("LAUNCH_FAILED", e);
        }
    }

    @PluginMethod
    public void openUninstallScreen(PluginCall call) {
        String packageName = call.getString("packageName");
        if (packageName == null || packageName.isEmpty()) {
            call.reject("MISSING_PACKAGE_NAME");
            return;
        }
        try {
            Intent intent = new Intent(Intent.ACTION_DELETE);
            intent.setData(Uri.parse("package:" + packageName));
            if (getActivity() != null) {
                getActivity().startActivity(intent);
            } else {
                intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                getContext().startActivity(intent);
            }
            call.resolve();
        } catch (Exception e) {
            Log.e(TAG, "openUninstallScreen failed", e);
            call.reject("OPEN_UNINSTALL_FAILED", e);
        }
    }

    /** 获取指定应用声明的权限及授予状态（系统允许时）。 */
    @PluginMethod
    public void getAppPermissions(PluginCall call) {
        String packageName = call.getString("packageName");
        if (packageName == null || packageName.isEmpty()) {
            call.reject("MISSING_PACKAGE_NAME");
            return;
        }
        PluginCall callRef = call;
        new Thread(() -> {
            try {
                PackageManager pm = getContext().getPackageManager();
                int flags = PackageManager.GET_PERMISSIONS;
                PackageInfo pkgInfo = pm.getPackageInfo(packageName, flags);

                String[] requested = pkgInfo.requestedPermissions;
                int[] requestedFlags = (Build.VERSION.SDK_INT >= Build.VERSION_CODES.P)
                    ? pkgInfo.requestedPermissionsFlags
                    : null;

                JSArray list = new JSArray();
                if (requested != null) {
                    for (int i = 0; i < requested.length; i++) {
                        String permName = requested[i];
                        JSObject item = new JSObject();
                        item.put("name", permName);

                        String label = permName;
                        String protectionLevel = "unknown";
                        try {
                            PermissionInfo permInfo = pm.getPermissionInfo(permName, 0);
                            if (permInfo != null) {
                                CharSequence cs = permInfo.loadLabel(pm);
                                if (cs != null) label = cs.toString();
                                int level = permInfo.protectionLevel & 0x0F;
                                if (level == PermissionInfo.PROTECTION_DANGEROUS) {
                                    protectionLevel = "dangerous";
                                } else if (level == PermissionInfo.PROTECTION_NORMAL) {
                                    protectionLevel = "normal";
                                } else if (level == PermissionInfo.PROTECTION_SIGNATURE
                                    || level == PermissionInfo.PROTECTION_SIGNATURE_OR_SYSTEM) {
                                    protectionLevel = "signature";
                                }
                            }
                        } catch (PackageManager.NameNotFoundException ignored) {
                            // use permName as label, protectionLevel stays "unknown"
                        }
                        item.put("label", label);
                        item.put("protectionLevel", protectionLevel);

                        Boolean granted = null;
                        if (requestedFlags != null && i < requestedFlags.length) {
                            int f = requestedFlags[i];
                            granted = (f & PackageInfo.REQUESTED_PERMISSION_GRANTED) != 0;
                        }
                        if (granted != null) {
                            item.put("granted", granted);
                        }
                        list.put(item);
                    }
                }

                JSObject ret = new JSObject();
                ret.put("permissions", list);
                getActivity().runOnUiThread(() -> callRef.resolve(ret));
            } catch (PackageManager.NameNotFoundException e) {
                getActivity().runOnUiThread(() -> callRef.reject("PACKAGE_NOT_FOUND", e));
            } catch (Exception e) {
                Log.e(TAG, "getAppPermissions failed", e);
                getActivity().runOnUiThread(() -> callRef.reject("GET_APP_PERMISSIONS_FAILED", e));
            }
        }).start();
    }

    /** 全机统计：高风险权限总数 + 各应用风险权限数量（用于主页数字与列表）。 */
    @PluginMethod
    public void getDeviceRiskSummary(PluginCall call) {
        PluginCall callRef = call;
        new Thread(() -> {
            try {
                PackageManager pm = getContext().getPackageManager();
                List<ApplicationInfo> apps = pm.getInstalledApplications(PackageManager.GET_META_DATA);
                String selfPackage = getContext().getPackageName();

                int totalRiskCount = 0;
                java.util.ArrayList<int[]> riskCountByIndex = new java.util.ArrayList<>(); // [index, riskCount]

                for (int idx = 0; idx < apps.size(); idx++) {
                    ApplicationInfo info = apps.get(idx);
                    if (info.packageName.equals(selfPackage)) continue;
                    if (pm.getLaunchIntentForPackage(info.packageName) == null) continue;

                    int count = countUniqueDangerousPermissionTypes(pm, info.packageName);
                    if (count > 0) {
                        totalRiskCount += count;
                        riskCountByIndex.add(new int[] { idx, count });
                    }
                }

                // 按风险数量降序，取前 15 个
                riskCountByIndex.sort((a, b) -> Integer.compare(b[1], a[1]));
                int limit = Math.min(15, riskCountByIndex.size());

                JSArray riskApps = new JSArray();
                for (int i = 0; i < limit; i++) {
                    int[] pair = riskCountByIndex.get(i);
                    ApplicationInfo info = apps.get(pair[0]);
                    JSObject item = new JSObject();
                    item.put("packageName", info.packageName);
                    CharSequence label = info.loadLabel(pm);
                    item.put("name", label != null ? label.toString() : info.packageName);
                    item.put("riskCount", pair[1]);
                    String iconBase64 = drawableToBase64(info.loadIcon(pm));
                    if (iconBase64 != null) {
                        item.put("icon", "data:image/png;base64," + iconBase64);
                    }
                    riskApps.put(item);
                }

                JSObject ret = new JSObject();
                ret.put("totalRiskPermissionCount", totalRiskCount);
                ret.put("riskApps", riskApps);
                getActivity().runOnUiThread(() -> callRef.resolve(ret));
            } catch (Exception e) {
                Log.e(TAG, "getDeviceRiskSummary failed", e);
                getActivity().runOnUiThread(() -> callRef.reject("GET_DEVICE_RISK_SUMMARY_FAILED", e));
            }
        }).start();
    }

    /** 与前端一致的短名称 key，用于合并同名高危权限。 */
    private static String permissionShortKey(String permName) {
        if (permName == null) return "other";
        String n = permName.toUpperCase();
        if (n.contains("ACCESS_FINE_LOCATION") || n.contains("ACCESS_COARSE_LOCATION")) return "位置";
        if (n.contains("CAMERA")) return "相机";
        if (n.contains("RECORD_AUDIO") || n.contains("MICROPHONE")) return "麦克风";
        if (n.contains("READ_EXTERNAL") || n.contains("WRITE_EXTERNAL") || n.contains("STORAGE") || n.contains("MANAGE_EXTERNAL")) return "存储";
        if (n.contains("READ_CONTACTS") || n.contains("WRITE_CONTACTS")) return "通讯录";
        if (n.contains("READ_CALENDAR") || n.contains("WRITE_CALENDAR")) return "日历";
        if (n.contains("READ_SMS") || n.contains("SEND_SMS") || n.contains("RECEIVE_SMS")) return "短信";
        if (n.contains("READ_PHONE_STATE") || n.contains("CALL_PHONE") || n.contains("READ_CALL_LOG") || n.contains("WRITE_CALL_LOG")) return "电话";
        if (n.contains("BODY_SENSORS") || n.contains("ACTIVITY_RECOGNITION")) return "传感器";
        if (n.contains("POST_NOTIFICATIONS")) return "通知";
        if (n.contains("BLUETOOTH") || n.contains("BLUETOOTH_CONNECT")) return "蓝牙";
        if (n.contains("NFC")) return "NFC";
        if (n.contains("READ_MEDIA")) return "媒体";
        return permName;
    }

    /** 统计应用内「不重复类型」的高危权限数量（同名合并）。 */
    private static int countUniqueDangerousPermissionTypes(PackageManager pm, String packageName) {
        try {
            PackageInfo pkgInfo = pm.getPackageInfo(packageName, PackageManager.GET_PERMISSIONS);
            String[] requested = pkgInfo.requestedPermissions;
            if (requested == null) return 0;
            java.util.Set<String> keys = new java.util.HashSet<>();
            for (String permName : requested) {
                try {
                    PermissionInfo permInfo = pm.getPermissionInfo(permName, 0);
                    if (permInfo != null && (permInfo.protectionLevel & 0x0F) == PermissionInfo.PROTECTION_DANGEROUS) {
                        keys.add(permissionShortKey(permName));
                    }
                } catch (PackageManager.NameNotFoundException ignored) {
                    // skip
                }
            }
            return keys.size();
        } catch (PackageManager.NameNotFoundException e) {
            return 0;
        }
    }

    /** 打开系统「应用信息」页，便于用户查看/管理该应用的权限。 */
    @PluginMethod
    public void openAppInfo(PluginCall call) {
        String packageName = call.getString("packageName");
        if (packageName == null || packageName.isEmpty()) {
            call.reject("MISSING_PACKAGE_NAME");
            return;
        }
        try {
            Intent intent = new Intent(Settings.ACTION_APPLICATION_DETAILS_SETTINGS);
            intent.setData(Uri.parse("package:" + packageName));
            intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            getContext().startActivity(intent);
            call.resolve();
        } catch (Exception e) {
            Log.e(TAG, "openAppInfo failed", e);
            call.reject("OPEN_APP_INFO_FAILED", e);
        }
    }

    private static String drawableToBase64(Drawable drawable) {
        if (drawable == null) return null;
        try {
            Bitmap bitmap;
            if (drawable instanceof BitmapDrawable) {
                bitmap = ((BitmapDrawable) drawable).getBitmap();
            } else {
                int w = Math.max(1, drawable.getIntrinsicWidth());
                int h = Math.max(1, drawable.getIntrinsicHeight());
                bitmap = Bitmap.createBitmap(w, h, Bitmap.Config.ARGB_8888);
                Canvas canvas = new Canvas(bitmap);
                drawable.setBounds(0, 0, canvas.getWidth(), canvas.getHeight());
                drawable.draw(canvas);
            }
            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            bitmap.compress(Bitmap.CompressFormat.PNG, 85, baos);
            return Base64.encodeToString(baos.toByteArray(), Base64.NO_WRAP);
        } catch (Exception e) {
            return null;
        }
    }
}
