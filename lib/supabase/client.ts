import { createClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_API_KEY;

// The runtime guard at each consumer provides the configuration message when env vars are absent.
type AuthUser = { id: string; email?: string; user_metadata: { role?: string } } | null;
type ClientShape = { auth: { getUser: () => Promise<{ data: { user: AuthUser } }> } & Record<string, any> } & Record<string, any>;
export const supabase: ClientShape = (url && anonKey ? createClient(url, anonKey) : null) as unknown as ClientShape;
