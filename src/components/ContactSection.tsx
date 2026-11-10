import React, { useCallback, useState } from 'react';
import { motion } from 'framer-motion';
import { DESERT_GRADIENT } from '@/lib/tokens';
import { FORMS, STUDIO_EMAIL, netlifyFormProps, useNetlifyForm } from '@/lib/forms';
import NetlifyFormFields from './NetlifyFormFields';

const EMPTY = { name: '', email: '', projectType: '', message: '' };

const ContactSection: React.FC = () => {
  const [form, setForm] = useState(EMPTY);
  const [attachment, setAttachment] = useState('');

  const clear = useCallback(() => {
    setForm(EMPTY);
    setAttachment('');
  }, []);

  const { status, submit } = useNetlifyForm(clear);

  const update = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const fieldClass =
    'w-full px-4 py-3 bg-scirocco-ivory backdrop-blur-sm border border-scirocco-copper rounded-lg text-scirocco-noam placeholder-scirocco-noam/70 focus:border-scirocco-desert focus:outline-none focus:ring-2 focus:ring-scirocco-desert/50 transition-all duration-300';

  return (
    <section id="contact" className="py-12 px-4 md:px-8 text-scirocco-wheat min-h-screen" style={{ background: DESERT_GRADIENT }}>
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-8 md:mb-16"
        >
          <h2 className="font-playfair text-4xl md:text-5xl lg:text-6xl xl:text-7xl mb-6 md:mb-8 text-scirocco-wheat" style={{ letterSpacing: '0.05em', lineHeight: '1.2' }}>
            CONTACT
          </h2>
          <p className="font-lora text-lg md:text-xl lg:text-2xl italic text-scirocco-ivory" style={{ lineHeight: '1.7', letterSpacing: '0.01em' }}>
            Every collaboration begins with a conversation
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="w-full max-w-4xl mx-auto px-2"
        >
          <div className="relative overflow-hidden bg-black/20 backdrop-blur-sm rounded-xl p-6 md:p-12 border border-scirocco-ivory/20 shadow-lg">
            {/* Background Image */}
            <div
              className="absolute inset-0 bg-cover bg-center opacity-40 z-0"
              style={{ backgroundImage: "url('/cards/getintouchCard.png')" }}
            />
            <div className="relative z-10">
              <div className="text-center mb-8">
                <h3 className="font-playfair text-2xl mb-4 text-scirocco-wheat">Get in Touch</h3>
                <a
                  href="mailto:info@sciroccostudios.com"
                  className="font-baskerville text-lg text-scirocco-ivory hover:text-scirocco-wheat transition-colors block mb-2"
                >
                  info@sciroccostudios.com
                </a>
                <a
                  href="https://www.instagram.com/sciroccostudios"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-lora text-scirocco-ivory hover:text-scirocco-wheat transition-colors inline-flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1112.324 0 6.162 6.162 0 01-12.324 0zM12 16a4 4 0 110-8 4 4 0 010 8zm4.965-10.405a1.44 1.44 0 112.881.001 1.44 1.44 0 01-2.881-.001z" />
                  </svg>
                  @sciroccostudios
                </a>
              </div>

              <form
                className="space-y-5 md:space-y-6"
                {...netlifyFormProps(FORMS.contact)}
                onSubmit={submit}
              >
                <NetlifyFormFields formName={FORMS.contact} />
                <div>
                  <label htmlFor="contact-name" className="sr-only">Your name</label>
                  <input
                    id="contact-name"
                    name="name"
                    type="text"
                    required
                    value={form.name}
                    onChange={update}
                    placeholder="Your Name"
                    className={fieldClass}
                  />
                </div>
                <div>
                  <label htmlFor="contact-email" className="sr-only">Your email</label>
                  <input
                    id="contact-email"
                    name="email"
                    type="email"
                    required
                    value={form.email}
                    onChange={update}
                    placeholder="Your Email"
                    className={fieldClass}
                  />
                </div>
                <div>
                  <label htmlFor="contact-project-type" className="sr-only">Project type</label>
                  <select
                    id="contact-project-type"
                    name="projectType"
                    value={form.projectType}
                    onChange={update}
                    className={`${fieldClass} appearance-none bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGNsYXNzPSJ3LTYgaC0zIiB2aWV3Qm94PSIwIDAgMjQgMjQiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlPSJjdXJyZW50Q29sb3IiIGZpbGw9Im5vbmUiPgogIDxwYXRoIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIgZD0iTTE5IDkgTDExLjUgMTYuNVY5Ii8+Cjwvc3ZnPg==')_right_1rem_center_no-repeat`}
                  >
                    <option value="">Project Type</option>
                    <option value="Residential">Residential</option>
                    <option value="Commercial">Commercial</option>
                    <option value="Consultation">Consultation</option>
                  </select>
                </div>
                <div>
                  <label
                    htmlFor="contact-attachment"
                    className="flex items-center justify-center w-full px-4 py-4 bg-scirocco-ivory backdrop-blur-sm border-2 border-dashed border-scirocco-copper rounded-lg cursor-pointer hover:border-scirocco-desert transition-all duration-300 group"
                  >
                    <div className="flex items-center space-x-3">
                      <svg aria-hidden="true" className="w-5 h-5 text-scirocco-copper group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                      </svg>
                      <span className="text-scirocco-noam font-lora italic">
                        {attachment || 'Upload your desired project here'}
                      </span>
                    </div>
                    <input
                      id="contact-attachment"
                      name="attachment"
                      type="file"
                      className="sr-only"
                      accept="image/*,.pdf"
                      onChange={(e) => setAttachment(e.target.files?.[0]?.name ?? '')}
                    />
                  </label>
                  {attachment && (
                    <p className="mt-2 text-xs font-lora text-scirocco-ivory text-center">
                      Attached: {attachment}
                    </p>
                  )}
                </div>
                <div>
                  <label htmlFor="contact-message" className="sr-only">Tell us about your project</label>
                  <textarea
                    id="contact-message"
                    name="message"
                    rows={4}
                    value={form.message}
                    onChange={update}
                    placeholder="Tell us about your project"
                    className={`${fieldClass} resize-none`}
                  />
                </div>
                <div className="text-center pt-2">
                  <button
                    type="submit"
                    disabled={status === 'sending'}
                    className="px-8 py-3.5 bg-gradient-to-r from-scirocco-copper to-scirocco-desert text-white font-lora rounded-full hover:from-scirocco-noam hover:to-scirocco-copper transition-all duration-300 font-medium shadow-md hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {status === 'sending' ? 'Sending…' : 'Send Message'}
                  </button>
                  <p aria-live="polite" className="mt-3 text-sm font-lora text-scirocco-ivory min-h-[1.25rem] mx-auto">
                    {status === 'sent' && 'Thank you. We will be in touch within 24-48 hours.'}
                    {status === 'error' && (
                      <>
                        Something went wrong sending that. Please email us at{' '}
                        <a href={`mailto:${STUDIO_EMAIL}`} className="underline underline-offset-4">
                          {STUDIO_EMAIL}
                        </a>
                        .
                      </>
                    )}
                  </p>
                </div>
              </form>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ContactSection;
