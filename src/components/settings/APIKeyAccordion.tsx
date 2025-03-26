'use client';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { CheckCircle2, Clipboard, AlertCircle, Copy, Eye, EyeOff } from "lucide-react";
import { APIKeyActions, APIKeyState } from "./types";
import { type ModelProvider } from "@/lib/ai/models";

interface APIKeyAccordionProps extends APIKeyState, APIKeyActions {
    provider: ModelProvider;
    description: string;
    hasKey: boolean;
}

export function APIKeyAccordion({
    provider,
    description,
    hasKey,
    tempKeys,
    displayKeys,
    showKey,
    status,
    handleSaveKey,
    handleCopyKey,
    toggleShowKey,
    handleKeyChange,
}: APIKeyAccordionProps) {
    const currentKey = tempKeys[provider] !== undefined ? tempKeys[provider] : (displayKeys[provider] || "");

    return (
        <AccordionItem value={provider} className="border-b">
            <AccordionTrigger className="px-6 py-4 hover:bg-muted/50">
                <div className="flex items-center justify-between w-full pr-4">
                    <span className="font-medium">{provider}</span>
                    {hasKey && <CheckCircle2 className="h-4 w-4 text-green-500" />}
                </div>
            </AccordionTrigger>
            <AccordionContent className="px-6 py-4">
                <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">{description}</p>
                    <div className="flex flex-col sm:flex-row gap-3">
                        <div className="relative flex-1">
                            <Input
                                type={showKey[provider] ? "text" : "password"}
                                placeholder={`${provider} API Key`}
                                value={currentKey}
                                onChange={(e) => handleKeyChange(provider, e.target.value)}
                                className="pr-10 rounded-md"
                            />
                            <Button
                                variant="ghost"
                                size="icon"
                                className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6"
                                onClick={() => toggleShowKey(provider)}
                            >
                                {showKey[provider] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </Button>
                        </div>
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleCopyKey(provider)}
                                disabled={!displayKeys[provider] && !tempKeys[provider]}
                                className="rounded-md"
                            >
                                <Copy className="h-4 w-4 mr-2" />
                                Copy
                            </Button>
                            <Button
                                size="sm"
                                onClick={() => handleSaveKey(provider)}
                                disabled={!tempKeys[provider] && !displayKeys[provider]}
                                className="rounded-md"
                            >
                                Save
                            </Button>
                        </div>
                    </div>
                    {status[provider] && (
                        <Alert variant={status[provider] === "error" ? "destructive" : "default"} className="mt-2 rounded-md">
                            <AlertDescription className="flex items-center gap-2">
                                {status[provider] === "saved" ? (
                                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                                ) : status[provider] === "copied" ? (
                                    <Clipboard className="h-4 w-4 text-blue-500" />
                                ) : (
                                    <AlertCircle className="h-4 w-4 text-red-500" />
                                )}
                                <span>
                                    {status[provider] === "saved"
                                        ? "Key saved successfully"
                                        : status[provider] === "copied"
                                            ? "Key copied to clipboard"
                                            : "Invalid API key"}
                                </span>
                            </AlertDescription>
                        </Alert>
                    )}
                </div>
            </AccordionContent>
        </AccordionItem>
    );
}