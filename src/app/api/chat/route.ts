import { createOpenAI } from "@ai-sdk/openai";
import { streamText } from "ai";

const openai = createOpenAI({
	apiKey: "sk-proj-BN92IHglAqlOa2Np5vWV3BlbkFJYnOpQXpWNHc45G9Ec1p3",
});

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
	const { messages } = await req.json();

	const result = streamText({
		model: openai("gpt-4o"),
		messages,
	});

	return result.toDataStreamResponse();
}
