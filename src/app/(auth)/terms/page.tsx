import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import {
    ShieldCheckIcon,
    BookOpenIcon,
    GlobeLockIcon,
    TextQuoteIcon,
    ArrowLeft,
} from "lucide-react"
import ModeToggle from "@/components/ModeToggle"
import Link from "next/link"

export default function LegalDocuments() {
    const termsOfServiceSections = [
        {
            title: "1. Service Overview",
            icon: <GlobeLockIcon className="w-5 h-5 mr-2 text-primary" />,
            content: [
                {
                    subtitle: "Platform Description",
                    text: "LLMify is a unified AI platform providing seamless access to multiple Language Learning Models (LLMs) with flexible model switching capabilities."
                },
                {
                    subtitle: "User Access",
                    text: "Access is granted based on subscription tiers: Free, Premium (₹299/month), and Enterprise (₹999/month)."
                }
            ]
        },
        {
            title: "2. Usage Restrictions",
            icon: <ShieldCheckIcon className="w-5 h-5 mr-2 text-primary" />,
            content: [
                {
                    subtitle: "Prohibited Actions",
                    text: "Users are prohibited from reverse engineering, unauthorized access, or using the platform for malicious purposes."
                },
                {
                    subtitle: "Compliance",
                    text: "Users must comply with all applicable laws and platform guidelines."
                }
            ]
        },
        {
            title: "3. Subscription Terms",
            icon: <TextQuoteIcon className="w-5 h-5 mr-2 text-primary" />,
            content: [
                {
                    subtitle: "Billing",
                    text: "Subscriptions are auto-renewed. Users can cancel or change plans at any time."
                },
                {
                    subtitle: "Token Allocation",
                    text: "Free: 5,000 tokens, Premium: 2M tokens, Enterprise: Unlimited tokens"
                }
            ]
        }
    ]

    const privacySections = [
        {
            title: "1. Data Collection",
            icon: <BookOpenIcon className="w-5 h-5 mr-2 text-primary" />,
            content: [
                {
                    subtitle: "Information Collected",
                    text: "We collect minimal personal data including email and usage metrics interactions necessary for service provision."
                },
                {
                    subtitle: "Purpose",
                    text: "Data is used to personalize service, improve user experience, and maintain account functionality."
                }
            ]
        },
        {
            title: "2. Data Protection",
            icon: <ShieldCheckIcon className="w-5 h-5 mr-2 text-primary" />,
            content: [
                {
                    subtitle: "Security Measures",
                    text: "Implement industry-standard encryption, access controls, and secure infrastructure to protect user information."
                },
                {
                    subtitle: "API Key Management",
                    text: "User API keys are encrypted, never stored in plain text, and used only for authentication. User personal API Key of any provider are stored locally on browser"
                }
            ]
        }
    ]

    return (
        <div className="min-h-screen flex items-center justify-center p-4 antialiased">
            <Card className={cn(
                "w-full max-w-4xl mx-auto",
                "border border-opacity-10 shadow-xl",
                "rounded-xl overflow-hidden",
                "transition-all duration-300 ease-in-out"
            )}>
                <CardHeader className="py-4 border-b border-opacity-10 text-center">
                    <div className="w-full flex justify-between">
                        <Link className='underline text-blue-700 border-blue-100' href='/'>
                            <ArrowLeft />
                        </Link>
                        <ModeToggle /> </div>
                    <CardTitle className={cn(
                        "text-2xl font-bold tracking-tight",
                        "bg-gradient-to-r from-primary to-primary/70",
                        "bg-clip-text text-transparent"
                    )}>
                        LLMify Legal Documents
                    </CardTitle>
                </CardHeader>

                <CardContent className="p-6">
                    <Tabs defaultValue="terms" className="w-full">
                        <TabsList className="grid w-full grid-cols-2 mb-4">
                            <TabsTrigger value="terms">
                                <TextQuoteIcon className="w-4 h-4 mr-2" /> Terms of Service
                            </TabsTrigger>
                            <TabsTrigger value="privacy">
                                <ShieldCheckIcon className="w-4 h-4 mr-2" /> Privacy Statement
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="terms">
                            <ScrollArea className="h-[500px] pr-4">
                                <div className="space-y-4">
                                    <Accordion type="single" collapsible className="w-full space-y-2">
                                        {termsOfServiceSections.map((section, index) => (
                                            <AccordionItem
                                                key={index}
                                                value={`terms-section-${index}`}
                                                className={cn(
                                                    "border border-opacity-10 rounded-lg",
                                                    "transition-all duration-200"
                                                )}
                                            >
                                                <AccordionTrigger
                                                    className={cn(
                                                        "px-4 py-3 flex items-center",
                                                        "hover:no-underline",
                                                        "font-semibold tracking-tight"
                                                    )}
                                                >
                                                    {section.icon}
                                                    {section.title}
                                                </AccordionTrigger>
                                                <AccordionContent className="px-6 py-4 space-y-3">
                                                    {section.content.map((item, idx) => (
                                                        <div
                                                            key={idx}
                                                            className={cn(
                                                                "border-l-2 border-primary/50 pl-4",
                                                                "transition-all duration-300"
                                                            )}
                                                        >
                                                            <h4 className="text-base font-semibold mb-1">
                                                                {item.subtitle}
                                                            </h4>
                                                            <p className="text-sm opacity-70 leading-relaxed">
                                                                {item.text}
                                                            </p>
                                                        </div>
                                                    ))}
                                                </AccordionContent>
                                            </AccordionItem>
                                        ))}
                                    </Accordion>
                                </div>
                            </ScrollArea>
                        </TabsContent>

                        <TabsContent value="privacy">
                            <ScrollArea className="h-[500px] pr-4">
                                <div className="space-y-4">
                                    <Accordion type="single" collapsible className="w-full space-y-2">
                                        {privacySections.map((section, index) => (
                                            <AccordionItem
                                                key={index}
                                                value={`privacy-section-${index}`}
                                                className={cn(
                                                    "border border-opacity-10 rounded-lg",
                                                    "transition-all duration-200"
                                                )}
                                            >
                                                <AccordionTrigger
                                                    className={cn(
                                                        "px-4 py-3 flex items-center",
                                                        "hover:no-underline",
                                                        "font-semibold tracking-tight"
                                                    )}
                                                >
                                                    {section.icon}
                                                    {section.title}
                                                </AccordionTrigger>
                                                <AccordionContent className="px-6 py-4 space-y-3">
                                                    {section.content.map((item, idx) => (
                                                        <div
                                                            key={idx}
                                                            className={cn(
                                                                "border-l-2 border-primary/50 pl-4",
                                                                "transition-all duration-300"
                                                            )}
                                                        >
                                                            <h4 className="text-base font-semibold mb-1">
                                                                {item.subtitle}
                                                            </h4>
                                                            <p className="text-sm opacity-70 leading-relaxed">
                                                                {item.text}
                                                            </p>
                                                        </div>
                                                    ))}
                                                </AccordionContent>
                                            </AccordionItem>
                                        ))}
                                    </Accordion>
                                </div>
                            </ScrollArea>
                        </TabsContent>
                    </Tabs>

                    <div className="mt-4 text-center">
                        <p className="text-xs opacity-60">
                            Last Updated: {new Date().toLocaleDateString()}
                        </p>
                        <p className="text-sm mt-2">
                            Questions? Contact us at{" "}
                            <a
                                href="mailto:hi@llmify.xyz"
                                className="text-primary hover:underline"
                            >
                                hi@llmify.xyz
                            </a>
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
