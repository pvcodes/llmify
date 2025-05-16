import { Suspense } from 'react';

import { getAuthenticatedUser } from '@/actions/misc';
import { Sidebar } from '@/components/ui/sidebar';

import { SidebarClient } from './app-sidebar-client';

export async function AppSidebar() {
  const user = await getAuthenticatedUser();

  return (
    <Sidebar className='border-r'>
      <Suspense fallback={<div className='p-4 text-muted'>Loading chats...</div>}>
        <SidebarClient userEmail={user.email} />
      </Suspense>
    </Sidebar>
  );
}
