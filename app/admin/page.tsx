import { redirect } from 'next/navigation';
import { createServerClient } from '@supabase/ssr';
import AdminDashboard from '@/components/admin/AdminDashboard';
import { cookies } from 'next/headers';

export default async function AdminPage() {
  // Initialize Supabase server client with request cookies
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (name) => cookies().get(name)?.value,
      },
    }
  );

  // Get current user
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect('/sign-in');
  }

  // Fetch role from profiles table
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (error || profile?.role !== 'admin') {
    redirect('/dashboard');
  }

  return <AdminDashboard />;
}
