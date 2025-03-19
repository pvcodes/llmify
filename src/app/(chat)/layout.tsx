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
    if (!userBillingDetails) return   // should not be here, 'default level is FREE, it will never fail, until DB is down'

    return (
        <SidebarProvider>
            <div className="w-full">
                <div className="flex">
                    <AppSidebar />
                    <div className="w-full p-2 lg:p-4">
                        <Navbar tier={userBillingDetails?.level} />
                        {children}
                    </div>
                </div>
            </div>
        </SidebarProvider>
    )
}