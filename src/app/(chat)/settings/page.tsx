'use client';

import { useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';

import { APIKeysTab } from '@/components/settings/APIKeysTab';
import { NotificationsTab } from '@/components/settings/NotificationsTab';
import { PreferencesTab } from '@/components/settings/PreferencesTab';
import { useSidebar } from '@/components/ui/sidebar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function Settings() {
  const searchParams = useSearchParams();
  const { setOpen, open } = useSidebar();
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') ?? 'api-keys');

  useEffect(() => {
    if (open) setOpen(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className='flex flex-col flex-1 min-w-0 overflow-hidden py-4 sm:py-6 px-2 sm:px-4'>
      <div className='w-full max-w-xl mx-auto overflow-x-hidden min-w-0'>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className='grid grid-cols-3 w-full mb-6 min-w-0'>
            <TabsTrigger value='api-keys'>API Keys</TabsTrigger>
            <TabsTrigger value='preferences'>Preferences</TabsTrigger>
            <TabsTrigger value='notifications'>Notifications</TabsTrigger>
          </TabsList>

          <TabsContent value='api-keys'>
            <APIKeysTab />
          </TabsContent>
          <TabsContent value='preferences'>
            <PreferencesTab />
          </TabsContent>
          <TabsContent value='notifications'>
            <NotificationsTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
