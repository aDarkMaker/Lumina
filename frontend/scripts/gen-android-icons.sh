#!/usr/bin/env bash
# 将 src/assets/icons/icon.png 按 Android 各密度缩放并写入 res/mipmap-*
# 图标按 66% 安全区缩放后居中到目标尺寸，适配自适应图标裁剪（仅用 macOS sips）
# 需在 frontend 目录下执行

set -e
SRC="${1:-src/assets/icons/icon.png}"
if [[ ! -f "$SRC" ]]; then
  echo "Usage: $0 [icon.png path]"
  echo "  Default: src/assets/icons/icon.png"
  exit 1
fi

TMP=$(mktemp -t lumina_icon).png
trap 'rm -f "$TMP"' EXIT

for size in 48 72 96 144 192; do
  case $size in
    48)  d=mipmap-mdpi ;;
    72)  d=mipmap-hdpi ;;
    96)  d=mipmap-xhdpi ;;
    144) d=mipmap-xxhdpi ;;
    192) d=mipmap-xxxhdpi ;;
  esac
  out="android/app/src/main/res/$d"
  # 安全区 66/108，图标先缩放到安全区尺寸再 pad 到目标尺寸（居中）
  safe=$(( size * 66 / 108 ))
  [ "$safe" -lt 1 ] && safe=1
  sips -z $safe $safe "$SRC" --out "$TMP"
  sips --padToHeightWidth $size $size --padColor FFFFFF "$TMP" --out "$out/ic_launcher.png"
  cp "$out/ic_launcher.png" "$out/ic_launcher_round.png"
  cp "$out/ic_launcher.png" "$out/ic_launcher_foreground.png" 2>/dev/null || true
done
echo "Android icons generated from $SRC (scaled to safe zone then centered)"
