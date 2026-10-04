'use client';
import { useState } from 'react';
import { useLocale } from '@/components/LocaleProvider';
import { copy } from '@/lib/i18n';

export default function ContactForm() {
  const { locale } = useLocale();
  const t = copy[locale].contactPage;
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSending(true);
    setMessage('');
    const form = new FormData(event.currentTarget);
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(Object.fromEntries(form)),
      });
      const result = await response.json().catch(() => null);
      if (!response.ok) throw new Error(result?.error || t.errorMessage);
      event.currentTarget.reset();
      setMessage(t.successMessage);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : t.errorMessage);
    } finally {
      setSending(false);
    }
  }

  return (
    <form onSubmit={submit} className="mt-10 grid gap-5 border border-sandBeige bg-white p-6 shadow-sm md:grid-cols-2">
      <input className="hidden" tabIndex={-1} autoComplete="off" aria-hidden="true" name="website" />
      <label className="text-sm font-medium">
        {t.nameLabel}
        <input required name="name" className="mt-1 w-full border border-sandBeige p-3 outline-none focus:border-forestGreen" />
      </label>
      <label className="text-sm font-medium">
        {t.emailLabel}
        <input required name="email" type="email" className="mt-1 w-full border border-sandBeige p-3 outline-none focus:border-forestGreen" />
      </label>
      <label className="md:col-span-2 text-sm font-medium">
        {t.subjectLabel}
        <input required name="subject" className="mt-1 w-full border border-sandBeige p-3 outline-none focus:border-forestGreen" />
      </label>
      <label className="md:col-span-2 text-sm font-medium">
        {t.messageLabel}
        <textarea required name="message" className="mt-1 min-h-36 w-full border border-sandBeige p-3 outline-none focus:border-forestGreen" />
      </label>
      <div className="md:col-span-2 flex items-center justify-between gap-4">
        <p role="status" className="text-sm text-forestGreen font-medium">
          {message}
        </p>
        <button
          disabled={sending}
          className="bg-forestGreen px-6 py-3 font-semibold text-white hover:bg-darkForest disabled:opacity-60 transition"
        >
          {sending ? t.sendingBtn : t.sendBtn}
        </button>
      </div>
    </form>
  );
}
