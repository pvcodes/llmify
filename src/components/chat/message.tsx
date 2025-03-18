'use client';
import { Message } from "@ai-sdk/react";
import React, { memo } from "react";
import { BotIcon } from "lucide-react";
// import './MarkdownViewer.css';
import Markdown from "./markdown";
import { cn } from "@/lib/utils";

const ChatMessage = memo(({ message }: { message: Message }) => {
    const messageContent = getMessageContent(message);
    return (
        <div className={cn(['flex flex-col text-sm', message.role === 'user' ? 'justify-end items-end' : 'justify-start'])}>
            {message.role === 'assistant' ? (
                <div className="mb-2 max-w-sm lg:max-w-2xl">
                    <BotIcon className="w-8 h-8 bg-gray-50 rounded p-1 text-black dark:text-white dark:bg-gray-800 mb-2" />
                    <Markdown markdown={messageContent} className="text-sm leading-relaxed" />
                </div>
            ) : (
                <p className="mt-2 max-w-sm leading-relaxed rounded-lg bg-gray-100 p-2.5 dark:bg-gray-800" >{messageContent}</p>
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