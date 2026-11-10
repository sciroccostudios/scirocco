import { useCallback, useState } from 'react';

/** Every form on the site posts through here, so there is one submission path. */

export const STUDIO_EMAIL = 'info@sciroccostudios.com';

/**
 * Form names. Each must match a `name` attribute AND the hidden `form-name`
 * input, and must be discoverable in the built HTML — Netlify detects forms by
 * parsing dist/ at deploy time, not at runtime. Forms that only exist after
 * hydration need a stub in Layout.astro.
 */
export const FORMS = {
  contact: 'contact',
  inquiry: 'inquiry',
} as const;

export type FormStatus = 'idle' | 'sending' | 'sent' | 'error';

/** Attributes shared by every Netlify-backed form. Spread onto the <form>. */
export const netlifyFormProps = (name: string) => ({
  name,
  method: 'POST' as const,
  action: '/',
  // multipart so file inputs are actually delivered
  encType: 'multipart/form-data',
  'data-netlify': 'true',
  'data-netlify-honeypot': 'bot-field',
});

async function postToNetlify(formEl: HTMLFormElement): Promise<void> {
  const res = await fetch(formEl.getAttribute('action') || '/', {
    method: 'POST',
    // No Content-Type header: the browser must set the multipart boundary.
    body: new FormData(formEl),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
}

/**
 * Submits over fetch so the visitor stays on the page. Without JS the form
 * still posts natively to the same URL and Netlify intercepts it identically.
 */
export function useNetlifyForm(onSuccess?: () => void) {
  const [status, setStatus] = useState<FormStatus>('idle');

  const submit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const formEl = e.currentTarget;
      setStatus('sending');
      try {
        await postToNetlify(formEl);
        formEl.reset();
        setStatus('sent');
        onSuccess?.();
      } catch {
        setStatus('error');
      }
    },
    [onSuccess]
  );

  const reset = useCallback(() => setStatus('idle'), []);

  return { status, submit, reset };
}
