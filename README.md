# Monas Jakarta — Astro Static Site

Situs panduan independen satu halaman untuk Monumen Nasional (Monas) di Jakarta. Konten antarmuka seluruhnya menggunakan Bahasa Indonesia dan desain dibuat khusus berdasarkan bentuk vertikal Monas, nyala api emas, serta palet merah-putih-hijau tua.

## Stack yang dikunci

- Astro `7.2.2`
- Tailwind CSS `4.3.3` + `@tailwindcss/vite` `4.3.3`
- TypeScript `6.0.3`
- `@astrojs/check` `0.9.10`
- `@astrojs/sitemap` `3.7.3`
- pnpm `9.15.9` melalui `packageManager`
- Node.js `24.19.0` melalui `engines` dan `.node-version`
- Wrangler `4.123.0` (perintah deploy dikunci eksplisit)

Tidak ada database, login, CMS, framework UI, atau runtime server-side.

## Domain hanya di satu tempat

Edit **hanya** konstanta `site` di `astro.config.mjs` ketika domain produksi sudah tersedia:

```js
const site = '';
```

Saat kosong:

- build tetap berjalan;
- canonical dan URL absolut Open Graph tidak dirender;
- JSON-LD tidak memasukkan URL absolut;
- integrasi sitemap tidak diaktifkan;
- tidak ada domain placeholder yang disisipkan.

Saat diisi URL produksi, Astro akan menjadi sumber tunggal untuk canonical, Open Graph, JSON-LD, dan sitemap.

## Instalasi & pemeriksaan bersih

```bash
rm -rf node_modules
corepack enable
CI=1 corepack pnpm install --frozen-lockfile
pnpm check
pnpm build
```

`.npmrc` menggunakan `only-built-dependencies=esbuild`. Proyek ini adalah single-package dan sengaja **tidak** memiliki `pnpm-workspace.yaml`.

## Cloudflare Workers Static Assets

`wrangler.jsonc` menggunakan mode assets-only:

```jsonc
{
  "assets": {
    "directory": "./dist"
  }
}
```

Tidak ada `main` Worker karena build Astro bersifat statik. Setelah build:

```bash
pnpm deploy
```

## GA4

Measurement ID: `G-HXM22WWPKP`.

## Sumber informasi utama

- Monas / kanal resmi: https://www.instagram.com/monumen.nasional/
- TransJakarta: https://transjakarta.co.id/rute
- Pemerintah Provinsi DKI Jakarta: https://www.jakarta.go.id/
- Dinas Perhubungan DKI Jakarta: https://dishub.jakarta.go.id/
- MRT Jakarta / Jakarta Smart City untuk status proyek MRT Fase 2A.

Tarif, jam layanan, pola lalu lintas, dan akses dapat berubah saat acara atau kebijakan khusus. Konten situs sengaja menghindari klaim “terakhir diperbarui” dengan tanggal buatan.

## Verifikasi otomatis

`pnpm verify` menjalankan clean install dengan frozen lockfile, `astro check`, build, pemeriksaan workspace, grep placeholder/URL ilegal pada `dist`, dan pemeriksaan `lastmod` sitemap. Lihat `VALIDATION.md` untuk status eksekusi di lingkungan pengiriman.
