/**
 * Monthly edits shown on /our-curations, newest first.
 *
 * To add a month: put its photos in public/curations/edits/<yyyy-mm>/, its PDF
 * in public/catalogue/edits/, and add an entry at the top of this list. The
 * card and the viewer page (/our-curations/<slug>) are generated from it.
 */
export interface Edit {
  /** URL segment, e.g. "november-2026" → /our-curations/november-2026 */
  slug: string;
  /** Small label above the title */
  monthLabel: string;
  title: string;
  subtitle: string;
  cta: string;
  pdfUrl: string;
  downloadFilename: string;
  /** Up to 5 collage photos, in stacking order (first sits on top) */
  coverImages: string[];
}

export const edits: Edit[] = [
  {
    slug: 'november-2026',
    monthLabel: 'November 2026',
    // Non-breaking space keeps "— FOLIA" together when the title wraps.
    title: 'NOVEMBER EDIT —\u00a0FOLIA',
    subtitle: 'An Unruly Herbarium',
    cta: 'View Edition',
    pdfUrl: '/catalogue/edits/2026-11-folia.pdf',
    downloadFilename: 'FOLIA - November 2026.pdf',
    coverImages: [
      '/curations/edits/2026-11/bronze-branch-chandelier.jpg',
      '/curations/edits/2026-11/pressed-flower-cabinet.jpg',
      '/curations/edits/2026-11/boucle-armchair.jpg',
      '/curations/edits/2026-11/bronze-leaf-imprint.jpg',
      '/curations/edits/2026-11/glass-petal-vases.jpg',
    ],
  },
];
