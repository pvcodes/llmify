import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import LandingPage from "@/components/landing-page"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export default async function Layout({ children }: { children: React.ReactNode }) {
    const session = await getServerSession(authOptions)
    if (!session) return <LandingPage />

    return (
        <SidebarProvider>
            <div className="flex w-full">
                <div className="hidden sm:block">
                    <AppSidebar />
                </div>
                <main className="w-full p-4">{children}</main>
            </div>
        </SidebarProvider>
    )
}
