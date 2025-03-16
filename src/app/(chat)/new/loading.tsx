"use client"

import { Button } from "@/components/ui/button"
import { LoaderCircle } from "lucide-react"

export default function Loading() {
    return (
        <div className="flex flex-col items-center justify-center h-screen px-4 sm:px-6 md:px-8 lg:px-10">
            {/* Skeleton form mimicking the NewChat layout */}
            <div className="flex w-full max-w-2xl gap-2 animate-pulse">
                {/* Skeleton Input */}
                <div className="flex-1 h-10 bg-gray-200 dark:bg-gray-700 rounded-md" />
                {/* Skeleton Button */}
                <Button disabled className="w-12">
                    <LoaderCircle className="w-5 h-5 animate-spin" />
                </Button>
            </div>
        </div>
    )
}