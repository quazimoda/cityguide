'use client';

import type React from 'react';
import { useId, useMemo, useState } from 'react';
import type { ExperienceOffer } from '@/data/offers';

type Props = {
  offer: ExperienceOffer;
  sourceLabel?: string;
  sourceArticleSlug?: string;
  sourcePageUrl?: string;
  className?: string;
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

function initialForm(offer: ExperienceOffer): FormState {
  return {
    name: '',
    email: '',
    preferredDate: '',
    people: '1',
    message:
      offer.key === 'ferryPhoto'
        ? 'I want to book the ferry photo and reel experience.'
        : offer.defaultMessage,
    phone: '',
    preferredTime: '',
    socialHandle: '',
  };
}

export function ExperienceOrderPlacement({ offer, sourceLabel, sourceArticleSlug, sourcePageUrl, className = '' }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState<FormState>(() => initialForm(offer));
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

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (isSubmitting || !validate()) return;
    setIsSubmitting(true);
    setStatus('');

    const response = await fetch('/api/excursion-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...form,
        offerName: offer.offerName,
        price: offer.price,
        duration: offer.duration,
        sourcePageUrl: source,
        sourceArticleSlug,
        sourceLabel,
      }),
    });
    const result = (await response.json().catch(() => null)) as { success?: boolean; error?: string } | null;

    setIsSubmitting(false);
    if (!response.ok || !result?.success) {
      setStatus(result?.error ?? 'Please check the form and try again.');
      return;
    }

    setStatus('Request received. We will contact you to confirm availability and payment details.');
    setForm(initialForm(offer));
  }

  return (
    <div className={`rounded-3xl border border-orange-100 bg-white p-5 shadow-sm ${className}`}>
      <p className="text-xs font-bold uppercase tracking-wide text-orange-600">Partner experience</p>
      <h2 className="mt-2 text-lg font-black text-teal-950">{offer.offerName}</h2>
      <p className="mt-2 text-sm leading-6 text-gray-600">{offer.shortDescription}</p>
      <p className="mt-3 text-sm font-bold text-teal-900">{offer.price} · {offer.duration}</p>
      <p className="mt-1 text-xs text-gray-500">Request now. Payment is arranged after confirmation.</p>
      <button
        type="button"
        onClick={() => {
          setIsOpen(true);
          setStatus('');
        }}
        className="mt-4 w-full rounded-xl bg-teal-700 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-teal-800 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:ring-offset-2"
      >
        {offer.buttonLabel}
      </button>
      {isOpen ? (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-teal-950/60 p-4 pt-10" role="dialog" aria-modal="true" aria-labelledby={headingId}>
          <div className="w-full max-w-xl rounded-3xl bg-white p-6 shadow-xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-bold text-orange-600">{offer.price} · {offer.duration}</p>
                <h2 id={headingId} className="text-2xl font-black text-teal-950">Send request</h2>
                <p className="mt-1 text-sm text-gray-600">{offer.offerName}</p>
              </div>
              <button type="button" onClick={() => setIsOpen(false)} className="rounded-full px-3 py-1 text-2xl text-gray-500 hover:bg-gray-100" aria-label="Close order form">×</button>
            </div>
            <form onSubmit={submit} className="mt-5 grid gap-4 md:grid-cols-2">
              <Field label="Name" error={errors.name}><input value={form.name} onChange={(e) => update('name', e.target.value)} className="w-full rounded-xl border p-3" /></Field>
              <Field label="Email" error={errors.email}><input value={form.email} onChange={(e) => update('email', e.target.value)} className="w-full rounded-xl border p-3" type="email" /></Field>
              <Field label="Preferred date" error={errors.preferredDate}><input value={form.preferredDate} onChange={(e) => update('preferredDate', e.target.value)} className="w-full rounded-xl border p-3" type="date" /></Field>
              <Field label="Number of people" error={errors.people}><input value={form.people} onChange={(e) => update('people', e.target.value)} className="w-full rounded-xl border p-3" type="number" min="1" /></Field>
              <Field label="WhatsApp / phone (optional)"><input value={form.phone} onChange={(e) => update('phone', e.target.value)} className="w-full rounded-xl border p-3" /></Field>
              <Field label="Preferred time (optional)"><input value={form.preferredTime} onChange={(e) => update('preferredTime', e.target.value)} className="w-full rounded-xl border p-3" /></Field>
              <Field label="Instagram / TikTok handle (optional)" className="md:col-span-2"><input value={form.socialHandle} onChange={(e) => update('socialHandle', e.target.value)} className="w-full rounded-xl border p-3" /></Field>
              <Field label="Message" error={errors.message} className="md:col-span-2"><textarea value={form.message} maxLength={2000} onChange={(e) => update('message', e.target.value)} className="min-h-24 w-full rounded-xl border p-3" /></Field>
              <div className="md:col-span-2 rounded-2xl bg-gray-50 p-3 text-xs text-gray-600">
                <p>Offer: {offer.offerName} · {offer.price} · {offer.duration}</p>
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
