import { PenLine } from 'lucide-react';
import React, { useState, useRef } from 'react';

import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';

interface UserMessageBoxProps {
  handleEditMessageSubmit: (
    e: React.FormEvent,
    messageId: string,
    index: number,
    content: string
  ) => void;
  index: number;
  message: {
    content: string;
    id: string;
  };
}

export default function UserMessage({
  index,
  message,
  handleEditMessageSubmit,
}: UserMessageBoxProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(message.content);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [showActions, setShowActions] = useState(false);
  const isMobile = useIsMobile();

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      const start = e.currentTarget.selectionStart;
      const end = e.currentTarget.selectionEnd;
      setContent(content.substring(0, start) + '\n' + content.substring(end));
    } else if (e.key === 'Enter' && !e.shiftKey && !e.metaKey) {
      e.preventDefault();
      if (content.trim() !== message.content) {
        handleEditMessageSubmit(e, message.id, index, content);
      }
      setIsEditing(false);
    }
  };

  const submitEdit = (e: React.FormEvent) => {
    if (content.trim() !== message.content) {
      handleEditMessageSubmit(e, message.id, index, content);
    }
    setIsEditing(false);
  };

  return (
    <div className='flex justify-end py-2'>
      <div className='relative group'>
        {isEditing ? (
          <div className='w-full max-w-lg'>
            <Textarea
              ref={textareaRef}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onKeyDown={handleKeyDown}
              className='min-h-[120px] text-sm border border-input'
            />
            <div className='flex justify-end gap-2 mt-2'>
              <Button variant='ghost' size='sm' onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
              <Button size='sm' onClick={submitEdit}>
                Save
              </Button>
            </div>
          </div>
        ) : (
          <p
            className={cn(
              'bg-secondary px-3 py-2 text-sm max-w-lg border',
              'cursor-pointer',
              (isMobile || showActions) && 'group-hover:bg-secondary/80'
            )}
            onClick={() => isMobile && setShowActions(true)}
          >
            {message.content}
          </p>
        )}
        <Button
          className={cn(
            'absolute -top-2 -left-8 opacity-0 group-hover:opacity-100 transition-opacity',
            showActions && 'opacity-100'
          )}
          size='icon'
          variant='ghost'
          onClick={() => {
            setShowActions(true);
            setIsEditing(true);
            setTimeout(() => textareaRef.current?.focus(), 10);
          }}
        >
          <PenLine className='w-4 h-4' />
        </Button>
      </div>
    </div>
  );
}
