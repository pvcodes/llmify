'use client';
import { Menu, Plus } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';

import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

import ModeToggle from './mode-toggle';
import SelectAiModel from './select-ai-model';
import { Button } from './ui/button';
import { SidebarTrigger } from './ui/sidebar';
import User from './user-menu';

import type { BillingLevel } from '@prisma/client';

export default function Navbar({ tier }: { tier: BillingLevel }) {
  const pathName = usePathname();
  const router = useRouter();
  const [sheetOpen, setSheetOpen] = useState(false);
  const isNewChatRoute = pathName === '/new';

  const handleNewChat = () => {
    setSheetOpen(false);
    router.push('/new');
  };

  return (
    <nav className='sticky top-0 z-40 border-b bg-background'>
      <div className='flex items-center justify-between h-12 px-3'>
        <div className='flex items-center gap-2'>
          <SidebarTrigger />
          <ModeToggle />
        </div>

        <div className='hidden md:flex items-center gap-2'>
          <Button id='new-chat-btn' onClick={handleNewChat} size='sm' disabled={isNewChatRoute}>
            <Plus className='w-4 h-4 mr-1.5' />
            New
          </Button>
          <SelectAiModel id='model-selector' setSheetOpen={setSheetOpen} tier={tier} />
          <User />
        </div>

        <div className='md:hidden'>
          <Sheet onOpenChange={setSheetOpen} open={sheetOpen}>
            <SheetTrigger asChild>
              <Button variant='ghost' size='icon'>
                <Menu className='w-5 h-5' />
              </Button>
            </SheetTrigger>
            <SheetContent side='top' className='p-4 pt-12'>
              <div className='flex flex-col gap-3'>
                <Button onClick={handleNewChat} size='sm' disabled={isNewChatRoute}>
                  <Plus className='w-4 h-4 mr-2' />
                  New Chat
                </Button>
                <SelectAiModel setSheetOpen={setSheetOpen} tier={tier} />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
