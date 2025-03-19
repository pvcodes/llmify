"use client"

import * as React from "react"
import { Check, ChevronsUpDown, KeyRound, Lock } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { AIModelProviders, ModelProvidersViaTier, ModelProviderType } from "@/lib/ai/models"
import useChatStore from "@/store/useChatStore"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useRouter } from "next/navigation"
import { BillingLevel } from "@prisma/client"

interface SelectAiModelProps {
    setSheetOpen: React.Dispatch<React.SetStateAction<boolean>>
    tier: BillingLevel
}

export default function SelectAiModel({ setSheetOpen, tier }: SelectAiModelProps) {
    const router = useRouter()
    const [open, setOpen] = React.useState(false)
    const [availableProviders, setAvailableProviders] = React.useState<ModelProviderType[]>(ModelProvidersViaTier[tier])
    const setConfig = useChatStore(state => state.setConfig)
    const config = useChatStore(state => state.config)
    const apiKeys = useChatStore(state => state.apiKeys)
    const getApiKey = useChatStore(state => state.getApiKey)
    const cryptoKey = useChatStore(state => state.cryptoKey)

    React.useEffect(() => {
        const checkApiKeys = async () => {
            if (!cryptoKey) return;

            const providers: ModelProviderType[] = [];

            for (const provider of Object.keys(AIModelProviders) as ModelProviderType[]) {
                const key = await getApiKey(provider);
                if (key) {
                    providers.push(provider);
                }
            }

            console.log(providers, 1231321)
            setAvailableProviders(prev => ([...prev, ...providers]));
        };
        checkApiKeys()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [apiKeys])

    const handleSetupApiKeys = () => {
        setOpen(false);
        setSheetOpen(false);
        router.push("/settings");
    };

    const hasNoApiKeys = availableProviders.length === 0;

    return (
        <div className="w-full max-w-md">
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className={cn(
                            "w-full justify-between px-3 py-2 text-sm sm:text-base h-10",
                            hasNoApiKeys && "text-amber-500 border-amber-200"
                        )}
                    >
                        {hasNoApiKeys ? (
                            <span className="flex items-center">
                                <Lock className="mr-2 h-4 w-4" />
                                Set up API key
                            </span>
                        ) : (
                            <span className="truncate">
                                {config?.model?.label || "Select Model"}
                            </span>
                        )}
                        <ChevronsUpDown className="ml-2 h-4 w-4 flex-shrink-0 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent
                    className="w-[var(--radix-popover-trigger-width)] p-0 lg:w-[300px] lg:mr-16"
                    align="start"
                >
                    <Command>
                        <CommandInput
                            placeholder="Search model..."
                            className="h-9"
                        />
                        <CommandList className="max-h-[300px]">
                            <CommandEmpty>No models found.</CommandEmpty>
                            {hasNoApiKeys ? (
                                <div className="py-6 text-center">
                                    <KeyRound className="mx-auto h-12 w-12 text-amber-500/40 mb-2" />
                                    <p className="text-sm font-medium">API key required</p>
                                    <p className="text-xs text-muted-foreground mt-1 mb-4 px-4">
                                        You need to set up at least one API key to use the available models
                                    </p>
                                    <Button
                                        onClick={handleSetupApiKeys}
                                        size="sm"
                                        variant="secondary"
                                        className="mx-auto"
                                    >
                                        Set up API Keys
                                    </Button>
                                </div>
                            ) : (
                                <>
                                    {(Object.keys(AIModelProviders) as Array<keyof typeof AIModelProviders>)
                                        .filter(provider => availableProviders.includes(provider))
                                        .map((provider) => (
                                            <CommandGroup key={provider}>
                                                <p className="px-2 py-1.5 text-xs font-medium text-muted-foreground capitalize sm:text-sm">
                                                    {provider}
                                                </p>
                                                {AIModelProviders[provider].map((model) => (
                                                    <CommandItem
                                                        key={model.value}
                                                        value={model.value}
                                                        onSelect={() => {
                                                            setConfig(provider, {
                                                                value: model.value,
                                                                label: model.label
                                                            });
                                                            setOpen(false);
                                                            setSheetOpen(false);
                                                        }}
                                                        className="flex items-center gap-2 text-sm"
                                                    >
                                                        <Check
                                                            className={cn(
                                                                "h-4 w-4 flex-shrink-0",
                                                                config?.model?.value === model.value
                                                                    ? "opacity-100"
                                                                    : "opacity-0"
                                                            )}
                                                        />
                                                        <span className="truncate">{model.label}</span>
                                                    </CommandItem>
                                                ))}
                                            </CommandGroup>
                                        ))
                                    }
                                    <div className="p-2 border-t">
                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="w-full text-xs text-muted-foreground"
                                                        onClick={handleSetupApiKeys}
                                                    >
                                                        <KeyRound className="h-3 w-3 mr-1" />
                                                        Manage API Keys
                                                    </Button>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p>Configure additional models</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                    </div>
                                </>
                            )}
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
        </div>
    )
}