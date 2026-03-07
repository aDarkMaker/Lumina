#!/usr/bin/env bash
# 将 src/assets/icons/icon.png 按 Android 各密度缩放并写入 res/mipmap-*
# 需在 frontend 目录下执行，macOS 需有 sips

set -e
SRC="${1:-src/assets/icons/icon.png}"
if [[ ! -f "$SRC" ]]; then
  echo "Usage: $0 [icon.png path]"
  echo "  Default: src/assets/icons/icon.png"
  exit 1
fi

for size in 48 72 96 144 192; do
  case $size in
    48)  d=mipmap-mdpi ;;
    72)  d=mipmap-hdpi ;;
    96)  d=mipmap-xhdpi ;;
    144) d=mipmap-xxhdpi ;;
    192) d=mipmap-xxxhdpi ;;
  esac
  out="android/app/src/main/res/$d"
  sips -z $size $size "$SRC" --out "$out/ic_launcher.png"
  cp "$out/ic_launcher.png" "$out/ic_launcher_round.png"
  cp "$out/ic_launcher.png" "$out/ic_launcher_foreground.png" 2>/dev/null || true
done
echo "Android icons generated from $SRC"
