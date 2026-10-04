'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { useLocale } from '@/components/LocaleProvider';
import { copy } from '@/lib/i18n';

export default function AuthForm({ mode }: { mode: 'signin' | 'register' }) {
  const { locale } = useLocale();
  const t = copy[locale].auth;
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const register = mode === 'register';

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!supabase) {
      return setMessage(t.notConfigured);
    }
    setLoading(true);
    setMessage('');
    const result = register
      ? await supabase.auth.signUp({ email, password, options: { data: { full_name: name } } })
      : await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (result.error) return setMessage(result.error.message);
    if (register && !result.data.session) {
      return setMessage(t.confirmEmailNotice);
    }
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();
      // Retrieve session to set cookies for SSR
      // Persist session via Supabase helper (sets appropriate cookies for SSR)
      if (result.data.session) {
        await supabase.auth.setSession(result.data.session);
      }
      const { data: { session } } = await supabase.auth.getSession();
      // Persist Supabase session using the expected cookie name for SSR
      const projectUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
      const projectRefMatch = projectUrl.match(/https:\/\/([^.]*)\.supabase\.co/);
      const projectRef = projectRefMatch ? projectRefMatch[1] : '';
      if (session && projectRef) {
        const cookieName = `sb-${projectRef}-auth-token`;
        const cookieValue = encodeURIComponent(JSON.stringify(session));
        // Set cookie for the current origin (http://localhost during dev)
        document.cookie = `${cookieName}=${cookieValue}; path=/; SameSite=Lax`;
      }

      console.log('LOGIN USER:', user);
      console.log('LOGIN SESSION EXISTS:', !!session);
      console.log('LOGIN USER ID:', user?.id);
      if (profile?.role === 'admin') {
        router.push('/admin');
      } else {
        router.push('/dashboard');
      }
    }

  }

  return (
    <form onSubmit={submit} className="mx-auto mt-10 max-w-md border border-sandBeige bg-white p-6 shadow-sm">
      <h1 className="font-heading text-4xl text-forestGreen">
        {register ? t.registerTitle : t.signInTitle}
      </h1>
      <p className="mt-2 text-sm text-charcoal/80">
        {register ? t.registerSubtitle : t.signInSubtitle}
      </p>

      {register && (
        <label className="mt-5 block text-sm font-medium">
          {t.nameLabel}
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 w-full border border-sandBeige p-3 outline-none focus:border-forestGreen"
          />
        </label>
      )}

      <label className="mt-5 block text-sm font-medium">
        {t.emailLabel}
        <input
          required
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 w-full border border-sandBeige p-3 outline-none focus:border-forestGreen"
        />
      </label>

      <label className="mt-4 block text-sm font-medium">
        {t.passwordLabel}
        <input
          required
          minLength={8}
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-1 w-full border border-sandBeige p-3 outline-none focus:border-forestGreen"
        />
      </label>

      {message && (
        <p role="status" className="mt-4 text-sm font-medium text-forestGreen">
          {message}
        </p>
      )}

      <button
        disabled={loading}
        className="mt-6 w-full bg-forestGreen px-5 py-3 font-semibold text-white hover:bg-darkForest disabled:opacity-60 transition"
      >
        {loading ? t.waitingBtn : register ? t.registerBtn : t.signInBtn}
      </button>

      <p className="mt-5 text-sm text-charcoal/80">
        {register ? t.alreadyHaveAccount : t.newToKenyaInsider}{' '}
        <Link
          className="font-semibold text-forestGreen underline hover:text-darkForest"
          href={register ? '/sign-in' : '/register'}
        >
          {register ? t.signInBtn : t.registerBtn}
        </Link>
      </p>
    </form>
  );
}
