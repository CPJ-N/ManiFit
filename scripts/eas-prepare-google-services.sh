#!/usr/bin/env bash
set -euo pipefail

copy_service_file() {
  local env_name="$1"
  local target_path="$2"
  local fallback_path="$3"
  local label="$4"
  local source_path="${!env_name:-}"

  mkdir -p "$(dirname "$target_path")"

  if [[ -n "$source_path" && -f "$source_path" ]]; then
    cp "$source_path" "$target_path"
    echo "Prepared $label from \$$env_name at $target_path"
    return
  fi

  if [[ -f "$fallback_path" ]]; then
    cp "$fallback_path" "$target_path"
    echo "Prepared $label from $fallback_path at $target_path"
    return
  fi

  if [[ -f "$target_path" ]]; then
    echo "$label already exists at $target_path"
    return
  fi

  echo "Missing $label. Set $env_name as an EAS file environment variable or provide $fallback_path." >&2
  exit 1
}

case "${EAS_BUILD_PLATFORM:-all}" in
  ios)
    copy_service_file "GOOGLE_SERVICE_PLIST" "ios/ManiFit/GoogleService-Info.plist" "GoogleService-Info.plist" "GoogleService-Info.plist"
    ;;
  android)
    copy_service_file "GOOGLE_SERVICE_JSON" "android/app/google-services.json" "google-services.json" "google-services.json"
    ;;
  all)
    copy_service_file "GOOGLE_SERVICE_PLIST" "ios/ManiFit/GoogleService-Info.plist" "GoogleService-Info.plist" "GoogleService-Info.plist"
    copy_service_file "GOOGLE_SERVICE_JSON" "android/app/google-services.json" "google-services.json" "google-services.json"
    ;;
esac
