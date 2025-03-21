import React, { useEffect, useState, useRef } from 'react';
import { marked } from 'marked';
import { markedHighlight } from 'marked-highlight';
import sanitizeHtml from 'sanitize-html';
import hljs from 'highlight.js';
import 'highlight.js/styles/atom-one-dark.css';
import styles from './markdown.module.css';
import copy from 'copy-to-clipboard';
import { cn } from '@/lib/utils';
import CopyButton from '../copy-button';
import { useIsMobile } from '@/hooks/use-mobile';
import { BotIcon } from 'lucide-react';

// Configure Marked with syntax highlighting once
marked.use(
    markedHighlight({
        langPrefix: 'hljs language-',
        highlight(code: string, lang: string) {
            const language = hljs.getLanguage(lang) ? lang : 'plaintext';
            return hljs.highlight(code, { language }).value;
        }
    })
);

// Sanitization config
const sanitizeConfig = {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat([
        'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'pre', 'code',
        'blockquote', 'ul', 'ol', 'li', 'a', 'strong', 'em', 'p'
    ]),
    allowedAttributes: {
        ...sanitizeHtml.defaults.allowedAttributes,
        '*': ['class', 'id'],
        'code': ['class'],
        'pre': ['class'],
        'a': ['href', 'target', 'rel']
    }
};

interface MarkdownProps {
    markdown: string;
    className?: string;
}

interface CopyButtonElement extends HTMLElement {
    getAttribute(name: string): string | null;
    innerHTML: string;
}

const Markdown: React.FC<MarkdownProps> = ({ markdown, className }) => {
    const [htmlContent, setHtmlContent] = useState<string>('');
    const markdownContainerRef = useRef<HTMLDivElement>(null);
    const isMobile = useIsMobile();

    useEffect(() => {
        if (!markdown) return;

        const renderMarkdown = async (): Promise<void> => {
            // Parse markdown to HTML
            const parsedContent = await marked(markdown, { gfm: true, breaks: true });

            // Sanitize HTML
            const sanitized = sanitizeHtml(parsedContent, sanitizeConfig);

            // Process code blocks with language headers and copy buttons
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = sanitized;

            // Enhance code blocks
            enhanceCodeBlocks(tempDiv);

            setHtmlContent(tempDiv.innerHTML);
        };

        renderMarkdown();
    }, [markdown]);

    // Handle copy button clicks
    useEffect(() => {
        const handleCopyClick = (e: Event): void => {
            const target = e.target as CopyButtonElement;
            if (target.classList.contains('copy-code-button')) {
                const content = target.getAttribute('data-clipboard-content');
                if (content) {
                    copy(content);
                    const originalText = target.innerHTML;
                    target.innerHTML = 'Copied!';
                    setTimeout(() => {
                        target.innerHTML = originalText;
                    }, 2000);
                }
            }
        };

        const container = markdownContainerRef.current;
        if (container) {
            container.addEventListener('click', handleCopyClick);
            return () => container.removeEventListener('click', handleCopyClick);
        }
    }, [htmlContent]);

    // Apply syntax highlighting after rendering
    useEffect(() => {
        if (htmlContent && markdownContainerRef.current) {
            const codeBlocks = markdownContainerRef.current.querySelectorAll('pre code');
            codeBlocks.forEach(block => hljs.highlightElement(block as HTMLElement));
        }
    }, [htmlContent]);

    return (
        <div className={cn("relative max-w-sm lg:max-w-2xl bg-gray-100 p-2.5 dark:bg-gray-800 rounded-lg group text-sm my-1", className)}>
            <BotIcon className="w-8 h-8 bg-gray-50 rounded p-1 text-black dark:text-white dark:bg-gray-800 mb-2" />
            <div className="w-full">
                <div
                    ref={markdownContainerRef}
                    className={cn(styles.markdown)}
                    dangerouslySetInnerHTML={{ __html: htmlContent }}
                />
            </div>
            <div className={cn(
                'absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200',
                isMobile && 'opacity-100'
            )}>
                <CopyButton content={markdown} className="w-4 h-4 bg-none bg-accent-background" />
            </div>
        </div>
    );
};

// Helper function to enhance code blocks
function enhanceCodeBlocks(container: HTMLDivElement): void {
    const codeBlocks = container.querySelectorAll('pre code');

    codeBlocks.forEach((block, index) => {
        const parentPre = block.parentElement;
        if (!parentPre) return;

        // Reset pre styling
        parentPre.style.padding = '0';
        parentPre.style.margin = '0';

        // Get code content and language
        const codeContent = block.textContent || '';
        const classAttr = block.getAttribute('class');
        const match = classAttr?.match(/language-(\w+)/);
        const language = match ? match[1].toUpperCase() : 'TEXT';

        // Create unique ID
        const codeBlockId = `code-block-${index}`;
        block.setAttribute('id', codeBlockId);

        // Preserve syntax highlighting classes
        if (classAttr) {
            block.setAttribute('class', `${classAttr} hljs`);
        }

        // Create wrapper with language header and copy button
        const wrapper = document.createElement('div');
        wrapper.className = 'relative mb-4 border border-gray-200 dark:border-gray-700 rounded-md overflow-hidden text-sm';

        const header = document.createElement('div');
        header.className = 'flex justify-between items-center bg-gray-100 dark:bg-gray-800 p-2 text-xs font-mono text-gray-600 dark:text-gray-300';
        header.innerHTML = `<span>${language}</span>`;

        const copyButton = document.createElement('button');
        copyButton.className = 'copy-code-button text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition z-40';
        copyButton.innerHTML = 'Copy';
        copyButton.setAttribute('data-clipboard-content', codeContent);
        copyButton.setAttribute('data-code-id', codeBlockId);

        header.appendChild(copyButton);
        wrapper.appendChild(header);
        wrapper.appendChild(parentPre.cloneNode(true));

        parentPre.replaceWith(wrapper);
    });
}

export default Markdown;