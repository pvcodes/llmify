// 'use client';

// import { useState, useEffect } from "react";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Alert, AlertDescription } from "@/components/ui/alert";
// import { Copy, Eye, EyeOff, CheckCircle2, Clipboard, Lock, AlertCircle } from "lucide-react";
// import { useSidebar } from "@/components/ui/sidebar";
// import {
//     Accordion,
//     AccordionContent,
//     AccordionItem,
//     AccordionTrigger,
// } from "@/components/ui/accordion";
// import { AIModelProviders, ModelProviderType } from "@/lib/ai/models";
// import useChatStore from "@/store/useChatStore";
// import { validateProviderAPIKey } from "@/lib/ai";

// const llmProviders = Object.keys(AIModelProviders) as ModelProviderType[];

// export default function Settings() {
//     const { setOpen, open } = useSidebar();
//     const [activeTab, setActiveTab] = useState("api-keys");
//     const apiKeys = useChatStore(state => state.apiKeys);
//     const getApiKey = useChatStore(state => state.getApiKey);
//     const setApiKey = useChatStore(state => state.setApiKey);
//     const cryptoKey = useChatStore(state => state.cryptoKey);
//     const initializeCryptoKey = useChatStore(state => state.initializeCryptoKey);
//     const descriptions = useChatStore(state => state.descriptions);
//     const [tempKeys, setTempKeys] = useState<Record<string, string>>({});
//     const [displayKeys, setDisplayKeys] = useState<Record<string, string>>({});
//     const [showKey, setShowKey] = useState<Record<string, boolean>>({});
//     const [status, setStatus] = useState<Record<string, "saved" | "copied" | "error" | null>>({});
//     const [isInitializing, setIsInitializing] = useState(true);

//     useEffect(() => {
//         const initialize = async () => {
//             if (!cryptoKey) await initializeCryptoKey();
//             setIsInitializing(false);
//         };
//         initialize();
//     }, [cryptoKey, initializeCryptoKey]);

//     useEffect(() => {
//         if (open) setOpen(false);

//     }, [])

//     // Load API keys when cryptoKey is available
//     useEffect(() => {
//         const loadApiKeys = async () => {
//             if (!cryptoKey) return;

//             const keys: Record<string, string> = {};

//             for (const provider of llmProviders) {
//                 const key = await getApiKey(provider);
//                 if (key) {
//                     keys[provider] = key;
//                 }
//             }

//             setDisplayKeys(keys);
//         };

//         loadApiKeys();
//     }, [cryptoKey, getApiKey]);

//     const validateApiKey = async (provider: ModelProviderType, apiKey: string) => {
//         try {
//             const response = await fetch(`/api/validate-api-key`, {
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify({ provider, apiKey }),
//             });
//             if (!response.ok) throw new Error('Invalid API key');
//             const { valid } = await response.json()
//             return valid;
//         } catch (error) {
//             console.error(`Validation failed for ${provider}:`, error);
//             return false;
//         }
//     };

//     const handleSaveKey = async (provider: ModelProviderType) => {
//         if (!cryptoKey) return;
//         const key = tempKeys[provider] || displayKeys[provider];
//         if (!key) return;

//         setStatus(prev => ({ ...prev, [provider]: null }));

//         const isValid = await validateApiKey(provider, key);
//         if (isValid) {
//             await setApiKey(provider, key);
//             setStatus(prev => ({ ...prev, [provider]: "saved" }));

//             // Update the display key
//             setDisplayKeys(prev => ({ ...prev, [provider]: key }));
//             // Clear temp key
//             setTempKeys(prev => {
//                 const newKeys = { ...prev };
//                 delete newKeys[provider];
//                 return newKeys;
//             });

//             setTimeout(() => setStatus(prev => ({ ...prev, [provider]: null })), 2000);
//         } else {
//             setStatus(prev => ({ ...prev, [provider]: "error" }));
//             setTimeout(() => setStatus(prev => ({ ...prev, [provider]: null })), 3000);
//         }
//     };

//     const handleCopyKey = async (provider: ModelProviderType) => {
//         const key = tempKeys[provider] || displayKeys[provider];
//         if (key) {
//             await navigator.clipboard.writeText(key);
//             setStatus(prev => ({ ...prev, [provider]: "copied" }));
//             setTimeout(() => setStatus(prev => ({ ...prev, [provider]: null })), 2000);
//         }
//     };

//     const toggleShowKey = (provider: ModelProviderType) => {
//         setShowKey(prev => ({ ...prev, [provider]: !prev[provider] }));
//     };

//     const handleKeyChange = (provider: ModelProviderType, value: string) => {
//         setTempKeys(prev => ({ ...prev, [provider]: value }));
//     };

//     return (
//         <div className="min-h-screen p-6 bg-muted/20">
//             <div className="max-w-4xl mx-auto space-y-6">
//                 <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
//                     <TabsList className="grid grid-cols-3 gap-2 w-full max-w-md mx-auto mb-6">
//                         <TabsTrigger value="api-keys" className="rounded-lg">API Keys</TabsTrigger>
//                         <TabsTrigger value="preferences" className="rounded-lg">Preferences</TabsTrigger>
//                         <TabsTrigger value="notifications" className="rounded-lg">Notifications</TabsTrigger>
//                     </TabsList>

//                     <TabsContent value="api-keys" className="mt-0">
//                         <Card className="border-0 shadow-sm">
//                             <CardHeader className="pb-2">
//                                 <CardTitle className="text-xl font-semibold tracking-tight">
//                                     API Keys Configuration
//                                 </CardTitle>
//                                 <p className="text-sm text-muted-foreground">
//                                     Manage your API keys for AI providers
//                                 </p>
//                             </CardHeader>
//                             <CardContent className="p-0">
//                                 <div className="px-6 py-4">
//                                     <Alert variant="default" className="mb-6 rounded-md bg-muted">
//                                         <Lock className="h-4 w-4 text-muted-foreground" />
//                                         <AlertDescription className="text-sm">
//                                             Your API keys are encrypted and stored locally using a browser-managed secure key.
//                                         </AlertDescription>
//                                     </Alert>
//                                 </div>
//                                 {isInitializing ? (
//                                     <div className="px-6 py-4 text-center text-muted-foreground">
//                                         Initializing secure key storage...
//                                     </div>
//                                 ) : cryptoKey ? (
//                                     <Accordion type="single" collapsible className="w-full">
//                                         {llmProviders.map((provider) => (
//                                             <AccordionItem key={provider} value={provider} className="border-b">
//                                                 <AccordionTrigger className="px-6 py-4 hover:bg-muted/50">
//                                                     <div className="flex items-center justify-between w-full pr-4">
//                                                         <span className="font-medium">{provider}</span>
//                                                         {apiKeys[provider] && (
//                                                             <CheckCircle2 className="h-4 w-4 text-green-500" />
//                                                         )}
//                                                     </div>
//                                                 </AccordionTrigger>
//                                                 <AccordionContent className="px-6 py-4">
//                                                     <div className="space-y-4">
//                                                         <p className="text-sm text-muted-foreground">
//                                                             {descriptions[provider]}
//                                                         </p>
//                                                         <div className="flex flex-col sm:flex-row gap-3">
//                                                             <div className="relative flex-1">
//                                                                 <Input
//                                                                     type={showKey[provider] ? "text" : "password"}
//                                                                     placeholder={`${provider} API Key`}
//                                                                     value={tempKeys[provider] !== undefined ? tempKeys[provider] : (displayKeys[provider] || "")}
//                                                                     onChange={(e) => handleKeyChange(provider, e.target.value)}
//                                                                     className="pr-10 rounded-md"
//                                                                 />
//                                                                 <Button
//                                                                     variant="ghost"
//                                                                     size="icon"
//                                                                     className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6"
//                                                                     onClick={() => toggleShowKey(provider)}
//                                                                 >
//                                                                     {showKey[provider] ? (
//                                                                         <EyeOff className="h-4 w-4" />
//                                                                     ) : (
//                                                                         <Eye className="h-4 w-4" />
//                                                                     )}
//                                                                 </Button>
//                                                             </div>
//                                                             <div className="flex gap-2">
//                                                                 <Button
//                                                                     variant="outline"
//                                                                     size="sm"
//                                                                     onClick={() => handleCopyKey(provider)}
//                                                                     disabled={!displayKeys[provider] && !tempKeys[provider]}
//                                                                     className="rounded-md"
//                                                                 >
//                                                                     <Copy className="h-4 w-4 mr-2" />
//                                                                     Copy
//                                                                 </Button>
//                                                                 <Button
//                                                                     size="sm"
//                                                                     onClick={() => handleSaveKey(provider)}
//                                                                     disabled={!tempKeys[provider] && !displayKeys[provider]}
//                                                                     className="rounded-md"
//                                                                 >
//                                                                     Save
//                                                                 </Button>
//                                                             </div>
//                                                         </div>
//                                                         {status[provider] && (
//                                                             <Alert
//                                                                 variant={status[provider] === "error" ? "destructive" : "default"}
//                                                                 className="mt-2 rounded-md"
//                                                             >
//                                                                 <AlertDescription className="flex items-center gap-2">
//                                                                     {status[provider] === "saved" ? (
//                                                                         <CheckCircle2 className="h-4 w-4 text-green-500" />
//                                                                     ) : status[provider] === "copied" ? (
//                                                                         <Clipboard className="h-4 w-4 text-blue-500" />
//                                                                     ) : (
//                                                                         <AlertCircle className="h-4 w-4 text-red-500" />
//                                                                     )}
//                                                                     <span>
//                                                                         {status[provider] === "saved"
//                                                                             ? "Key saved successfully"
//                                                                             : status[provider] === "copied"
//                                                                                 ? "Key copied to clipboard"
//                                                                                 : "Invalid API key"}
//                                                                     </span>
//                                                                 </AlertDescription>
//                                                             </Alert>
//                                                         )}
//                                                     </div>
//                                                 </AccordionContent>
//                                             </AccordionItem>
//                                         ))}
//                                     </Accordion>
//                                 ) : (
//                                     <div className="px-6 py-4 text-center text-muted-foreground">
//                                         Failed to initialize secure key storage. Please refresh and try again.
//                                     </div>
//                                 )}
//                             </CardContent>
//                         </Card>
//                     </TabsContent>

//                     <TabsContent value="preferences" className="mt-0" id="preferences">
//                         <Card className="border-0 shadow-sm">
//                             <CardHeader>
//                                 <CardTitle className="text-xl font-semibold tracking-tight">
//                                     Preferences
//                                 </CardTitle>
//                             </CardHeader>
//                             <CardContent>
//                                 <p className="text-sm text-muted-foreground">
//                                     Customize your settings (coming soon)
//                                 </p>
//                             </CardContent>
//                         </Card>
//                     </TabsContent>
//                     <TabsContent value="notifications" className="mt-0">
//                         <Card className="border-0 shadow-sm">
//                             <CardHeader>
//                                 <CardTitle className="text-xl font-semibold tracking-tight">
//                                     Notifications
//                                 </CardTitle>
//                             </CardHeader>
//                             <CardContent>
//                                 <p className="text-sm text-muted-foreground">
//                                     Manage notifications (coming soon)
//                                 </p>
//                             </CardContent>
//                         </Card>
//                     </TabsContent>
//                 </Tabs>
//             </div>
//         </div>
//     );
// }

'use client';

import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSidebar } from "@/components/ui/sidebar";
import { APIKeysTab } from "@/components/settings/APIKeysTab";
import { PreferencesTab } from "@/components/settings/PreferencesTab";
import { NotificationsTab } from "@/components/settings/NotificationsTab";
import { useSearchParams } from "next/navigation";

export default function Settings() {
    const searchParams = useSearchParams()
    const { setOpen, open } = useSidebar();
    const [activeTab, setActiveTab] = useState(searchParams.get('tab') ?? 'api-keys');

    useEffect(() => {
        if (open) setOpen(false);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="min-h-screen p-6 bg-muted/20">
            <div className="max-w-4xl mx-auto space-y-6">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid grid-cols-3 gap-2 w-full max-w-md mx-auto mb-6">
                        <TabsTrigger value="api-keys" className="rounded-lg">API Keys</TabsTrigger>
                        <TabsTrigger value="preferences" className="rounded-lg">Preferences</TabsTrigger>
                        <TabsTrigger value="notifications" className="rounded-lg">Notifications</TabsTrigger>
                    </TabsList>

                    <TabsContent value="api-keys" className="mt-0">
                        <APIKeysTab />
                    </TabsContent>
                    <TabsContent value="preferences" className="mt-0" id="preferences">
                        <PreferencesTab />
                    </TabsContent>
                    <TabsContent value="notifications" className="mt-0">
                        <NotificationsTab />
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}