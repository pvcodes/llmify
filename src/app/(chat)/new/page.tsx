"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { LoaderCircle, SendHorizonal, Terminal } from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import useChatStore from "@/store/useChatStore"
import { generateId } from "ai"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import Link from "next/link"

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

      const chatId = generateId()
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
        <form onSubmit={handleFirstChat} className="flex w-full max-w-2xl gap-2">
          <Input
            className="flex-1"
            value={prompt}
            placeholder="Ask me anything..."
            onChange={(e) => setPrompt(e.target.value)}
            disabled={loading}
          />
          <Button type="submit" disabled={loading}>
            {loading ? <LoaderCircle className="animate-spin" /> : <SendHorizonal className="w-5 h-5" />}
          </Button>
        </form>
        {errorMessage && <p className="text-red-500 mt-2 text-sm">{errorMessage}</p>}
      </div>
    </>

  )
}
