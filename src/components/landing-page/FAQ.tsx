import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Link from "next/link";

interface FAQProps {
  question: string;
  answer: string;
  value: string;
}

const FAQList: FAQProps[] = [
  {
    question: "Is LLMify free to use?",
    answer: "LLMify offers a free plan with access to basic features. Premium plans are available for enhanced capabilities.",
    value: "item-1",
  },
  {
    question: "What is the Universal API Key?",
    answer: "The Universal API Key is provided by LLMify to access various models with ease, eliminating the need for multiple API subscriptions and reducing costs.",
    value: "item-2",
  },
  {
    question: "How can I change models during a chat?",
    answer: "With LLMify, you can seamlessly switch between models during a chat session to find the best fit for your needs.",
    value: "item-3",
  },
  {
    question: "What models are available on LLMify?",
    answer: "LLMify provides access to a diverse range of language models, including popular options like GPT, Gemini, and DeepSeek.",
    value: "item-4",
  },
  {
    question: "How does LLMify ensure data privacy?",
    answer: "LLMify prioritizes user privacy and data security, implementing industry-standard measures to protect your information.",
    value: "item-5",
  },
];

export const FAQ = () => {
  return (
    <section
      id="faq"
      className="container py-24 sm:py-32"
    >
      <h2 className="text-3xl md:text-4xl font-bold mb-4">
        Frequently Asked{" "}
        <span className="bg-gradient-to-b from-primary/60 to-primary text-transparent bg-clip-text">
          Questions
        </span>
      </h2>

      <Accordion
        type="single"
        collapsible
        className="w-full AccordionRoot"
      >
        {FAQList.map(({ question, answer, value }: FAQProps) => (
          <AccordionItem
            key={value}
            value={value}
          >
            <AccordionTrigger className="text-left">
              {question}
            </AccordionTrigger>

            <AccordionContent>{answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      <h3 className="font-medium mt-4">
        Still have questions?{" "}
        <Link
          rel="noreferrer noopener"
          href="mailto:hi@llmify.xyz"
          className="text-primary transition-all border-primary hover:border-b-2"
        >
          Contact us
        </Link>
      </h3>
    </section>
  );
};
