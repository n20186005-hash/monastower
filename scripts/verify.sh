#!/usr/bin/env bash
set -euo pipefail

rm -rf node_modules dist .astro
CI=1 corepack pnpm install --frozen-lockfile
pnpm check
pnpm build

if [[ -f pnpm-workspace.yaml ]]; then
  python - <<'PY'
from pathlib import Path
import yaml
p = Path('pnpm-workspace.yaml')
data = yaml.safe_load(p.read_text()) or {}
packages = data.get('packages')
if not packages or '.' not in packages:
    raise SystemExit('pnpm-workspace.yaml harus memiliki packages yang tidak kosong dan mencakup .')
PY
fi

if grep -RInE 'example\.com|localhost|chrome-extension://' dist; then
  echo 'Ditemukan placeholder/konten terlarang pada dist.' >&2
  exit 1
fi

if find dist -type f -name 'sitemap*.xml' -print -quit | grep -q .; then
  if grep -RIn '<lastmod>' dist/sitemap*.xml; then
    echo 'Sitemap tidak boleh berisi lastmod buatan.' >&2
    exit 1
  fi
fi

echo 'Verifikasi bersih selesai.'
