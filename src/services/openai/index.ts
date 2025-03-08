// import OpenAI from "openai";

// // const client = new OpenAI({
// // 	apiKey: process.env["OPENAI_API_KEY"], // This is the default and can be omitted
// // });

// // async function main() {
// // 	const chatCompletion = await client.chat.completions.create({
// // 		messages: [{ role: "user", content: "Say this is a test" }],
// // 		model: "gpt-4o",
// // 	});
// // }

// // main();
// export default class OpenAi {
// 	private client;
// 	private BASE_URL = "https://api.openai.com/v1/chat/completions";

// 	constructor(apiKey: string) {
// 		this.client = new OpenAI({ apiKey });
// 	}
// 	chatCompletion() {
// 		return "hello";
// 	}
// 	models() {
// 		return this.client.models.list();
// 	}
// }

import OpenAI from "openai";

const openai = new OpenAI({
	apiKey: "sk-proj-BN92IHglAqlOa2Np5vWVT3BlbkFJYnOpQXpWNHc45G9Ec1p3",
});

async function main() {
	const stream = await openai.beta.chat.completions.stream({
		model: "gpt-4o",
		messages: [{ role: "user", content: "Say this is a test" }],
		stream: true,
	});

	stream.on("content", (delta, snapshot) => {
		process.stdout.write(delta);
	});

	// or, equivalently:
	for await (const chunk of stream) {
		process.stdout.write(chunk.choices[0]?.delta?.content || "");
	}

	const chatCompletion = await stream.finalChatCompletion();
	console.log(chatCompletion); // {id: "…", choices: […], …}
}

main();
