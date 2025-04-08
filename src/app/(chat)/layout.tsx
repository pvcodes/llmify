import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { getAuthenticatedUser, getUserTierDetails } from '@/actions/misc';
import { AppSidebar } from '@/components/app-sidebar';
import Navbar from '@/components/navbar';
import { SidebarProvider } from '@/components/ui/sidebar';

export default async function Layout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get('sidebar_state')?.value === 'true';
  const user = await getAuthenticatedUser();
  if (!user) return redirect('/'); // Landing Page

  const userBillingDetails = await getUserTierDetails(user?.email);
  if (!userBillingDetails) return; // should not be here, 'default level is FREE, it will never fail, until DB is down'

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <div className='w-full'>
        <div className='flex'>
          <AppSidebar />
          <div className='w-full'>
            <Navbar tier={userBillingDetails?.level} />
            {children}
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}
