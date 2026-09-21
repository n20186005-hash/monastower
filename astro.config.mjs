import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// Domain produksi: wajib diisi agar canonical, og:url absolut, sitemap, dan robots.txt terbit.
const site = 'https://monastower.com';

export default defineConfig({
  ...(site ? { site } : {}),
  output: 'static',
  integrations: site ? [sitemap()] : [],
  vite: {
    plugins: [tailwindcss()]
  }
});
