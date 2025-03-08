'use client'
import { Button } from "@/components/ui/button";
import Chatbox from "@/components/chatbox";
import ModeToggle from "@/components/ModeToggle";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { signOut } from "next-auth/react"


export default function Home() {
  return (
    <div className="flex flex-col justify-between items-space h-full">
      <div className="flex items-center">
        <SidebarTrigger />
        <ModeToggle />
        <Button onClick={() => signOut()} variant='ghost'>Logout</Button>
      </div>
      <Separator />
      <Chatbox />
    </div>

  )
}
