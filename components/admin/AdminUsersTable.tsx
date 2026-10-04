'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { supabase } from '@/lib/supabase/client';
import { copy } from '@/lib/i18n';
import { useLocale } from '@/components/LocaleProvider';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

type Profile = {
  id: string;
  full_name?: string | null;
  role: string;
  created_at: string;
};

export default function AdminUsersTable() {
  const { locale } = useLocale();
  const t = (copy[locale] as any)?.adminPage || {};
  const [users, setUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [search, setSearch] = useState<string>('');
  const [roleFilter, setRoleFilter] = useState<'all' | 'admin' | 'customer'>('all');

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError('');
      const { data, error } = await supabase
        .from('profiles')
        .select('id,full_name,role,created_at')
        .order('created_at', { ascending: false });
      if (error) {
        setError(error.message);
      } else {
        setUsers(data as Profile[]);
      }
      setLoading(false);
    }
    void load();
  }, []);

  const handleRoleChange = async (id: string, newRole: string) => {
    const { error } = await supabase.from('profiles').update({ role: newRole }).eq('id', id);
    if (error) {
      alert('Failed to update role: ' + error.message);
    } else {
      setUsers((prev) =>
        prev.map((u) => (u.id === id ? { ...u, role: newRole } : u))
      );
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this user profile permanently?')) return;
    const { error } = await supabase.from('profiles').delete().eq('id', id);
    if (error) {
      alert('Failed to delete user: ' + error.message);
    } else {
      setUsers((prev) => prev.filter((u) => u.id !== id));
    }
  };

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchesSearch =
        search === '' ||
        (u.full_name && u.full_name.toLowerCase().includes(search.toLowerCase())) ||
        u.id.toLowerCase().includes(search.toLowerCase());
      const matchesRole =
        roleFilter === 'all' ||
        (roleFilter === 'admin' && u.role === 'admin') ||
        (roleFilter === 'customer' && u.role !== 'admin');
      return matchesSearch && matchesRole;
    });
  }, [users, search, roleFilter]);

  if (loading) {
    return (
      <div className="py-8 text-center text-sm text-gray-500 dark:text-gray-400">
        {t.loading || 'Loading users...'}
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 rounded-md bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 text-sm">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Single filter / search row */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="inline-flex rounded-lg p-0.5 bg-gray-100 dark:bg-stone-800 text-xs font-medium">
          <button
            type="button"
            onClick={() => setRoleFilter('all')}
            className={`px-3 py-1.5 rounded-md transition ${
              roleFilter === 'all'
                ? 'bg-white dark:bg-stone-900 text-forestGreen dark:text-sandBeige shadow-sm font-semibold'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900'
            }`}
          >
            All ({users.length})
          </button>
          <button
            type="button"
            onClick={() => setRoleFilter('customer')}
            className={`px-3 py-1.5 rounded-md transition ${
              roleFilter === 'customer'
                ? 'bg-white dark:bg-stone-900 text-forestGreen dark:text-sandBeige shadow-sm font-semibold'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900'
            }`}
          >
            Customers ({users.filter((u) => u.role !== 'admin').length})
          </button>
          <button
            type="button"
            onClick={() => setRoleFilter('admin')}
            className={`px-3 py-1.5 rounded-md transition ${
              roleFilter === 'admin'
                ? 'bg-white dark:bg-stone-900 text-forestGreen dark:text-sandBeige shadow-sm font-semibold'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900'
            }`}
          >
            Admins ({users.filter((u) => u.role === 'admin').length})
          </button>
        </div>

        <div className="relative w-full sm:w-64">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name or ID..."
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-gray-200 dark:border-stone-700 bg-white dark:bg-stone-900 text-charcoal dark:text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-forestGreen"
          />
        </div>
      </div>

      {/* Compact Table */}
      <div className="rounded-lg border border-gray-200 dark:border-stone-800 bg-white dark:bg-stone-900 overflow-x-auto shadow-sm">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-stone-800 text-left">
          <thead className="bg-gray-50 dark:bg-stone-800/60">
            <tr>
              <th className="px-4 py-2.5 text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                User ID
              </th>
              <th className="px-4 py-2.5 text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                Full Name
              </th>
              <th className="px-4 py-2.5 text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                Role
              </th>
              <th className="px-4 py-2.5 text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                Created
              </th>
              <th className="px-4 py-2.5 text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-stone-800 text-sm">
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-xs text-gray-500">
                  No users found.
                </td>
              </tr>
            ) : (
              filteredUsers.map((u) => {
                const isAdmin = u.role === 'admin';
                return (
                  <tr key={u.id} className="hover:bg-gray-50/50 dark:hover:bg-stone-800/30 transition-colors">
                    <td className="px-4 py-2.5 text-xs font-mono text-gray-500 dark:text-gray-400">
                      {u.id.slice(0, 8)}…
                    </td>
                    <td className="px-4 py-2.5 font-medium text-gray-900 dark:text-gray-100">
                      {u.full_name || 'Standard User'}
                    </td>
                    <td className="px-4 py-2.5">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                          isAdmin
                            ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                            : 'bg-gray-100 text-gray-700 dark:bg-stone-800 dark:text-gray-300'
                        }`}
                      >
                        {isAdmin ? 'Admin' : 'Customer'}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 text-xs text-gray-500 dark:text-gray-400">
                      {new Date(u.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-2.5 text-right space-x-1.5 whitespace-nowrap">
                      <button
                        type="button"
                        className="px-2.5 py-1 text-xs font-medium rounded border border-gray-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-stone-700 transition"
                        onClick={() => handleRoleChange(u.id, isAdmin ? 'customer' : 'admin')}
                      >
                        Make {isAdmin ? 'Customer' : 'Admin'}
                      </button>
                      <button
                        type="button"
                        className="px-2.5 py-1 text-xs font-medium rounded text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition"
                        onClick={() => handleDelete(u.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
