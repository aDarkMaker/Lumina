package com.lumina.appscanner;

import android.content.pm.ApplicationInfo;
import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;
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
