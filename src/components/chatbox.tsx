'use client';

import { useChat } from '@ai-sdk/react';
import { Button } from './ui/button';
import { useState } from 'react';
import { Input } from './ui/input';
import { SendHorizonal } from 'lucide-react';

export default function Chat() {
    const { messages, input, handleInputChange, handleSubmit: handleSubmitAi, stop, status, error } = useChat();
    console.log(error, 123213)
    const [apiKeys, setApiKeys] = useState({

        openAi: 'sk-proj-BN92IHglAqlOa2Np5vWVT3BlbkFJYnOpQXpWNHc45G9Ec1p3'
    });
    const [model, setModel] = useState('gpt-4o');

    const handleSubmit = (e) => {
        e.preventDefault();
        handleSubmitAi(e, {
            body: {
                apiKey: apiKeys.openAi,
                model
            }
        });
    };

    // Check if chat is new (no messages yet)
    const isNewChat = messages.length === 0;

    return (
        <div className="flex flex-col h-full w-full">

            {/* Messages Area */}
            {!isNewChat && <div className="flex-1 overflow-y-auto p-4">
                <div className="flex flex-col gap-4 max-w-3xl mx-auto w-full">
                    {messages.map(m => (
                        <div
                            key={m.id}
                            className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div className={`max-w-[70%] p-3 rounded-lg ${m.role === 'user' ? 'ml-8' : 'mr-8'
                                }`}>
                                <div className="font-medium mb-1">
                                    {m.role}
                                </div>
                                <div className="whitespace-pre-wrap">
                                    {m.parts.map(chunk => <>{chunk.text!}</>)}
                                </div>
                            </div>
                        </div>
                    ))}
                    {error && <p>{error.message}</p>}
                </div>
            </div>

            }

            {/* Input Area */}
            <div className={`p-4 border-t ${isNewChat ? 'flex-1 flex items-center' : ''
                }`}>
                <form onSubmit={handleSubmit} className="max-w-3xl mx-auto w-full">
                    <div className="flex flex-col gap-2">
                        <div className="flex gap-2">
                            <Input
                                className="flex-1"
                                value={input}
                                placeholder="Ask me anything..."
                                onChange={handleInputChange}
                            />
                            <Button type="submit">
                                <SendHorizonal className="w-5 h-5" />
                            </Button>
                        </div>
                        {(status === 'submitted' || status === 'streaming') && (
                            <div className="flex justify-center">
                                <Button
                                    type="button"
                                    onClick={() => stop()}
                                    size="sm"
                                    variant="outline"
                                >
                                    Stop Generating
                                </Button>
                            </div>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
}