'use client';
import { Message } from "@ai-sdk/react";
import React, { memo } from "react";
import ReactMarkdown from "react-markdown";
import markdownComponents from "./markdown-components";
import { Button } from "../ui/button";
import { Copy } from "lucide-react";

const ChatMessage = memo(({ message }: { message: Message }) => {
    const messageContent = getMessageContent(message);

    return (
        <div className={`lg:min-w-[200px] min-w-[150px] max-w-2xl p-2 rounded-lg border-1`}>
            <div className="text-xs font-medium text-gray-500 flex justify-between items-center mb-2 relative pt-2">
                <span>{message.role === 'user' ? 'You' : 'Assistant'}</span>
                {
                    message.role === 'assistant' &&
                    <Button className="absolute right-0" size='icon' variant='ghost' onClick={() => navigator.clipboard.writeText(messageContent)}>
                        <Copy className="w-4 h-4" />
                    </Button>
                }
            </div>

            <div className="whitespace-pre-wrap text-sm leading-relaxed">
                {message.role === 'assistant' ? (
                    <div className="prose prose-sm dark:prose-invert">
                        <ReactMarkdown components={markdownComponents}>
                            {messageContent}
                        </ReactMarkdown>
                    </div>
                ) : (
                    <p>{messageContent}</p>
                )}
            </div>

            {message.createdAt && (
                <div className="text-xs text-gray-400 mt-2">
                    {new Date(message.createdAt).toLocaleTimeString()}
                </div>
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
