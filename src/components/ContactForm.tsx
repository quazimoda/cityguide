'use client';

import type React from 'react';
import { useState } from 'react';

const validEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const maxMessageLength = 2000;

export function ContactForm() {
  const [state, setState] = useState({ name: '', email: '', message: '' });
  const [statusMessage, setStatusMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function submit(event: React.FormEvent) {
    event.preventDefault();

    const name = state.name.trim();
    const email = state.email.trim();
    const message = state.message.trim();

    if (!name || !email || !message) {
      setStatusMessage('Please complete all required fields.');
      return;
    }

    if (!validEmail(email)) {
      setStatusMessage('Please enter a valid email address.');
      return;
    }

    if (message.length > maxMessageLength) {
      setStatusMessage('Message must be 2000 characters or fewer.');
      return;
    }

    setIsSubmitting(true);
    setStatusMessage('');

    try {
      const response = await fetch('/api/site-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'contact',
          name,
          email,
          message,
          sourcePageUrl: window.location.href,
        }),
      });
      const result = (await response.json()) as { ok?: boolean; error?: string };

      if (!response.ok || !result.ok) {
        setStatusMessage(result.error || 'Unable to send your message. Please try again.');
        return;
      }

      setStatusMessage('Thanks — your message has been sent.');
      setState({ name: '', email: '', message: '' });
    } catch {
      setStatusMessage('Unable to send your message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-4 rounded-3xl bg-white p-6 shadow-sm">
      <input
        className="w-full rounded-xl border p-3"
        placeholder="Name"
        value={state.name}
        onChange={(event) => setState({ ...state, name: event.target.value })}
      />
      <input
        className="w-full rounded-xl border p-3"
        placeholder="Email"
        value={state.email}
        onChange={(event) => setState({ ...state, email: event.target.value })}
      />
      <textarea
        className="min-h-32 w-full rounded-xl border p-3"
        maxLength={maxMessageLength}
        placeholder="Message"
        value={state.message}
        onChange={(event) => setState({ ...state, message: event.target.value })}
      />
      <button disabled={isSubmitting} className="rounded-xl bg-teal-700 px-5 py-3 font-bold text-white disabled:opacity-60">
        {isSubmitting ? 'Sending…' : 'Send message'}
      </button>
      {statusMessage && <p className="text-sm text-teal-800">{statusMessage}</p>}
    </form>
  );
}
