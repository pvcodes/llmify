import { MessageSquareDashed, PlusCircle } from "lucide-react"
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuItem,
} from "@/components/ui/sidebar"
import { APP_NAME } from "@/lib/constant"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { getChats } from "@/app/(chat)/chat/action"
import { getServerSession } from "next-auth"
import ChatNameEditable from "./chat-name-editable"
import { authOptions } from "@/app/(auth)/auth"

export async function AppSidebar() {
    const session = await getServerSession(authOptions)
    const chats = await getChats(session?.user?.email as string) || []

    return (
        <Sidebar className="border-r">
            <SidebarContent className="pt-4">
                <SidebarGroup>
                    <SidebarGroupLabel className="px-4 text-lg font-semibold">
                        {APP_NAME}
                    </SidebarGroupLabel>
                    <SidebarGroupContent className="px-2">
                        <div className="flex items-center justify-between px-2 py-3 border-b">
                            <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                                Chats
                            </h2>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 hover:bg-muted rounded-full"
                                asChild
                            >
                                <Link href="/new" aria-label="New Chat">
                                    <PlusCircle className="h-4 w-4" />
                                </Link>
                            </Button>
                        </div>
                        <SidebarMenu className="mt-2">
                            {chats.length > 0 ? (
                                chats.map((chat) => (
                                    <SidebarMenuItem
                                        key={chat.id}
                                        className="py-1 hover:bg-muted rounded-md transition-colors"
                                    >
                                        <ChatNameEditable chat={chat} />
                                    </SidebarMenuItem>
                                ))
                            ) : (
                                <SidebarMenuItem>
                                    <div className="flex flex-col items-center gap-2 py-6 text-center">
                                        <MessageSquareDashed className="h-6 w-6 text-muted-foreground" />
                                        <p className="text-sm text-muted-foreground max-w-[200px]">
                                            No chats yet. Start a new conversation!
                                        </p>
                                    </div>
                                </SidebarMenuItem>
                            )}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    )
}