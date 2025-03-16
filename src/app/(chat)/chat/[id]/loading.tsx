import { Skeleton } from "@/components/ui/skeleton";

export default function ChatSkeleton() {
    return (
        <div className="flex flex-col h-full w-full">
            {/* Chat Messages Area */}
            <div className="flex-1 overflow-y-auto p-4">
                <div className="flex flex-col gap-4 max-w-3xl mx-auto w-full">
                    {/* User Message Skeleton */}
                    <div className="flex justify-end">
                        <div className="max-w-[70%] p-3 rounded-lg ml-8">
                            <Skeleton className="h-4 w-16 mb-1" />
                            <Skeleton className="h-20 w-full" />
                        </div>
                    </div>

                    {/* AI Message Skeleton */}
                    <div className="flex justify-start">
                        <div className="max-w-[70%] p-3 rounded-lg mr-8">
                            <Skeleton className="h-4 w-16 mb-1" />
                            <Skeleton className="h-6 w-full" />
                        </div>
                    </div>

                    {/* User Message Skeleton */}
                    <div className="flex justify-end">
                        <div className="max-w-[70%] p-3 rounded-lg ml-8">
                            <Skeleton className="h-4 w-16 mb-1" />
                            <Skeleton className="h-12 w-full" />
                        </div>
                    </div>

                    {/* AI Message Skeleton */}
                    <div className="flex justify-start">
                        <div className="max-w-[70%] p-3 rounded-lg mr-8">
                            <Skeleton className="h-4 w-16 mb-1" />
                            <Skeleton className="h-6 w-full" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Input Area Skeleton */}
            <div className="p-4 border-t">
                <div className="max-w-3xl mx-auto w-full">
                    <div className="flex flex-col gap-2">
                        <div className="flex gap-2">
                            <Skeleton className="flex-1 h-10 rounded-md" />
                            <Skeleton className="h-10 w-10 rounded-md" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

}