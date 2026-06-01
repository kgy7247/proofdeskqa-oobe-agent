$ErrorActionPreference = "Stop"

Write-Host "Android QA probe"

$adb = Get-Command adb -ErrorAction SilentlyContinue
if (-not $adb) {
  Write-Host "adb not found. Install Android Platform Tools or add adb to PATH."
  exit 2
}

Write-Host "adb path: $($adb.Source)"
adb devices

Write-Host ""
Write-Host "Next steps when a target app is available:"
Write-Host "1. Build/install the APK or Gradle variant."
Write-Host "2. Resolve package activity with: adb shell cmd package resolve-activity --brief <package>"
Write-Host "3. Dump UI tree with: adb exec-out uiautomator dump /dev/tty"
Write-Host "4. Capture screenshot with: adb exec-out screencap -p > screen.png"
Write-Host "5. Save crash logs with: adb logcat -b crash -d > crash-logcat.txt"
