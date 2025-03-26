'use client';

import { Check, PenLine, X } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

import { useSidebar } from './ui/sidebar';

import type { Chat } from '@prisma/client';

interface ChatNameEditableProps {
  chat: Chat;
  className?: string;
}

export default function ChatNameEditable({ chat, className }: ChatNameEditableProps) {
  const [name, setName] = useState(chat.name ?? chat.id);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { setOpenMobile } = useSidebar();
  const pathName = usePathname();
  const isChatRoute = pathName.startsWith('/chat');
  const currentRouteChatId = isChatRoute ? pathName.split('/').pop() : null;

  // Update local state if chat name changes externally
  useEffect(() => {
    setName(chat.name ?? chat.id);
  }, [chat.name, chat.id]);

  // Focus and select text when editing starts
  useEffect(() => {
    if (isEditing && inputRef.current) {
      // Small timeout to ensure DOM is ready
      setTimeout(() => {
        inputRef.current?.focus();
        inputRef.current?.select();
      }, 0);
    }
  }, [isEditing]);

  const handleSave = async () => {
    const trimmedName = name.trim();

    // Don't send unnecessary API requests
    if (!trimmedName || trimmedName === chat.name) {
      setIsEditing(false);
      return;
    }

    try {
      setIsLoading(true);

      const res = await fetch(`/api/x/chat/${chat.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: trimmedName }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to update chat name');
      }
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving chat name:', error);
      // Reset to original name on error
      setName(chat.name ?? chat.id);
      toast('Chat title already exists, try another');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setName(chat.name ?? chat.id);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSave();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      handleCancel();
    }
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsEditing(true);
  };

  return (
    <div
      className={cn(
        'flex items-center w-full px-2 py-1.5 hover:bg-muted rounded-md group/chat',
        currentRouteChatId === chat.id ? 'dark:bg-gray-600 bg-gray-200' : '',
        className
      )}
      onClick={(e) => e.stopPropagation()}
    >
      {isEditing ? (
        <div className='flex items-center gap-2 w-full'>
          <Input
            ref={inputRef}
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            className='h-6 text-sm'
            maxLength={50}
            aria-label='Edit chat name'
          />
          <Button
            variant='ghost'
            size='icon'
            className='h-6 w-6 shrink-0'
            onClick={handleSave}
            disabled={isLoading}
            aria-label='Save'
            type='button'
          >
            <Check className='h-3 w-3 text-green-600' />
          </Button>
          <Button
            variant='ghost'
            size='icon'
            className='h-6 w-6 shrink-0'
            onClick={handleCancel}
            disabled={isLoading}
            aria-label='Cancel'
            type='button'
          >
            <X className='h-3 w-3 text-red-600' />
          </Button>
        </div>
      ) : (
        <div className='flex items-center w-full justify-between'>
          <Link
            href={`/chat/${chat.id}`}
            className='flex-1 truncate'
            title={name}
            onClick={() => setOpenMobile(false)}
          >
            <span className='whitespace-nowrap overflow-hidden text-ellipsis block w-[250px] md:w-full'>
              {name}
            </span>
          </Link>
          <Button
            variant='ghost'
            size='icon'
            className='h-5 w-5 opacity-100 lg:opacity-0 lg:group-hover/chat:opacity-100 ransition-opacity ml-1 shrink-0'
            onClick={handleEditClick}
            aria-label='Edit chat name'
            type='button'
          >
            <PenLine className='h-3 w-3 text-muted-foreground' />
          </Button>
        </div>
      )}
    </div>
  );
}
