#!/usr/bin/env bash
# Installs an APK on the running emulator, launches it and prints crash info + on-screen text.
APK="$1"; TAG="$2"
PKG=com.taskin.kpsshap
adb wait-for-device
adb install -r "$APK" || exit 1
adb logcat -c
adb shell am start -W -n $PKG/.MainActivity
sleep 20
echo "===== [$TAG] crash buffer ====="
adb logcat -d -b crash
echo "===== [$TAG] AndroidRuntime / app log ====="
adb logcat -d | grep -E "AndroidRuntime|FATAL|$PKG|chromium|cr_" | tail -120
echo "===== [$TAG] process ====="
if adb shell pidof $PKG; then echo "[$TAG] APP RUNNING"; STATUS=0; else echo "::error::[$TAG] APP NOT RUNNING"; STATUS=1; fi
echo "===== [$TAG] on-screen text ====="
adb shell uiautomator dump /sdcard/ui.xml > /dev/null 2>&1
adb shell cat /sdcard/ui.xml | grep -oE '(text|content-desc)="[^"]+"' | head -40
mkdir -p screens
adb exec-out screencap -p > "screens/$TAG.png"
adb uninstall $PKG > /dev/null
exit $STATUS
