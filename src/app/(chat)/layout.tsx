import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { getAuthenticatedUser, getUserTierDetails } from '@/actions/misc';
import { AppSidebar } from '@/components/app-sidebar';
import Navbar from '@/components/navbar';
import { OnboardingTourWrapper } from '@/components/onboarding-tour-wrapper';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';

export default async function Layout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get('sidebar_state')?.value === 'true';
  const user = await getAuthenticatedUser();
  if (!user) return redirect('/');

  const userBillingDetails = await getUserTierDetails(user?.email);
  if (!userBillingDetails) return;

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <AppSidebar />
      <SidebarInset>
        <main className='w-full'>
          <Navbar tier={userBillingDetails?.level} />
          <OnboardingTourWrapper userId={user.id} />
          <div className='flex flex-col flex-1 min-h-0'>{children}</div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
