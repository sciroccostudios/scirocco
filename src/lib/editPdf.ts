import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { basename } from 'node:path';

/**
 * Build-time helpers for the monthly edit PDFs. Server-only (reads the disk).
 *
 * The viewer loads each PDF from a copy whose name contains a hash of its
 * contents, e.g. /catalogue/edits/v/2026-11-folia-3f9a1c2b4d.pdf. Those copies
 * are cached by browsers for a year (see scripts/build-csp.mjs). Replacing a
 * PDF changes its hash and therefore its address, so visitors fetch the new
 * one without anyone renaming files. The original path keeps normal caching.
 */
export interface EditPdf {
  /** Fingerprinted path the viewer loads */
  url: string;
  /** Size in bytes, used for range loading */
  size: number;
  /** File name of the fingerprinted copy, without the directory */
  file: string;
  /** Path of the source file under public/ */
  source: string;
}

export function editPdf(pdfUrl: string): EditPdf {
  const source = `public${pdfUrl}`;
  const bytes = readFileSync(source);
  const hash = createHash('sha256').update(bytes).digest('hex').slice(0, 10);
  const file = basename(pdfUrl).replace(/\.pdf$/i, `-${hash}.pdf`);
  return { url: `/catalogue/edits/v/${file}`, size: bytes.length, file, source };
}
