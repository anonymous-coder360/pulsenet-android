#!/bin/bash
set -e

echo "📦 Dependencies check..."
npm install --save-dev @capacitor/cli @capacitor/core @capacitor/android

echo "🧹 Rebuilding Android folder..."
rm -rf android
npx @capacitor/cli add android
npx @capacitor/cli sync android

echo "🔨 Building APK..."
cd android
chmod +x gradlew
./gradlew assembleDebug

echo "🎉 APK Ready at: $(pwd)/app/build/outputs/apk/debug/app-debug.apk"
