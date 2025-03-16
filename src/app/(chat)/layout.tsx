import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { getServerSession } from "next-auth"
import Navbar from "@/components/navbar"
import { redirect } from "next/navigation"
import { authOptions } from "@/app/(auth)/auth"
import { getUserTierDetails } from "./actions"

export default async function Layout({ children }: { children: React.ReactNode }) {
    const session = await getServerSession(authOptions)
    if (!session) return redirect('/')
    const userBillingDetails = await getUserTierDetails(session.user.email)

    return (
        <SidebarProvider>
            <div className="flex w-full">
                <div className="hidden sm:block">
                    <AppSidebar />
                </div>
                <main className="flex flex-col justify-between items-space h-full w-full p-4">
                    <Navbar tier={userBillingDetails?.level ?? null} />
                    {children}
                </main>
            </div>
        </SidebarProvider>
    )
}