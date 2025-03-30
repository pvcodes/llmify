import { MessageSquareDashed, PlusIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { getServerSession } from 'next-auth';

import { authOptions } from '@/app/(auth)/auth';
import { getChats } from '@/app/(chat)/chat/action';
import { Button, buttonVariants } from '@/components/ui/button';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { APP_NAME } from '@/lib/constant';
import { appImage } from '@/lib/images';

import ChatNameEditable from './chat-name-editable';

export async function AppSidebar() {
  const session = await getServerSession(authOptions);
  const chats = (await getChats(session?.user?.email as string)) || [];

  return (
    <Sidebar className='border-r'>
      {/* Sticky App Name with funky styling */}
      <div className='sticky top-0 z-10  p-2 flex items-center justify-between bg-gray-100 dark:bg-gray-600 h-18'>
        <div className='flex items-center gap-2'>
          <Image src={appImage} alt='App Logo' className='h-5 w-5 animate-pulse' />
          <span className='text-xl font-bold tracking-wider'>{APP_NAME}</span>
        </div>
        <Button variant='ghost' size='icon' className='h-8 w-8 rounded-full' asChild>
          <Link
            href='/new'
            aria-label='New Chat'
            className={`${buttonVariants({
              variant: 'outline',
            })}`}
          >
            <PlusIcon className='h-4 w-4' />
          </Link>
        </Button>
      </div>

      <SidebarContent className='pt-2'>
        <SidebarGroup>
          <SidebarGroupContent className='px-2'>
            <div className='flex items-center justify-between px-2 border-b'>
              <h2 className='text-sm font-medium text-muted-foreground uppercase tracking-wide'>
                Chats
              </h2>
            </div>
            <SidebarMenu className='mt-2'>
              {chats.length > 0 ? (
                chats.map((chat) => (
                  <SidebarMenuItem
                    key={chat.id}
                    className='py-1 hover:bg-muted rounded-md transition-colors relative group'
                  >
                    <ChatNameEditable chat={chat} />
                    <div className='absolute left-0 top-0 w-1 h-full opacity-0 group-hover:opacity-100 transition-opacity rounded-l-md' />
                  </SidebarMenuItem>
                ))
              ) : (
                <SidebarMenuItem>
                  <div className='flex flex-col items-center gap-2 py-6 text-center'>
                    <MessageSquareDashed className='h-6 w-6 text-muted-foreground' />
                    <p className='text-sm text-muted-foreground max-w-[200px]'>
                      No chats yet. Start a new conversation!
                    </p>
                  </div>
                </SidebarMenuItem>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
