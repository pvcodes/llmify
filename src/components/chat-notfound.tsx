'use client'
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface ChatNotFoundProps {
    id: string;
}

export function ChatNotFound({ id }: ChatNotFoundProps) {
    const router = useRouter();

    return (
        <div className="flex flex-col h-full w-full items-center justify-center">

            <Card className="w-full max-w-md mx-auto p-6 text-center items-center">
                <CardContent className="space-y-4">
                    <p className="text-gray-500">
                        Chat with ID <strong>{id}</strong> not found.
                    </p>
                    <Button onClick={() => router.push('/new')} variant="outline">
                        Go Back
                    </Button>
                </CardContent>
            </Card>
        </div>

    );
}
