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
        <div className="flex flex-col h-full w-full max-w-4xl mx-auto mt-1 lg:mt-10">
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
    );
}