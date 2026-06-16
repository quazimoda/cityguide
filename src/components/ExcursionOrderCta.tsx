'use client';

import type React from 'react';
import { useId, useMemo, useState } from 'react';
import { ferryPhotoExperienceOffer } from '@/data/offers';

type Variant = 'card' | 'inline' | 'compact';

type Props = {
  variant?: Variant;
  sourceLabel?: string;
  sourceArticleSlug?: string;
  sourcePageUrl?: string;
  className?: string;
  title?: string;
  ctaLabel?: string;
};

type FormState = {
  name: string;
  email: string;
  preferredDate: string;
  people: string;
  message: string;
  phone: string;
  preferredTime: string;
  socialHandle: string;
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const initialForm: FormState = {
  name: '',
  email: '',
  preferredDate: '',
  people: '1',
  message: ferryPhotoExperienceOffer.defaultMessage,
  phone: '',
  preferredTime: '',
  socialHandle: '',
};

export function ExcursionOrderCta({
  variant = 'card',
  sourceLabel,
  sourceArticleSlug,
  sourcePageUrl,
  className = '',
  title,
  ctaLabel,
}: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState<FormState>(initialForm);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [status, setStatus] = useState('');
  const headingId = useId();
  const source = useMemo(() => {
    if (sourcePageUrl) return sourcePageUrl;
    if (typeof window !== 'undefined') return window.location.href;
    return '';
  }, [sourcePageUrl]);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: undefined }));
  }

  function validate() {
    const nextErrors: Partial<Record<keyof FormState, string>> = {};
    if (!form.name.trim()) nextErrors.name = 'Name is required.';
    if (!form.email.trim()) nextErrors.email = 'Email is required.';
    else if (!emailPattern.test(form.email)) nextErrors.email = 'Enter a valid email address.';
    if (!form.preferredDate) nextErrors.preferredDate = 'Preferred date is required.';
    if (!form.people || Number(form.people) < 1) nextErrors.people = 'Enter at least 1 person.';
    if (!form.message.trim()) nextErrors.message = 'Message is required.';
    else if (form.message.length > 2000) nextErrors.message = 'Message must be 2000 characters or fewer.';
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  function submit(event: React.FormEvent) {
    event.preventDefault();
    if (isSubmitting || !validate()) return;
    setIsSubmitting(true);
    const payload = {
      ...form,
      offerName: ferryPhotoExperienceOffer.offerName,
      price: ferryPhotoExperienceOffer.price,
      duration: ferryPhotoExperienceOffer.duration,
      sourcePageUrl: source,
      sourceArticleSlug,
      sourceLabel,
      sourceLine: `Source page: ${source}`,
    };
    console.info('Excursion order request payload', payload);
    window.setTimeout(() => {
      setStatus('Request sent. We will contact you to confirm availability and payment details.');
      setIsSubmitting(false);
      setForm(initialForm);
    }, 300);
  }

  const compact = variant === 'compact';
  const wrapperClass =
    variant === 'inline'
      ? 'my-8 rounded-3xl border border-teal-100 bg-teal-50/70 p-5 shadow-sm'
      : compact
        ? 'rounded-2xl border border-orange-100 bg-white p-5 shadow-sm'
        : 'my-8 rounded-3xl border border-orange-100 bg-white p-6 shadow-sm';

  return (
    <div className={`${wrapperClass} ${className}`}>
      <div className={compact ? 'space-y-3' : 'grid gap-5 md:grid-cols-[1fr_auto] md:items-center'}>
        <div>
          <p className="text-sm font-bold uppercase tracking-wide text-orange-600">Ferry photo experience</p>
          <h2 className={`${compact ? 'text-xl' : 'text-2xl'} mt-2 font-black text-teal-950`}>
            {title ?? ferryPhotoExperienceOffer.offerName}
          </h2>
          <p className="mt-2 text-sm leading-6 text-gray-600">
            {compact
              ? 'Book a 3-hour Istanbul Ferry Photo & Reel Experience for €125.'
              : ferryPhotoExperienceOffer.description}
          </p>
          <p className="mt-3 font-bold text-teal-900">{ferryPhotoExperienceOffer.priceDuration}</p>
          <p className="mt-1 text-sm text-gray-500">{ferryPhotoExperienceOffer.secondaryText}</p>
        </div>
        <div className="space-y-2">
          <button
            type="button"
            onClick={() => {
              setIsOpen(true);
              setStatus('');
            }}
            className="w-full rounded-xl bg-teal-700 px-5 py-3 text-sm font-bold text-white transition hover:bg-teal-800 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:ring-offset-2"
          >
            {ctaLabel ?? ferryPhotoExperienceOffer.primaryCta}
          </button>
          <p className="text-xs text-gray-500">{ferryPhotoExperienceOffer.smallNote}</p>
        </div>
      </div>
      {isOpen ? (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-teal-950/60 p-4 pt-10" role="dialog" aria-modal="true" aria-labelledby={headingId}>
          <div className="w-full max-w-2xl rounded-3xl bg-white p-6 shadow-xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-bold text-orange-600">{ferryPhotoExperienceOffer.priceDuration}</p>
                <h2 id={headingId} className="text-2xl font-black text-teal-950">Request this excursion</h2>
                <p className="mt-1 text-sm text-gray-600">No online payment yet. Send a request and we will confirm availability.</p>
              </div>
              <button type="button" onClick={() => setIsOpen(false)} className="rounded-full px-3 py-1 text-2xl text-gray-500 hover:bg-gray-100" aria-label="Close order form">×</button>
            </div>
            <form onSubmit={submit} className="mt-6 grid gap-4 md:grid-cols-2">
              <Field label="Name" error={errors.name}><input value={form.name} onChange={(e) => update('name', e.target.value)} className="w-full rounded-xl border p-3" /></Field>
              <Field label="Email" error={errors.email}><input value={form.email} onChange={(e) => update('email', e.target.value)} className="w-full rounded-xl border p-3" type="email" /></Field>
              <Field label="Preferred date" error={errors.preferredDate}><input value={form.preferredDate} onChange={(e) => update('preferredDate', e.target.value)} className="w-full rounded-xl border p-3" type="date" /></Field>
              <Field label="Number of people" error={errors.people}><input value={form.people} onChange={(e) => update('people', e.target.value)} className="w-full rounded-xl border p-3" type="number" min="1" /></Field>
              <Field label="WhatsApp / phone (optional)"><input value={form.phone} onChange={(e) => update('phone', e.target.value)} className="w-full rounded-xl border p-3" /></Field>
              <Field label="Preferred time (optional)"><input value={form.preferredTime} onChange={(e) => update('preferredTime', e.target.value)} className="w-full rounded-xl border p-3" /></Field>
              <Field label="Instagram / TikTok handle (optional)" className="md:col-span-2"><input value={form.socialHandle} onChange={(e) => update('socialHandle', e.target.value)} className="w-full rounded-xl border p-3" /></Field>
              <Field label="Message" error={errors.message} className="md:col-span-2"><textarea value={form.message} maxLength={2000} onChange={(e) => update('message', e.target.value)} className="min-h-28 w-full rounded-xl border p-3" /></Field>
              <div className="md:col-span-2 rounded-2xl bg-gray-50 p-3 text-xs text-gray-600">
                <p>Offer: {ferryPhotoExperienceOffer.offerName} · {ferryPhotoExperienceOffer.price} · {ferryPhotoExperienceOffer.duration}</p>
                <p>Source page: {source || 'Current page'}</p>
              </div>
              <div className="md:col-span-2 flex flex-wrap items-center gap-3">
                <button disabled={isSubmitting} className="rounded-xl bg-teal-700 px-5 py-3 font-bold text-white disabled:cursor-not-allowed disabled:opacity-60">{isSubmitting ? 'Sending…' : 'Send request'}</button>
                {status ? <p className="text-sm font-semibold text-teal-800">{status}</p> : null}
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function Field({ label, error, className = '', children }: { label: string; error?: string; className?: string; children: React.ReactNode }) {
  return <label className={`block text-sm font-semibold text-teal-950 ${className}`}>{label}<span className="mt-1 block">{children}</span>{error ? <span className="mt-1 block text-sm text-red-600">{error}</span> : null}</label>;
}
