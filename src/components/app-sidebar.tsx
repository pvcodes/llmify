import { Suspense } from 'react';

import { getAuthenticatedUser } from '@/actions/misc';
import { Sidebar, SidebarContent } from '@/components/ui/sidebar';

import { SidebarClient } from './app-sidebar-client';

export async function AppSidebar() {
  const user = await getAuthenticatedUser();

  return (
    <Sidebar>
      <Suspense fallback={<div className='p-4 text-muted'>Loading chats...</div>}>
        <SidebarClient userEmail={user.email} />
      </Suspense>
      <SidebarContent className='pt-2'>
        <p className='text-xs text-muted-foreground px-3'>Recent</p>
      </SidebarContent>
    </Sidebar>
  );
}
