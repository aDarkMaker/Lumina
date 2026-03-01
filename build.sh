#!/bin/bash
set -e
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR/frontend"

if [ ! -d "android" ]; then
	echo "首次运行：添加 Android 平台…"
	bunx cap add android
fi

echo "Building changes in android..."
bun run build
bunx cap sync android
echo "Build done!"

echo "Test Now ? (y/n)"
read -r test
test=${test:-y}

if [ "$test" = "y" ]; then
	bunx cap run android
else
	echo "Done!"
fi
