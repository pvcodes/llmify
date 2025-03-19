'use client';
import { Message } from "@ai-sdk/react";
import React, { memo } from "react";
import { BotIcon } from "lucide-react";
// import './MarkdownViewer.css';
import Markdown from "./markdown";
import { cn } from "@/lib/utils";
import CopyButton from "../copy-button";
import { useIsMobile } from "@/hooks/use-mobile";

const ChatMessage = memo(({ message, className }: { message: Message, className?: string }) => {
    const messageContent = getMessageContent(message);
    const isMobile = useIsMobile()
    return (
        <div
            className={cn(
                "flex flex-col text-sm",
                message.role === "user" ? "justify-end items-end" : "justify-start",
                className
            )}
        >
            {message.role === "assistant" ? (
                <div className="relative my-2 max-w-sm lg:max-w-2xl bg-gray-100 p-2.5 dark:bg-gray-800 rounded-lg group">
                    <BotIcon className="w-8 h-8 bg-gray-50 rounded p-1 text-black dark:text-white dark:bg-gray-800 mb-2" />
                    <Markdown markdown={messageContent} className="leading-relaxed" />
                    <div className={cn('absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200', isMobile && 'opacity-100')}>
                        <CopyButton content={messageContent} className="w-4 h-4 bg-none bg-accent-background" />
                    </div>
                </div>
            ) : (
                <p className="mt-2 max-w-sm leading-relaxed rounded-lg bg-gray-100 p-2.5 dark:bg-gray-800">
                    {messageContent}
                </p>
            )}
        </div>

    );
});

ChatMessage.displayName = 'ChatMessage';

export default ChatMessage;

export const getMessageContent = (message: Message): string => {
    if (typeof message.content === 'string') {
        return message.content;
    }
    if (message.parts?.length) {
        return message.parts
            .filter(part => part.type === 'text')
            .map(part => part.text || '')
            .join('');
    }
    return '';
};