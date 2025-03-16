'use client';

import { Button } from "@/components/ui/button";
import { Message, useChat } from "@ai-sdk/react";
import { Input } from "@/components/ui/input";
import { SendHorizonal, RefreshCcw, Loader2, Settings } from "lucide-react";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import useChatStore from "@/store/useChatStore";
import { toast } from "sonner";
import ChatMessage from "./message";
import { useIsMobile } from "@/hooks/use-mobile";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ModelProvidersViaTier, ModelProviderType, } from "@/lib/ai/models";
import { useRouter } from "next/navigation";
import { Billing } from "@prisma/client";
import { MAX_FREE_TOKEN } from "@/lib/constant";

interface ChatProps {
    id: string;
    initialMessages: Message[];
    isNew?: boolean;
    userBilling: Billing | null
}

// Main chat component
export default function Chat({ id, initialMessages, isNew = false, userBilling }: ChatProps) {
    // State management from custom hooks
    const modelConfig = useChatStore(state => state.config);
    const getApiKey = useChatStore(state => state.getApiKey);
    const isMobile = useIsMobile();
    const router = useRouter();

    const isApiKeyRequired = useMemo(async () => {
        if (userBilling?.level && modelConfig?.provider && !ModelProvidersViaTier[userBilling.level]?.includes(modelConfig?.provider)) return true;

        return false; // API key not required
    }, [modelConfig, userBilling]);

    // Refs for DOM manipulation
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const messagesContainerRef = useRef<HTMLDivElement>(null);

    const [lastSubmitTime, setLastSubmitTime] = useState(0);
    const RATE_LIMIT_MS = 1000; // Rate limit in milliseconds

    // Chat functionality from useChat hook
    const {
        messages,
        input,
        handleInputChange,
        handleSubmit,
        stop,
        status,
        error,
        reload,
    } = useChat({
        initialMessages,
    });

    // Memoized API key for the current provider
    const currProviderApiKey = useMemo(() => modelConfig ? getApiKey(modelConfig.provider as ModelProviderType) : null, [modelConfig, getApiKey]);

    useEffect(() => {
        const fetchInitialResponse = async () => {

            if (isNew && modelConfig) {
                reload({
                    body: { id, modelConfig, apiKey: await currProviderApiKey, messages },
                });
            }
        }
        fetchInitialResponse()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Handle form submission with rate limiting
    const handleFormSubmit = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();
        const now = Date.now();

        // Rate limiting check
        if (now - lastSubmitTime < RATE_LIMIT_MS) {
            toast("Please wait a moment before sending another message");
            return;
        }

        if (!input.trim() || status === 'streaming' || status === 'submitted') return;

        if (await isApiKeyRequired) {
            toast("Please add your API key in settings");
            return;
        }

        setLastSubmitTime(now);

        handleSubmit(e, {
            body: { id, modelConfig, apiKey: await currProviderApiKey },
        });
        router.refresh()
    }, [input, status, handleSubmit, modelConfig, id, lastSubmitTime, currProviderApiKey, isApiKeyRequired, router]);

    // Handle retry on error
    const handleRetry = useCallback(async () => {
        if (status === 'error' && modelConfig) {
            reload({
                body: {
                    id, modelConfig, apiKey: await currProviderApiKey
                }
            });
        }
    }, [status, reload, modelConfig, currProviderApiKey, id]);

    return (
        <Card className="flex flex-col h-full w-full max-w-4xl mx-auto border-none shadow-none relative">
            <CardContent className="flex-1 p-4">
                <ScrollArea
                    ref={messagesContainerRef}
                    className="h-full overflow-y-auto"
                    role="log"
                    aria-live="polite"
                    aria-label="Chat messages"
                >
                    {/* Message list */}
                    {messages.map((message) => (
                        <div
                            key={message.id}
                            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} mb-2`}
                        >
                            <ChatMessage message={message} />
                        </div>
                    ))}

                    {(status === 'streaming' || status === 'submitted') && (
                        <div className="flex flex-col items-center justify-center p-2 text-sm text-muted-foreground">
                            <div className="flex items-center">
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                <span>Assistant is typing...</span>
                            </div>
                            <Button
                                type="button"
                                onClick={stop}
                                size="sm"
                                variant="outline"
                                className="mt-2"
                                disabled={status !== 'streaming'}
                                aria-label="Stop generating response"
                            >
                                Stop Generating
                            </Button>
                        </div>
                    )}

                    {/* Error display */}
                    {status === 'error' && (
                        <Alert variant="destructive" className="mt-2">
                            <AlertTitle>Failed</AlertTitle>
                            <AlertDescription className="flex items-center justify-between">
                                {modelConfig ? (
                                    <>
                                        {JSON.stringify(error)}
                                        {/* Needed to do this, ai-sdk/core not able to parse custom error */}
                                        {
                                            error?.message.startsWith('"') && error.message.endsWith('"') ?
                                                error.message.slice(1, -1) :
                                                error?.message
                                        }
                                        <Button variant="outline" onClick={handleRetry} size='icon'>
                                            <RefreshCcw className="w-4 h-4" />
                                        </Button>
                                    </>
                                ) : (
                                    <>
                                        <span>Please add an API Key</span>
                                        <Button
                                            variant="outline"
                                            onClick={() => router.push('/settings')}
                                            size='icon'
                                        >
                                            <Settings />
                                        </Button>
                                    </>
                                )}
                            </AlertDescription>
                        </Alert>
                    )}
                    <div ref={messagesEndRef} />
                </ScrollArea>
            </CardContent>



            {/* Input footer */}
            <CardFooter className="sticky bottom-0 left-0 w-full p-4 bg-card border-t flex flex-col">
                <form onSubmit={handleFormSubmit} className="flex items-center gap-2 w-full">
                    <Input
                        ref={inputRef}
                        className="flex-1"
                        value={input}
                        placeholder="Type a message..."
                        onChange={handleInputChange}
                        disabled={status === 'streaming'}
                        aria-label="Message input"
                    />
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    type="submit"
                                    size="icon"
                                    disabled={!input.trim() || status === 'streaming'}
                                    aria-label="Send message"
                                >
                                    <SendHorizonal className="w-5 h-5" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>Send message</TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </form>


                {/* Keyboard shortcut hint */}
                {!isMobile && (
                    <div className="hidden md:flex justify-center mt-2 text-xs text-muted-foreground w-full">
                        <span>
                            Press <kbd className="px-1 py-0.5 bg-muted rounded border">Ctrl</kbd>+
                            <kbd className="px-1 py-0.5 bg-muted rounded border">Enter</kbd> to send
                        </span>
                    </div>
                )}

                <div className="justify-center mt-2 text-xs text-muted-foreground w-full">
                    <span className="px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-md shadow-sm border border-gray-300 dark:border-gray-700">
                        Token usage: <span className="font-semibold text-primary">{userBilling?.tokenUsage}</span> tokens out of <span className="font-semibold">{MAX_FREE_TOKEN}</span>
                    </span>
                </div>

            </CardFooter>
        </Card>
    );
}