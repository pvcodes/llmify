import { PenLine } from 'lucide-react';
import React, { useState, useRef } from 'react';

import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';

interface UserMessageBoxProps {
  messageContent: string;
  handleEditMessageSubmit: (
    e: React.FormEvent,
    messageId: string,
    messageIndex: number,
    content: string
  ) => void;
  messageId: string;
  messageIndex: number;
}

export default function UserMessage({
  messageContent,
  handleEditMessageSubmit,
  messageId,
  messageIndex,
}: UserMessageBoxProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(messageContent);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const isMobile = useIsMobile();

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      const start = e.currentTarget.selectionStart;
      const end = e.currentTarget.selectionEnd;
      setContent(content.substring(0, start) + '\n' + content.substring(end));
    } else if (e.key === 'Enter' && !e.shiftKey && !e.metaKey) {
      e.preventDefault();
      submitEdit(e);
    }
  };

  const toggleEdit = () => {
    setIsEditing(!isEditing);
    setTimeout(() => textareaRef.current?.focus(), 10);
  };

  const submitEdit = (e: React.FormEvent) => {
    if (content.trim() !== messageContent) {
      handleEditMessageSubmit(e, messageId, messageIndex, content);
    }
    setIsEditing(false);
  };

  return (
    <div className='flex justify-end my-2 font-sans'>
      <div className='relative group'>
        {isEditing ? (
          <div className='relative'>
            <Textarea
              ref={textareaRef}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onKeyDown={handleKeyDown}
              className='w-full min-h-[200px] resize-none'
            />
            <p className='text-xs text-muted-foreground text-right mt-1'>
              Press <kbd className='mx-1 border'>Enter</kbd> to send,
              <kbd className='ml-1 border'>Ctrl + Enter</kbd> for newline.
            </p>
            <div className='flex justify-end gap-2 mt-2'>
              <Button
                variant='secondary'
                onClick={() => {
                  setIsVisible(false);
                  setIsEditing(false);
                }}
              >
                Cancel
              </Button>
              <Button onClick={submitEdit}>Save</Button>
            </div>
          </div>
        ) : (
          <p
            className='bg-gray-100 dark:bg-gray-800 p-2.5 rounded-lg whitespace-pre-wrap max-w-sm md:max-w-lg'
            onClick={() => isMobile && setIsVisible(true)}
          >
            {messageContent}
          </p>
        )}
        <Button
          className={cn(
            'absolute top-1 -left-7 opacity-0 group-hover:opacity-100 transition-opacity',
            isVisible && 'opacity-100'
          )}
          size='icon'
          variant={null}
          onClick={toggleEdit}
        >
          {!isEditing && <PenLine className='w-4 h-4 text-accent-foreground' />}
        </Button>
      </div>
    </div>
  );
}
