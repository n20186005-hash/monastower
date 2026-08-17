# Status validasi

## Pemeriksaan statis yang sudah dilakukan

- `package.json` menggunakan versi tepat tanpa `latest`, `*`, `^`, atau `~` pada dependency langsung.
- Importer `.` pada `pnpm-lock.yaml` cocok dengan seluruh dependency langsung di `package.json`.
- `packageManager` dikunci ke pnpm `9.15.9`.
- `.npmrc` berisi `only-built-dependencies=esbuild`.
- Node.js dikunci ke `24.19.0` di `engines` dan `.node-version`.
- Proyek tidak memiliki `pnpm-workspace.yaml`.
- Sumber proyek tidak mengandung `example.com`, `localhost`, atau `chrome-extension://`.
- Google Maps embed menggunakan locale Bahasa Indonesia (`id`).
- Wrangler dikonfigurasi sebagai Workers Static Assets dengan `assets.directory` menunjuk `./dist` dan tanpa `main`.

## Gate lingkungan yang belum dapat dieksekusi di sandbox ini

Perintah bersih berikut sudah dicoba, tetapi Corepack tidak dapat mengunduh pnpm karena DNS sandbox gagal me-resolve `registry.npmjs.org` (`EAI_AGAIN`):

```bash
rm -rf node_modules
CI=1 corepack pnpm install --frozen-lockfile
```

Karena instalasi tidak pernah dapat dimulai, `pnpm check`, `pnpm build`, dan grep terhadap `dist/` hasil build tidak dapat diklaim sudah lolos di sandbox ini.

Jalankan `pnpm verify` pada runner dengan akses npm registry untuk mengeksekusi seluruh gate secara berurutan dan berhenti pada error pertama.
