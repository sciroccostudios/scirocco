import React, { useState, useEffect, useCallback } from 'react';
import InquiryModal from './catalogue/InquiryModal';
import type { InquiryContext } from '@/types/catalogue';

/**
 * GlobalInquiryModal - Site-wide inquiry modal triggered by custom events.
 * Placed in Layout.astro, listens for 'openInquiryModal' CustomEvent.
 * Dispatchers can pass { title, subtitle } in event detail.
 */
const GlobalInquiryModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [context, setContext] = useState<InquiryContext>({ mode: 'general' });

  const handleOpen = useCallback((e: Event) => {
    const detail = (e as CustomEvent).detail;
    setContext({
      mode: 'general',
      title: detail?.title,
      subtitle: detail?.subtitle,
    });
    setIsOpen(true);
  }, []);

  useEffect(() => {
    window.addEventListener('openInquiryModal', handleOpen);
    return () => window.removeEventListener('openInquiryModal', handleOpen);
  }, [handleOpen]);

  return (
    <InquiryModal
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      context={context}
    />
  );
};

export default GlobalInquiryModal;
