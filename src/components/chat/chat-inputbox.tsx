'use client';

// Need Optimizations, and more
import React, { useCallback, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2, SendHorizonal } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useIsMobile } from "@/hooks/use-mobile";

interface ChatInputBoxProps {
    input: string;
    onInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    onSubmit: (e: React.FormEvent) => void;
    setInput?: (value: string) => void;
    isDisabled?: boolean;
    isLoading?: boolean;
    placeholder?: string;
    showShortcuts?: boolean;
    maxHeight?: number;
    tokenInfo?: {
        usage: number;
        limit: number;
    };
    inputRef: React.RefObject<HTMLTextAreaElement | null>
}

export default function ChatInputBox({
    input,
    onInputChange,
    onSubmit,
    setInput,
    inputRef,
    isDisabled = false,
    placeholder = "Type a message...",
    showShortcuts = true,
    maxHeight = 150,
    tokenInfo,
    isLoading = false
}: ChatInputBoxProps) {
    const isMobile = useIsMobile();
    const isMac = typeof navigator !== 'undefined' ? navigator.platform.includes('Mac') : false;

    // Handle keyboard shortcuts
    const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        // If Ctrl+Enter or Cmd+Enter is pressed, insert a new line
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            e.preventDefault();

            if (setInput) {
                const start = e.currentTarget.selectionStart;
                const end = e.currentTarget.selectionEnd;
                const newValue = input.substring(0, start) + '\n' + input.substring(end);
                setInput(newValue);

                // Set cursor position after inserted newline
                setTimeout(() => {
                    if (inputRef?.current) {
                        inputRef.current.selectionStart = start + 1;
                        inputRef.current.selectionEnd = start + 1;
                        inputRef.current.focus();
                    }
                }, 0);
            }
        } else if (e.key === 'Enter' && !e.shiftKey && !e.ctrlKey && !e.metaKey) {
            // Regular Enter without modifier keys submits the form
            e.preventDefault();
            onSubmit(e);
        }
    }, [input, setInput, onSubmit, inputRef]);

    // Auto-resize textarea based on content
    useEffect(() => {
        if (inputRef?.current) {
            inputRef.current.style.height = 'auto';
            inputRef.current.style.height = `${Math.min(inputRef.current.scrollHeight, maxHeight)}px`;
        }
    }, [input, maxHeight, inputRef]);

    return (
        <div className="w-full flex flex-col gap-2 p-2.5">
            <form onSubmit={onSubmit} className="flex items-center gap-2 w-full">
                <Textarea
                    ref={inputRef}
                    className="flex-1 rounded-lg py-2 px-3 text-sm sm:text-base min-h-[40px] resize-none"
                    style={{ maxHeight: `${maxHeight}px` }}
                    value={input}
                    placeholder={placeholder}
                    onChange={onInputChange}
                    onKeyDown={handleKeyDown}
                    disabled={isDisabled}
                    aria-label="Message input"
                    rows={1}
                />
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                type="submit"
                                size="icon"
                                className="rounded-full w-10 h-10 sm:w-12 sm:h-12"
                                disabled={!input.trim() || isDisabled || isLoading}
                                aria-label="Send message"

                            >
                                {isLoading ? <Loader2 className="animate-spin" /> : <SendHorizonal className="w-5 h-5" />}
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>Send message</TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </form>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted-foreground w-full">
                {showShortcuts && !isMobile && (
                    <span className="hidden sm:inline">
                        Press <kbd className="px-1 py-0.5 bg-muted rounded border">Enter</kbd> to send,{' '}
                        <kbd className="px-1 py-0.5 bg-muted rounded border">{isMac ? 'Cmd' : 'Ctrl'}</kbd>+
                        <kbd className="px-1 py-0.5 bg-muted rounded border">Enter</kbd> for new line
                    </span>
                )}

                {tokenInfo && (
                    <span className="px-2 py-1 rounded-md border border-gray-200 dark:border-gray-700 shadow-sm">
                        Token usage: <span className="font-semibold text-primary">{tokenInfo.usage}</span> / <span className="font-semibold">{tokenInfo.limit}</span>
                    </span>
                )}
            </div>
        </div>
    );
}