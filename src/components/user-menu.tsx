'use client'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { signOut, useSession } from "next-auth/react"
import { useRouter } from "next/navigation"

export default function User() {
    const session = useSession()
    const router = useRouter()
    return (
        <DropdownMenu>

            <DropdownMenuTrigger asChild>
                <Avatar>
                    <AvatarImage src={session.data?.user?.image ?? undefined} loading='lazy' />
                    <AvatarFallback>
                        {session.data?.user?.name
                            ? session.data.user.name
                                .split(" ")
                                .map((word) => word.charAt(0).toUpperCase())
                                .slice(0, 2)
                                .join("")
                            : "PV"}
                    </AvatarFallback>
                </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 mr-2 mt-2">
                <DropdownMenuLabel>Hello, {session.data?.user?.name?.split(' ')[0] ?? 'there'}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <DropdownMenuItem onClick={() => router.push('/settings?tab=preferences')}>
                        Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => router.push('/billing')} disabled>
                        Billing
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => router.push('/settings')}>
                        Settings
                    </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => router.push('/support')}>Found a issue?</DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push('/support')}>Support</DropdownMenuItem>
                {/* <DropdownMenuItem disabled>API</DropdownMenuItem> */}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => {
                    signOut({ callbackUrl: '/' })
                    localStorage.clear()
                }}>
                    Log out
                    {/* <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut> */}
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
