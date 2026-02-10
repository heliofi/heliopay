#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$ROOT_DIR"

TARGET_PACKAGE="${INPUT_PACKAGE:-}"
INPUT_VERSION="${INPUT_VERSION:-}"
BRANCH_NAME="${BRANCH_NAME:-${GITHUB_REF_NAME:-$(git rev-parse --abbrev-ref HEAD)}}"
GIT_SHA="$(git rev-parse --short HEAD)"

case "$TARGET_PACKAGE" in
  evm-adapter)
    NPM_PACKAGE="@heliofi/evm-adapter"
    PKG_DIR="packages/evm-adapter"
    ;;
  solana-adapter)
    NPM_PACKAGE="@heliofi/solana-adapter"
    PKG_DIR="packages/solana-adapter"
    ;;
  solana-nft-adapter)
    NPM_PACKAGE="@heliofi/solana-nft-adapter"
    PKG_DIR="packages/solana-nft-adapter"
    ;;
  *)
    echo ""
    echo "❌🛑 ERROR: Package is required (choose one of: evm-adapter, solana-adapter, solana-nft-adapter)"
    echo ""
    exit 1
    ;;
esac

is_semver() {
  [[ "$1" =~ ^[0-9]+\.[0-9]+\.[0-9]+([-.][0-9A-Za-z.-]+)?$ ]]
}

if [[ ! -f "${PKG_DIR}/package.json" ]]; then
  echo ""
  echo "❌📁 ERROR: Missing package.json at ${PKG_DIR}/package.json"
  echo ""
  exit 1
fi

CURRENT_VERSION="$(node -p "require('./${PKG_DIR}/package.json').version")"
BASE_VERSION="${CURRENT_VERSION%%-*}"
IFS='.' read -r MAJOR MINOR PATCH <<< "$BASE_VERSION"

if [[ -z "${MAJOR:-}" || -z "${MINOR:-}" || -z "${PATCH:-}" ]]; then
  echo ""
  echo "❌🔢 ERROR: Invalid current version: $CURRENT_VERSION"
  echo "   Expected semver like 1.2.3"
  echo ""
  exit 1
fi

if [[ "$BRANCH_NAME" == "main" ]]; then
  NPM_DIST_TAG="latest"
  if [[ -n "${INPUT_VERSION}" ]]; then
    if ! is_semver "${INPUT_VERSION}"; then
      echo ""
      echo "❌🛑 ERROR: Invalid version '${INPUT_VERSION}' (expected semver like 1.2.3)"
      echo ""
      exit 1
    fi
    if [[ "${INPUT_VERSION}" == *-* ]]; then
      echo ""
      echo "❌🛑 ERROR: main branch publishes stable versions only (no prerelease). Got: '${INPUT_VERSION}'"
      echo ""
      exit 1
    fi
    FINAL_VERSION="${INPUT_VERSION}"
  else
    FINAL_VERSION="${MAJOR}.${MINOR}.$((PATCH + 1))"
  fi
else
  NPM_DIST_TAG="alpha"
  if [[ -n "${INPUT_VERSION}" ]]; then
    if ! is_semver "${INPUT_VERSION}"; then
      echo ""
      echo "❌🛑 ERROR: Invalid version '${INPUT_VERSION}' (expected semver like 1.2.3)"
      echo ""
      exit 1
    fi

    # If they provided a stable version like 1.2.3, turn it into an alpha prerelease.
    if [[ "${INPUT_VERSION}" == *-* ]]; then
      FINAL_VERSION="${INPUT_VERSION}"
    else
      FINAL_VERSION="${INPUT_VERSION}-alpha.$(date +%s).${GIT_SHA}"
    fi
  else
    FINAL_VERSION="${MAJOR}.${MINOR}.$((PATCH + 1))-alpha.$(date +%s).${GIT_SHA}"
  fi
fi

TAG_NAME="${NPM_PACKAGE}@${FINAL_VERSION}"
IS_PRERELEASE="false"
if [[ "$NPM_DIST_TAG" == "alpha" ]]; then
  IS_PRERELEASE="true"
fi

echo ""
echo "╔══════════════════════════════════════════"
echo "║              📋 Release Summary"
echo "╠══════════════════════════════════════════"
echo "║  🌿 Branch:          $BRANCH_NAME"
echo "║  📦 Package:         $NPM_PACKAGE"
echo "║  📌 Current version: $CURRENT_VERSION"
echo "║  🆕 New version:     $FINAL_VERSION"
echo "║  🏷️  npm dist-tag:    $NPM_DIST_TAG"
echo "║  🏷️  git tag:        $TAG_NAME"
echo "╚══════════════════════════════════════════"
echo ""

echo "🔧 Configuring git identity for CI commits..."
git config user.name "github-actions[bot]"
git config user.email "github-actions[bot]@users.noreply.github.com"

echo "🔢 Updating version via Lerna..."
LERNA_VERSION_ARGS=(
  version "$FINAL_VERSION"
  --yes
  --force-publish "$NPM_PACKAGE"
  --ignore-changes "**"
  --no-private
  --no-push
  --message "chore(release): publish %s"
)
npx lerna "${LERNA_VERSION_ARGS[@]}"

NEW_VERSION="$(node -p "require('./${PKG_DIR}/package.json').version")"
echo ""
echo "🏷️  Tag created:     $TAG_NAME"
if ! git show-ref --tags --verify --quiet "refs/tags/$TAG_NAME"; then
  echo ""
  echo "❌🛑 ERROR: Expected git tag was not created: $TAG_NAME"
  exit 1
fi
if [[ "$NEW_VERSION" != "$FINAL_VERSION" ]]; then
  echo ""
  echo "❌🛑 ERROR: Version mismatch after lerna version"
  echo "   expected: $FINAL_VERSION"
  echo "   actual:   $NEW_VERSION"
  exit 1
fi

echo "🔨 Building target package..."
yarn workspace "$NPM_PACKAGE" run build

echo "🚀 Publishing to npm (dist-tag: $NPM_DIST_TAG)..."

cd "$PKG_DIR"

npm publish \
  --tag "$NPM_DIST_TAG" \
  --access public \
  --provenance \
  --registry "https://registry.npmjs.org"

if [[ -n "${GITHUB_OUTPUT:-}" ]]; then
  {
    echo "tag=$TAG_NAME"
    echo "version=$FINAL_VERSION"
    echo "npm_package=$NPM_PACKAGE"
    echo "dist_tag=$NPM_DIST_TAG"
    echo "prerelease=$IS_PRERELEASE"
  } >> "$GITHUB_OUTPUT"
fi

echo ""
echo "✅ Published $NPM_PACKAGE."
