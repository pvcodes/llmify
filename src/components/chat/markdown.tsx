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

// Configure Marked with Highlight.js
marked.use(
  markedHighlight({
    langPrefix: 'hljs language-',
    highlight: (code, lang) =>
      hljs.getLanguage(lang) ? hljs.highlight(code, { language: lang }).value : code,
  })
);

// Sanitization Config
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

// Enhance Code Blocks
const enhanceCodeBlocks = (container: HTMLDivElement) => {
  return Array.from(container.querySelectorAll('pre code')).map((block) => {
    const pre = block.parentElement;
    if (!pre) return '';

    const code = block.textContent || '';
    const lang = block.className.match(/language-(\w+)/)?.[1] || 'text';

    const wrapper = document.createElement('div');
    wrapper.className = 'relative mb-4 border rounded-md bg-gray-900 text-sm shadow-sm';

    const header = document.createElement('div');
    header.className = 'flex justify-between items-center bg-gray-800 p-1 text-xs text-gray-300';
    header.innerHTML = `<span class="pl-2">${lang.toUpperCase()}</span>`;

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

  // Process and sanitize markdown content
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

  // Copy Handlers
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
          'text-sm relative w-full max-w-2xl mb-2 bg-gray-100 dark:bg-gray-800 p-2 rounded-lg',
          className
        )}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        <div className='flex items-center mb-3'>
          <BotIcon className='w-6 h-6 p-1 bg-gray-200 dark:bg-gray-700 rounded text-gray-800 dark:text-gray-200 shadow-sm' />
        </div>

        <div
          ref={containerRef}
          className={cn(
            styles.markdown,
            'prose dark:prose-invert max-w-none text-gray-800 dark:text-gray-200 m-0'
          )}
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
