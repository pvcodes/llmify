'use client';

import copy from 'copy-to-clipboard';
import { motion } from 'framer-motion';
import hljs from 'highlight.js';
import { BotIcon, Copy, Check } from 'lucide-react';
import { marked } from 'marked';
import { markedHighlight } from 'marked-highlight';
import React, { useCallback, useEffect, useState, useRef } from 'react';
import sanitizeHtml from 'sanitize-html';

import 'highlight.js/styles/atom-one-dark.css';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

import styles from './markdown.module.css';

import type { UIMessage } from 'ai';

marked.use(
  markedHighlight({
    langPrefix: 'hljs language-',
    highlight: (code, lang) =>
      hljs.getLanguage(lang) ? hljs.highlight(code, { language: lang }).value : code,
  })
);

const SANITIZE_CONFIG = {
  allowedTags: [
    'h1',
    'h2',
    'h3',
    'h4',
    'h5',
    'h6',
    'pre',
    'code',
    'blockquote',
    'ul',
    'ol',
    'li',
    'a',
    'strong',
    'em',
    'p',
    'span',
  ],
  allowedAttributes: {
    '*': ['class', 'id'],
    a: ['href', 'target', 'rel'],
    code: ['class'],
    pre: ['class'],
  },
};

interface MarkdownProps {
  message: UIMessage;
  className?: string;
}

const enhanceCodeBlocks = (container: HTMLDivElement) => {
  return Array.from(container.querySelectorAll('pre code')).map((block) => {
    const pre = block.parentElement;
    if (!pre) return '';

    const code = block.textContent || '';
    const lang = block.className.match(/language-(\w+)/)?.[1] || 'text';

    const wrapper = document.createElement('div');
    wrapper.className = 'relative mb-4 border bg-card';

    const header = document.createElement('div');
    header.className =
      'flex justify-between items-center bg-muted px-3 py-1.5 text-xs text-muted-foreground border-b';
    header.innerHTML = `<span>${lang.toUpperCase()}</span>`;

    wrapper.append(header, pre.cloneNode(true));
    pre.replaceWith(wrapper);

    return code;
  });
};

const Markdown = React.memo(({ message, className }: MarkdownProps) => {
  const [html, setHtml] = useState('');
  const [codeContents, setCodeContents] = useState<string[]>([]);
  const [copied, setCopied] = useState({ full: false, code: false });
  const [isHovering, setIsHovering] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const processMessage = useCallback(async () => {
    if (!message?.parts?.length) return setHtml('');

    const markdown = message.parts.map((part) => (part.type === 'text' ? part.text : '')).join('');
    try {
      const parsed = await marked(markdown, { gfm: true, breaks: true });
      const sanitized = sanitizeHtml(parsed, SANITIZE_CONFIG);

      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = sanitized;
      setCodeContents(enhanceCodeBlocks(tempDiv));
      setHtml(tempDiv.innerHTML);
    } catch (error) {
      console.error('Markdown render error:', error);
      setHtml('<p>Oops, something went wrong!</p>');
    }
  }, [message]);

  useEffect(() => {
    processMessage();
  }, [processMessage]);

  const handleCopy = useCallback(
    (type: 'full' | 'code') => {
      if (type === 'full') {
        copy(message.parts.map((part) => (part.type === 'text' ? part.text : '')).join(''));
      } else if (codeContents.length) {
        copy(codeContents.join('\n\n'));
      }
      setCopied((prev) => ({ ...prev, [type]: true }));
      setTimeout(() => setCopied((prev) => ({ ...prev, [type]: false })), 1500);
    },
    [message, codeContents]
  );

  return (
    <div className='relative'>
      <motion.div
        className={cn(
          'text-sm relative w-full max-w-2xl mb-2 bg-secondary p-3 border border-transparent',
          className
        )}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        <div className='flex items-center mb-3'>
          <div className='w-8 h-8 flex items-center justify-center bg-primary/10 border border-border'>
            <BotIcon className='w-5 h-5' />
          </div>
        </div>

        <div
          ref={containerRef}
          className={cn(styles.markdown, 'prose dark:prose-invert max-w-none text-foreground m-0')}
          dangerouslySetInnerHTML={{ __html: html }}
        />

        {(isHovering || copied.full || copied.code) && (
          <div className='absolute -bottom-5 right-2 flex space-x-2'>
            {codeContents.length > 0 && (
              <Button variant='outline' size='sm' onClick={() => handleCopy('code')}>
                {copied.code ? <Check className='h-3.5 w-3.5' /> : <Copy className='h-3.5 w-3.5' />}
                <span>{copied.code ? 'Copied' : 'Copy code'}</span>
              </Button>
            )}
            <Button variant='secondary' size='sm' onClick={() => handleCopy('full')}>
              {copied.full ? <Check className='h-3.5 w-3.5' /> : <Copy className='h-3.5 w-3.5' />}
              <span>{copied.full ? 'Copied' : 'Copy all'}</span>
            </Button>
          </div>
        )}
      </motion.div>
    </div>
  );
});

Markdown.displayName = 'Markdown';
export default Markdown;
