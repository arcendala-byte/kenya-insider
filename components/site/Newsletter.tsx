'use client';
import { useState } from 'react';
import { useLocale } from '@/components/LocaleProvider';
import { copy } from '@/lib/i18n';

export default function Newsletter() {
  const { locale } = useLocale();
  const t = copy[locale].newsletter;
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email)) return setMessage(t.invalidEmail);
    setSending(true);
    setMessage('');
    const form = new FormData(event.currentTarget);
    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(Object.fromEntries(form)),
      });
      const result = await response.json().catch(() => null);
      if (!response.ok) throw new Error(result?.error || t.errorMessage);
      setMessage(t.successMessage);
      setEmail('');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : t.errorMessage);
    } finally {
      setSending(false);
    }
  }

  return (
    <section className="bg-sandBeige px-4 sm:px-5 py-12 sm:py-14">
      <div className="mx-auto grid max-w-7xl gap-6 md:grid-cols-[1fr_auto] md:items-end">
        <div>
          <p className="eyebrow">{t.eyebrow}</p>
          <h2 className="mt-3 font-heading text-3xl sm:text-4xl text-forestGreen">{t.title}</h2>
          <p className="mt-3 max-w-xl leading-7">{t.desc}</p>
        </div>
        <form onSubmit={submit} className="w-full md:max-w-md">
          <input className="hidden" tabIndex={-1} autoComplete="off" aria-hidden="true" name="website" />
          <label className="sr-only" htmlFor="newsletter-email">
            {t.placeholder}
          </label>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              id="newsletter-email"
              name="email"
              required
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder={t.placeholder}
              className="min-w-0 flex-1 border border-forestGreen/30 bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-forestGreen"
            />
            <button
              disabled={sending}
              className="bg-forestGreen px-5 py-3 text-sm font-semibold text-white hover:bg-darkForest disabled:opacity-60 transition whitespace-nowrap"
            >
              {sending ? t.joiningBtn : t.subscribeBtn}
            </button>
          </div>
          <p className="mt-2 text-xs">{t.disclaimer}</p>
          {message && (
            <p className="mt-2 text-sm text-forestGreen font-medium" role="status">
              {message}
            </p>
          )}
        </form>
      </div>
    </section>
  );
}
