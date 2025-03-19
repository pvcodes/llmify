'use client'
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useSession } from "next-auth/react";
// import { GITHUB_REPO_URL } from "@/lib/constant";

export default function SupportForm() {
    const { data: session } = useSession();
    const [formData, setFormData] = useState({
        subject: '',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!session?.user) {
            setSubmitStatus('Please sign in to submit a query');
            return;
        }

        setIsSubmitting(true);
        setSubmitStatus(null);

        try {
            const response = await fetch('/api/submit-query', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    subject: formData.subject,
                    message: formData.message,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to submit query');
            }

            setSubmitStatus('Query submitted successfully! We will get back to you ASAP');
            setFormData({ subject: '', message: '' });
        } catch (error) {
            setSubmitStatus('Error submitting query. Please try again.');
            console.error('Submission error:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-6">
            {/* <div className="mb-8 border-l-4 border-blue-600 pl-4">
                <p className="text-lg font-semibold">
                    Are you a developer and want to fix a bug you found?{' '}
                    <Link
                        href={GITHUB_REPO_URL}
                        className="text-blue-600 hover:underline font-bold"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Head over to GitHub
                    </Link>
                    {' '}to create an issue or maybe submit your fix!
                </p>
            </div> */}

            <h1 className="text-3xl font-bold mb-6">LLMify Support</h1>

            <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                        id="email"
                        type="email"
                        className="w-full"
                        value={session?.user?.email || ''}
                        disabled
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Input
                        id="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        placeholder="Brief summary of your query"
                        className="w-full"
                        required
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <p className="text-sm text-muted-foreground">If you have screenshots, upload here <Link href='https://imgbb.com' className="text-blue-700 hover:text-blue-400 underline">imgbb</Link> and add the link below</p>
                    <Textarea
                        id="message"
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="Describe your query or doubt in detail"
                        className="w-full min-h-[150px]"
                        required
                    />
                </div>

                {submitStatus && (
                    <p className={`text-sm ${submitStatus.includes('Error') ? 'text-red-600' : 'text-green-600'}`}>
                        {submitStatus}
                    </p>
                )}

                <Button
                    type="submit"
                    className="w-full"
                    disabled={isSubmitting || !session?.user}
                >
                    {isSubmitting ? 'Submitting...' : 'Submit Query'}
                </Button>
            </form>
        </div>
    );
}