'use client';
import { Menu } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';

import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

import ModeToggle from './ModeToggle';
import SelectAiModel from './select-ai-model';
import { Button } from './ui/button';
import { Separator } from './ui/separator';
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
    <nav className='sticky top-0 w-full border-b bg-background'>
      <div className='flex items-center gap-2 justify-between px-4 py-2'>
        <div className='flex items-center gap-2'>
          <SidebarTrigger />
          <div className='hidden md:block'>
            <ModeToggle />
          </div>
        </div>

        <div className='hidden md:flex items-center gap-2'>
          <Button onClick={handleNewChat} variant='secondary' disabled={isNewChatRoute}>
            New Chat
          </Button>
          <SelectAiModel setSheetOpen={setSheetOpen} tier={tier} />
          <User />
        </div>

        {/* Mobile menu */}
        <div className='md:hidden'>
          <Sheet onOpenChange={setSheetOpen} open={sheetOpen}>
            <SheetTrigger asChild>
              <Button variant='ghost' size='icon'>
                <Menu size={20} />
              </Button>
            </SheetTrigger>
            <SheetContent side='top' className='p-4'>
              <div className='flex justify-between'>
                <button onClick={() => setSheetOpen(false)}>
                  {' '}
                  <ModeToggle />{' '}
                </button>
                <User />
              </div>
              <div className='flex flex-col gap-2'>
                <Button onClick={handleNewChat} variant='secondary' disabled={isNewChatRoute}>
                  New Chat
                </Button>
                <SelectAiModel setSheetOpen={setSheetOpen} tier={tier} />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
      <Separator />
    </nav>
  );
}
