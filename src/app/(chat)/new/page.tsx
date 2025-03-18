"use client"

import { Terminal } from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import useChatStore from "@/store/useChatStore"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import Link from "next/link"
import { generateChatId } from "@/lib/utils"
import { revalidateSidebar } from "../chat/action"
import ChatInputBox from "@/components/chat/chat-inputbox"

export default function NewChat() {

  const apiKeys = useChatStore(state => state.apiKeys)

  const [prompt, setPrompt] = useState("")
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const router = useRouter()

  const handleFirstChat = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!prompt.trim()) {
      setErrorMessage("Prompt cannot be empty")
      return
    }

    try {
      setLoading(true)
      setErrorMessage("")

      const chatId = generateChatId()
      const response = await fetch("/api/x/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: chatId, prompt }),
      })

      const data = await response.json()
      if (!response.ok) {
        setErrorMessage(data?.error?.message || "Failed to create chat")
        return
      }
      await revalidateSidebar() // refect chats for sidebar
      router.push(`/chat/${chatId}`)
    } catch (error) {
      console.error(error)
      setErrorMessage("Something went wrong, please try again")
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {Object.keys(apiKeys).length < 1
        &&
        <Alert className="mt-2">
          <Terminal className="h-4 w-4" />
          <AlertTitle>Heads up!</AlertTitle>
          <AlertDescription className="text-sm flex">
            To use models using your API Key, please add them in settings
            <Link href='/settings' className="underline hover:text-primary text-blue-700">here</Link>
          </AlertDescription>
        </Alert>
      }

      <div className="flex flex-col items-center justify-center h-screen px-4 sm:px-6 md:px-8 lg:px-10">
        <div className="flex w-full max-w-2xl gap-2">
          <ChatInputBox input={prompt}
            onInputChange={(e) => setPrompt(e.target.value)}
            onSubmit={handleFirstChat}
            isLoading={loading}
          />
        </div>
        {errorMessage && <p className="text-red-500 mt-2 text-sm">{errorMessage}</p>}
      </div>
    </>

  )
}
