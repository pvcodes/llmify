'use client';

import { Message, useChat } from "@ai-sdk/react";
import { Button } from "@/components/ui/button";
import { RefreshCcw, Loader2, Settings } from "lucide-react";
import React, { useCallback, useEffect, useRef } from "react";
import useChatStore from "@/store/useChatStore";
import { toast } from "sonner";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { ModelProvidersViaTier, type ModelProviderType } from "@/lib/ai/models";
import { useRouter } from "next/navigation";
import { type Billing } from "@prisma/client";
import { MAX_FREE_TOKEN } from "@/lib/constant";
import ChatInputBox from "./chat-inputbox";
import ScrollToBottom from "../ScrollToBottom";
import { UIMessage } from "ai";
import Markdown from "./markdown";
import UserMessageBox from "./user-message-box";

interface ChatProps {
    id: string;
    initialMessages: Message[];
    isNew?: boolean;
    userBilling: Billing | null;
}

export default function Chat({ id, initialMessages, isNew = false, userBilling }: ChatProps) {
    const modelConfig = useChatStore(state => state.config);
    const getApiKey = useChatStore(state => state.getApiKey);
    const router = useRouter();

    // Refs
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const chatInputBoxRef = useRef<HTMLTextAreaElement | null>(null);

    // Rate limiting
    const lastSubmitTime = useRef(0);
    const RATE_LIMIT_MS = 1000;

    // Chat state
    const {
        messages,
        input,
        handleInputChange,
        handleSubmit,
        stop,
        status,
        error,
        reload,
        setInput,
        setMessages
    } = useChat({
        initialMessages,
    });

    // API key check
    const currProviderApiKey = modelConfig ? getApiKey(modelConfig.provider as ModelProviderType) : null;
    const isApiKeyRequired = !!(userBilling?.level && modelConfig?.provider &&
        !ModelProvidersViaTier[userBilling.level]?.includes(modelConfig.provider));

    // Scroll function
    const scrollToBottom = useCallback(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, []);


    // Scroll when streaming
    useEffect(() => {
        if (status === 'streaming' || status === 'submitted') {
            scrollToBottom();
        }
        return chatInputBoxRef.current?.focus();
    }, [status, scrollToBottom]);

    // Initialize new chat
    useEffect(() => {
        const fetchInitialResponse = async () => {
            if (isNew && modelConfig) {
                await reload({
                    body: { id, modelConfig, apiKey: await currProviderApiKey, messages },
                });
            }
        };
        fetchInitialResponse();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Form submission
    const handleFormSubmit = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();
        const now = Date.now();

        if (now - lastSubmitTime.current < RATE_LIMIT_MS) {
            toast("Please wait a moment before sending another message");
            return;
        }

        if (!input.trim() || status === 'streaming' || status === 'submitted') return;

        if (isApiKeyRequired) {
            toast("Please add your API key in settings");
            return;
        }

        lastSubmitTime.current = now;
        handleSubmit(e, {
            body: { id, modelConfig, apiKey: await currProviderApiKey },
        });
        router.refresh();
    }, [input, status, handleSubmit, modelConfig, id, currProviderApiKey, isApiKeyRequired, router]);

    // Retry handler
    const handleRetry = useCallback(async () => {
        if (status === 'error' && modelConfig) {
            await reload({
                body: { id, modelConfig, apiKey: await currProviderApiKey },
            });
        }
    }, [status, reload, modelConfig, currProviderApiKey, id]);

    const handleEditMessageSubmit = useCallback(async (e: React.FormEvent, messageId: string, messageIndex: number, content: string) => {
        e.preventDefault()
        const filterdMessages = messages.slice(0, messageIndex)
        const messageToUpdate = {
            id: messages[messageIndex].id,
            content: content,
            role: messages[messageIndex].role
        }
        console.log(messageToUpdate, 67890)
        filterdMessages.push(messageToUpdate as UIMessage) // had no other option, if you got, help us
        setMessages(filterdMessages)
        reload({
            body: { id, modelConfig, apiKey: await currProviderApiKey, messageId },
        });
        router.refresh()
    }, [currProviderApiKey, id, messages, modelConfig, reload, setMessages, router])

    return (

        <div className="flex flex-col relative min-h-screen max-w-4xl mx-auto">
            <div className="flex-1 overflow-y-auto">
                {messages.map((message, index) => (
                    <div key={message.id} className="flex flex-col my-2 px-1 md:p-4">
                        {message.role === "assistant" ? (
                            <Markdown markdown={message.content} />
                        ) : (
                            <UserMessageBox
                                messageContent={message.content}
                                handleEditMessageSubmit={handleEditMessageSubmit}
                                messageId={message.id}
                                messageIndex={index}
                            />
                        )}
                    </div>
                ))}
            </div>

            <div className="flex flex-col relative min-h-screen">
                <div className="flex-1 overflow-y-auto">
                    {messages.map((message, index) => (
                        <div key={message.id} className="flex flex-col">
                            {message.role === "assistant" ? (
                                <Markdown markdown={message.content} />
                            ) : (
                                <UserMessageBox
                                    messageContent={message.content}
                                    handleEditMessageSubmit={handleEditMessageSubmit}
                                    messageId={message.id}
                                    messageIndex={index}
                                />
                            )}
                        </div>
                    ))}
                </div>

                <div ref={messagesEndRef} />

                {/* Chat Input Box - Fixed at Bottom */}
                {(status === 'streaming' || status === 'submitted') && (
                    <div className="flex flex-col items-center justify-center p-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                            <Loader2 className="w-5 h-5 animate-spin" />
                            <span>{status === 'submitted' ? 'Thinking...' : 'Assistant is typing...'}</span>
                        </div>
                        <Button
                            type="button"
                            onClick={stop}
                            size="sm"
                            variant="outline"
                            className="mt-3 rounded-full"
                            disabled={status !== 'streaming'}
                        >
                            Stop Generating
                        </Button>
                    </div>
                )}

                {status === 'error' && (
                    <Alert variant="destructive" className="mt-3 sm:mt-4 rounded-lg">
                        <AlertTitle>Failed</AlertTitle>
                        <AlertDescription className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                            {modelConfig ? (
                                <>
                                    <span>
                                        {error?.message.startsWith('"') && error.message.endsWith('"') ?
                                            error.message.slice(1, -1) :
                                            error?.message}
                                    </span>
                                    <Button variant="outline" onClick={handleRetry} size="sm" className="rounded-full">
                                        <RefreshCcw className="w-4 h-4 mr-1" />
                                        Retry
                                    </Button>
                                </>
                            ) : (
                                <>
                                    <span>Please add an API Key</span>
                                    <Button
                                        variant="outline"
                                        onClick={() => router.push('/settings')}
                                        size="sm"
                                        className="rounded-full"
                                    >
                                        <Settings className="w-4 h-4 mr-1" />
                                        Settings
                                    </Button>
                                </>
                            )}
                        </AlertDescription>
                    </Alert>
                )}
            </div>


            {/* Chat Input Box - Fixed at Bottom */}
            <div className="sticky bottom-0 left-0 right-0 w-full shadow-md">
                <ChatInputBox
                    inputRef={chatInputBoxRef}
                    input={input}
                    onInputChange={handleInputChange}
                    onSubmit={handleFormSubmit}
                    setInput={setInput}
                    isDisabled={status === "streaming" || status === "submitted"}
                    tokenInfo={
                        userBilling
                            ? { usage: userBilling.tokenUsage, limit: MAX_FREE_TOKEN }
                            : undefined
                    }
                />
            </div>
            <ScrollToBottom />
        </div >

    );
}
