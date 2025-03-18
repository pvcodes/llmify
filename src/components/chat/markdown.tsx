/**
 Shit code?, But hey, it just work: got something better raise a PR and get 20$ bounty
 */
import React, { useEffect, useState, useRef } from 'react';
import { marked } from 'marked';
import { markedHighlight } from 'marked-highlight';
import sanitizeHtml from 'sanitize-html';
import hljs from 'highlight.js';
import 'highlight.js/styles/atom-one-dark.css'; // Keep this import
import styles from './markdown.module.css';
import copy from 'copy-to-clipboard';

interface MarkdownRendererProps {
    markdown: string;
    className?: string;
}

// Configure Marked with syntax highlighting
marked.use(
    markedHighlight({
        langPrefix: 'hljs language-',
        highlight(code, lang) {
            const language = hljs.getLanguage(lang) ? lang : 'plaintext';
            return hljs.highlight(code, { language }).value;
        }
    })
);

const Markdown: React.FC<MarkdownRendererProps> = ({ markdown, className }) => {
    const [htmlContent, setHtmlContent] = useState('');
    const markdownContainerRef = useRef<HTMLDivElement>(null);

    // Process the markdown
    useEffect(() => {
        if (!markdown) return;

        const parseMarkdown = async () => {
            const parsedContent = await marked(markdown, { gfm: true, breaks: true });

            // Sanitize HTML to prevent XSS
            const sanitized = sanitizeHtml(parsedContent, {
                allowedTags: sanitizeHtml.defaults.allowedTags.concat([
                    'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'pre', 'code', 'blockquote', 'ul', 'ol', 'li', 'a', 'strong', 'em', 'p'
                ]),
                allowedAttributes: {
                    ...sanitizeHtml.defaults.allowedAttributes,
                    '*': ['class', 'id'],
                    'code': ['class'],
                    'pre': ['class'],
                    'a': ['href', 'target', 'rel']
                },
            });

            // Process and insert language headers with copy buttons
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = sanitized;

            const codeBlocks = tempDiv.querySelectorAll('pre code');
            codeBlocks.forEach((block, index) => {
                const parentPre = block.parentElement;
                if (!parentPre) return;

                // Remove default padding from pre tags
                parentPre.style.padding = '0';
                parentPre.style.margin = '0';

                // Extract code content for copying
                const codeContent = block.textContent || '';

                // Detect language
                const classAttr = block.getAttribute('class');
                const match = classAttr?.match(/language-(\w+)/);
                const detectedLanguage = match ? match[1].toUpperCase() : 'TEXT';

                // Create a unique ID for this code block
                const codeBlockId = `code-block-${index}`;
                block.setAttribute('id', codeBlockId);

                // Ensure syntax highlighting classes are preserved
                if (classAttr) {
                    block.setAttribute('class', `${classAttr} hljs`);
                }

                // Wrap with a language header and copy button
                const wrapperDiv = document.createElement('div');
                wrapperDiv.className = 'relative mb-4 border border-gray-200 dark:border-gray-700 rounded-md overflow-hidden text-sm';

                const headerDiv = document.createElement('div');
                headerDiv.className = 'flex justify-between items-center bg-gray-100 dark:bg-gray-800 p-2 text-xs font-mono text-gray-600 dark:text-gray-300';
                headerDiv.innerHTML = `<span>${detectedLanguage}</span>`;

                // Create copy button with data attribute to store content
                const copyButton = document.createElement('button');
                copyButton.className = 'copy-code-button text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition z-40';
                copyButton.innerHTML = 'Copy';
                copyButton.setAttribute('data-clipboard-content', codeContent);
                copyButton.setAttribute('data-code-id', codeBlockId);

                headerDiv.appendChild(copyButton);
                wrapperDiv.appendChild(headerDiv);

                // Append code block to wrapper
                wrapperDiv.appendChild(parentPre.cloneNode(true));
                parentPre.replaceWith(wrapperDiv);
            });

            setHtmlContent(tempDiv.innerHTML);
        };

        parseMarkdown();
    }, [markdown]);

    // Add event listener for copy buttons after content is rendered
    useEffect(() => {
        const handleCopyClick = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
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

        // Add event listener to the markdown container
        const container = markdownContainerRef.current;
        if (container) {
            container.addEventListener('click', handleCopyClick as EventListener);
        }

        // Cleanup function
        return () => {
            if (container) {
                container.removeEventListener('click', handleCopyClick as EventListener);
            }
        };
    }, [htmlContent]); // Re-run when htmlContent changes

    // Force highlighting after content is rendered
    useEffect(() => {
        if (htmlContent && markdownContainerRef.current) {
            // Force highlight.js to re-highlight all code blocks
            const codeBlocks = markdownContainerRef.current.querySelectorAll('pre code');
            codeBlocks.forEach((block) => {
                hljs.highlightElement(block as HTMLElement);
            });
        }
    }, [htmlContent]);

    return (
        <div className="w-full">
            <div
                ref={markdownContainerRef}
                className={`${styles.markdown} ${className || ''}`}
                dangerouslySetInnerHTML={{ __html: htmlContent }}
            />
        </div>
    );
};

export default Markdown