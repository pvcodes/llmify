'use client';

import { MessageSquareDashed, PlusIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

import { getChats } from '@/actions/chat-message';
import { Button, buttonVariants } from '@/components/ui/button';
import {
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { APP_NAME } from '@/lib/constant';
import { appImage } from '@/lib/images';

import ChatNameEditable from './chat-name-editable';

import type { Chat } from '@prisma/client';

export function SidebarClient({ userEmail }: { userEmail: string }) {
  const [chats, setChats] = useState<Chat[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const LIMIT = 20;

  useEffect(() => {
    async function fetchChats() {
      const { chats: newChats, pagination } = (await getChats(userEmail, LIMIT, page)) ?? {};
      if (newChats) {
        setChats((prev) => [...prev, ...newChats]);
        setHasMore(page < pagination.totalPages);
      }
    }

    fetchChats();
  }, [page, userEmail]);

  return (
    <>
      <div className='h-12 px-3 flex items-center justify-between border-b bg-sidebar'>
        <Link href='/new' className='flex items-center gap-2 group'>
          <Image src={appImage} alt='App Logo' className='h-5 w-5' />
          <span className='text-sm font-semibold tracking-tight font-display uppercase'>
            {APP_NAME}
          </span>
        </Link>
        <Button variant='ghost' size='icon' className='h-8 w-8' asChild>
          <Link href='/new' aria-label='New Chat'>
            <PlusIcon className='h-4 w-4' />
          </Link>
        </Button>
      </div>

      <SidebarContent className='pt-2'>
        <SidebarGroup>
          <SidebarGroupContent className='px-2'>
            <div className='flex items-center justify-between px-2 mb-2'>
              <h2 className='text-xs font-medium text-muted-foreground uppercase tracking-wider'>
                Conversations
              </h2>
            </div>

            <SidebarMenu className='gap-0.5'>
              {chats.length > 0 ? (
                chats.map((chat) => (
                  <SidebarMenuItem
                    key={chat.id}
                    className='py-1.5 hover:bg-secondary/30 hover:border-primary/30 border border-transparent transition-all'
                  >
                    <ChatNameEditable chat={chat} />
                  </SidebarMenuItem>
                ))
              ) : (
                <SidebarMenuItem>
                  <div className='flex flex-col items-center gap-3 py-10 text-center px-4'>
                    <MessageSquareDashed className='h-8 w-8 text-muted-foreground/40' />
                    <div className='space-y-1'>
                      <p className='text-sm font-medium'>No conversations</p>
                      <p className='text-xs text-muted-foreground'>Start a new chat to begin</p>
                    </div>
                    <Link
                      href='/new'
                      className={buttonVariants({
                        size: 'sm',
                        variant: 'outline',
                      })}
                    >
                      <PlusIcon className='h-3 w-3 mr-1.5' />
                      New chat
                    </Link>
                  </div>
                </SidebarMenuItem>
              )}
            </SidebarMenu>

            {hasMore && chats.length > 0 && (
              <div className='flex justify-center mt-3'>
                <Button variant='ghost' size='sm' onClick={() => setPage((p) => p + 1)}>
                  Load more
                </Button>
              </div>
            )}
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </>
  );
}
