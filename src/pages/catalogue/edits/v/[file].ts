import type { APIRoute } from 'astro';
import { readFileSync } from 'node:fs';
import { edits } from '@/data/edits';
import { editPdf } from '@/lib/editPdf';

/** Emits the fingerprinted copy of each edit PDF (see src/lib/editPdf.ts). */
export function getStaticPaths() {
  return edits.map((edit) => {
    const pdf = editPdf(edit.pdfUrl);
    return { params: { file: pdf.file }, props: { source: pdf.source } };
  });
}

export const GET: APIRoute = ({ props }) =>
  new Response(readFileSync(props.source as string), {
    headers: { 'Content-Type': 'application/pdf' },
  });
