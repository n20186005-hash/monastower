// Format nama situs: nama atraksi + kota + panduan wisata.
// Semua judul halaman mengambil nama ini dari satu tempat.
export const SITE_NAME = 'Monas Jakarta — Panduan Wisata';
export const SITE_SHORT_NAME = 'Monas Jakarta';

/** Tambahkan nama situs bila judul halaman belum memuatnya. */
export function withSiteName(title: string): string {
  if (!title || title.includes(SITE_SHORT_NAME)) return title;
  return `${title} | ${SITE_NAME}`;
}
