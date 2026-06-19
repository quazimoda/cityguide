'use client';

import type React from 'react';
import { useState } from 'react';

const validEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export function SubscribeForm() {
  const [email, setEmail] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function submit(event: React.FormEvent) {
    event.preventDefault();

    const normalizedEmail = email.trim();

    if (!normalizedEmail) {
      setStatusMessage('Email is required.');
      return;
    }

    if (!validEmail(normalizedEmail)) {
      setStatusMessage('Please enter a valid email address.');
      return;
    }

    setIsSubmitting(true);
    setStatusMessage('');

    try {
      const response = await fetch('/api/site-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'subscribe',
          email: normalizedEmail,
          sourcePageUrl: window.location.href,
        }),
      });
      const result = (await response.json()) as { ok?: boolean; error?: string };

      if (!response.ok || !result.ok) {
        setStatusMessage(result.error || 'Unable to add your email. Please try again.');
        return;
      }

      setStatusMessage('Thanks — your email has been added to our Istanbul updates list.');
      setEmail('');
    } catch {
      setStatusMessage('Unable to add your email. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={submit} className="rounded-3xl bg-teal-900 p-6 text-white">
      <p className="mb-4">Enter your e-mail to receive Istanbul tips, travel recommendations, and local guide updates.</p>
      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          className="min-w-0 flex-1 rounded-xl px-4 py-3 text-gray-900"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="you@example.com"
        />
        <button disabled={isSubmitting} className="rounded-xl bg-orange-500 px-5 py-3 font-bold disabled:opacity-60">
          {isSubmitting ? 'Subscribing…' : 'Subscribe'}
        </button>
      </div>
      {statusMessage && <p className="mt-3 text-sm">{statusMessage}</p>}
    </form>
  );
}
