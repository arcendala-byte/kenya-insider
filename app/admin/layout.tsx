import React, { PropsWithChildren } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';

export default function AdminRootLayout({ children }: PropsWithChildren<{}>) {
  return <AdminLayout>{children}</AdminLayout>;
}
