import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// Isi domain produksi HANYA di sini ketika domain sudah ditentukan.
const site = '';

export default defineConfig({
  ...(site ? { site } : {}),
  output: 'static',
  integrations: site ? [sitemap()] : [],
  vite: {
    plugins: [tailwindcss()]
  }
});
