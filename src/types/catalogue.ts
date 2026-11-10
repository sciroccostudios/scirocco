/** Types for the site-wide inquiry modal. */

/** Inquiry form data structure */
export interface InquiryFormData {
  name: string;
  email: string;
  phone?: string;
  message?: string;
}

/** Context for the inquiry modal - determines header text, email subject, and button label */
export type InquiryContext =
  | { mode: 'general'; title?: string; subtitle?: string };

/** Props for the inquiry modal */
export interface InquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  context: InquiryContext;
}
