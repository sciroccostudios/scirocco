import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import type { InquiryModalProps, InquiryFormData } from '@/types/catalogue';
import { FORMS, STUDIO_EMAIL, netlifyFormProps, useNetlifyForm } from '@/lib/forms';
import NetlifyFormFields from '@/components/NetlifyFormFields';
import { LUXURY_EASING } from '@/lib/tokens';

/** Site-wide inquiry form, opened from the nav and CTA buttons. */
const InquiryModal: React.FC<InquiryModalProps> = ({ isOpen, onClose, context }) => {
  const [formData, setFormData] = useState<InquiryFormData>({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  const headerLabel = 'Get in Touch';
  const headerTitle = context.title || 'Scirocco Studio';
  const headerSubtitle = context.subtitle || 'Every collaboration begins with a conversation';
  const buttonLabel = 'Send Inquiry';
  const footerText = "We'll respond within 24-48 hours.";
  const messagePlaceholder = 'Tell us about your project, timeline, and any specific requirements...';

  const dialogRef = useRef<HTMLDivElement>(null);
  const titleId = 'inquiry-modal-title';

  // Escape to close, Tab confined to the dialog, focus moved in and restored on
  // close. Without the trap, Tab walks the whole page behind an opaque backdrop.
  useEffect(() => {
    if (!isOpen) return;
    resetStatus();

    const opener = document.activeElement as HTMLElement | null;
    const FOCUSABLE =
      'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }
      if (e.key !== 'Tab' || !dialogRef.current) return;
      const items = Array.from(
        dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE)
      ).filter((el) => el.offsetParent !== null);
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const focusTimer = window.setTimeout(() => {
      dialogRef.current?.querySelector<HTMLElement>(FOCUSABLE)?.focus();
    }, 50);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = prevOverflow;
      window.clearTimeout(focusTimer);
      opener?.focus?.();
    };
  }, [isOpen, onClose]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const { status, submit, reset: resetStatus } = useNetlifyForm(() =>
    setFormData({ name: '', email: '', phone: '', message: '' })
  );

  // Context travels as hidden fields so the submission says what it is about.
  const contextFields = { 'inquiry-type': 'General', subject: context.title || 'General enquiry' };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={dialogRef}
          className="fixed inset-0 z-[200] flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          onClick={(e: React.MouseEvent<HTMLDivElement>) => {
            if (e.target === e.currentTarget) {
              onClose();
            }
          }}
        >
          {/* Backdrop with blur */}
          <motion.div
            className="absolute inset-0 backdrop-blur-xl"
            style={{
              background: 'rgba(45, 24, 16, 0.90)',
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Sand sweep transition */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'linear-gradient(90deg, #D4A574 0%, #C9996B 30%, #B8956A 60%, #A87F66 100%)',
            }}
            initial={{ x: '-100%' }}
            animate={{ x: '100%' }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          />

          {/* Grain overlay */}
          <div
            className="absolute inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='3.5' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
            }}
          />

          {/* Modal Content */}
          <motion.div
            className="relative z-10 w-full max-w-lg bg-black/30 backdrop-blur-md rounded-2xl border border-scirocco-ivory/20 shadow-2xl overflow-hidden"
            initial={{ scale: 0.9, y: 40, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.95, y: 20, opacity: 0 }}
            transition={{ duration: 0.5, ease: LUXURY_EASING }}
          >
            {/* Close Button */}
            <motion.button
              onClick={onClose}
              type="button"
              aria-label="Close"
              className="absolute top-4 right-4 z-20 p-2 rounded-full backdrop-blur-sm transition-all duration-300"
              style={{
                background: 'rgba(92, 47, 24, 0.6)',
                border: '1px solid rgba(245, 222, 179, 0.3)',
              }}
              whileHover={{
                scale: 1.1,
                background: 'rgba(92, 47, 24, 0.8)',
              }}
              whileTap={{ scale: 0.95 }}
            >
              <X className="w-5 h-5 text-[#F5DEB3]" />
            </motion.button>

            {/* Header */}
            <div className="px-6 pt-6 pb-4 border-b border-scirocco-ivory/10">
              <motion.p
                className="font-lora text-xs uppercase tracking-[0.3em] text-scirocco-desert mb-2"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                {headerLabel}
              </motion.p>
              <motion.h3
                id={titleId}
                className="font-playfair text-2xl text-scirocco-wheat"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                {headerTitle}
              </motion.h3>
              {headerSubtitle && (
                <motion.p
                  className="font-lora text-sm italic text-scirocco-ivory/70 mt-1"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  {headerSubtitle}
                </motion.p>
              )}
            </div>

            {/* Form */}
            <motion.form
              className="p-6 space-y-4"
              {...netlifyFormProps(FORMS.inquiry)}
              onSubmit={submit}
            >
              <NetlifyFormFields formName={FORMS.inquiry} />
              {Object.entries(contextFields).map(([k, v]) => (
                <input key={k} type="hidden" name={k} value={v} />
              ))}
              {/* Name Input */}
              <div>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  aria-label="Your name"
                  placeholder="Your Name *"
                  required
                  className="w-full px-4 py-3 bg-scirocco-ivory/90 backdrop-blur-sm border border-scirocco-copper/40 rounded-lg text-scirocco-noam placeholder-scirocco-noam/50 focus:border-scirocco-desert focus:outline-none focus:ring-2 focus:ring-scirocco-desert/30 transition-all duration-300"
                />
              </div>

              {/* Email Input */}
              <div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  aria-label="Your email"
                  placeholder="Your Email *"
                  required
                  className="w-full px-4 py-3 bg-scirocco-ivory/90 backdrop-blur-sm border border-scirocco-copper/40 rounded-lg text-scirocco-noam placeholder-scirocco-noam/50 focus:border-scirocco-desert focus:outline-none focus:ring-2 focus:ring-scirocco-desert/30 transition-all duration-300"
                />
              </div>

              {/* Phone Input */}
              <div>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  aria-label="Phone number (optional)"
                  placeholder="Phone (Optional)"
                  className="w-full px-4 py-3 bg-scirocco-ivory/90 backdrop-blur-sm border border-scirocco-copper/40 rounded-lg text-scirocco-noam placeholder-scirocco-noam/50 focus:border-scirocco-desert focus:outline-none focus:ring-2 focus:ring-scirocco-desert/30 transition-all duration-300"
                />
              </div>

              {/* Message Textarea */}
              <div>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  aria-label="Your message"
                  placeholder={messagePlaceholder}
                  rows={3}
                  className="w-full px-4 py-3 bg-scirocco-ivory/90 backdrop-blur-sm border border-scirocco-copper/40 rounded-lg text-scirocco-noam placeholder-scirocco-noam/50 focus:border-scirocco-desert focus:outline-none focus:ring-2 focus:ring-scirocco-desert/30 transition-all duration-300 resize-none"
                />
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <motion.button
                  type="submit"
                  disabled={status === 'sending' || status === 'sent'}
                  className="w-full px-8 py-4 bg-gradient-to-r from-scirocco-copper to-scirocco-desert text-white font-lora rounded-full hover:from-scirocco-noam hover:to-scirocco-copper transition-all duration-300 font-medium shadow-lg hover:shadow-xl disabled:opacity-60 disabled:cursor-not-allowed"
                  whileHover={status === 'idle' ? { scale: 1.02, y: -2 } : {}}
                  whileTap={status === 'idle' ? { scale: 0.98 } : {}}
                >
                  {status === 'sending' ? 'Sending…' : status === 'sent' ? 'Sent' : buttonLabel}
                </motion.button>
              </div>

              <p aria-live="polite" className="text-center text-xs text-scirocco-ivory/70 font-baskerville mx-auto">
                {status === 'sent'
                  ? 'Thank you. We will be in touch within 24-48 hours.'
                  : status === 'error'
                    ? <>Something went wrong. Please email <a href={`mailto:${STUDIO_EMAIL}`} className="underline underline-offset-4">{STUDIO_EMAIL}</a>.</>
                    : footerText}
              </p>
            </motion.form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default InquiryModal;
