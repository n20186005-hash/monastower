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

## Gate lingkungan

`corepack pnpm install` tidak dapat dipakai di sandbox pengiriman awal karena DNS gagal me-resolve `registry.npmjs.org` (`EAI_AGAIN`). Gunakan pemanggilan pnpm langsung dengan Node 24.19.0:

```bash
node node_modules/astro/bin/astro.mjs build
CI=1 node node_modules/astro/bin/astro.mjs check
```

Hindari `pnpm check` bila pnpm menampilkan prompt interaktif terkait direktori modules.

## Hasil build & check yang sudah dieksekusi

Dengan Node `24.19.0` dan pnpm `9.15.9` (`--config.node-linker=hoisted`):

- `astro build` → 9 halaman statik + `dist/sitemap-index.xml`, tanpa error.
- `astro check` → **0 error, 0 warning**, 8 hint (seluruhnya hint `is:inline` pada script GA4 dan JSON-LD).

Pemeriksaan isi `dist/` yang sudah dikonfirmasi:

- canonical absolut pada setiap halaman, misalnya `https://monastower.com/` dan `https://monastower.com/tiket/`.
- `og:url`, `og:image` absolut, serta `og:site_name` terisi.
- Beranda memuat `TouristAttraction`, `LocalBusiness`, dan `FAQPage` dengan pertanyaan yang benar-benar tampil di halaman.
- `/tiket/` memuat `Article`, `BreadcrumbList`, dan `FAQPage`, lengkap dengan breadcrumb dan blok FAQ yang terlihat pengunjung.
- `robots.txt`, `_headers`, `sitemap-index.xml`, dan `sitemap-0.xml` ikut terbit di `dist/`.
- Tidak ada `aggregateRating` di JSON-LD karena situs tidak memiliki sumber rating yang ditampilkan.
