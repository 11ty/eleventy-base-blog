export interface Env {
	AI: any;
	chatlog: KVNamespace;
}

export default {
	async fetch(request: Request, env: Env): Promise<Response> {
		const url = new URL(request.url);

		if (url.pathname === '/ai') {
			const { message, animal = 'frog', userId = 'anonymous' } = Object.fromEntries(url.searchParams);
			const maxTokens = 50;
			const maxWords = Math.round((maxTokens * 3) / 4);

			if (!message) {
				return jsonResponse({ error: 'No message provided' }, 400);
			}

			const systemMessage = `You are a ${animal === 'chicken' ? 'chicken. Respond with chicken-like enthusiasm' : 'frog. Respond with frog-like wisdom'}. Keep each response strictly under ${maxWords} words without enclosing quotation marks.`;

			try {
				const chatHistory = await getChatHistory(env.chatlog, animal, userId);
				const messages = updateChatHistory(chatHistory, message, 1000);

				const aiResponse = await env.AI.run('@cf/meta/llama-3.1-8b-instruct', {
					messages: [{ role: 'system', content: systemMessage }, ...messages],
					max_tokens: maxTokens,
				});

				const responseText = extractResponseText(aiResponse);
				await saveChatHistory(env.chatlog, animal, userId, [...messages, { role: 'assistant', content: responseText }]);

				return jsonResponse({ response: responseText });
			} catch (error) {
				console.error('API error:', error);
				return jsonResponse({ error: 'AI processing failed' }, 500);
			}
		}

		return fetch(request);
	},
};

async function getChatHistory(chatlog: KVNamespace, animal: string, userId: string): Promise<any[]> {
	const history = await chatlog.get(`${animal}:${userId}`);
	return history ? JSON.parse(history) : [];
}

function updateChatHistory(history: any[], message: string, maxWords: number): any[] {
	const updatedHistory = [...history, { role: 'user', content: message }];
	return truncateHistory(updatedHistory, maxWords);
}

function truncateHistory(messages: any[], maxWords: number): any[] {
	let wordCount = 0;
	return messages
		.reverse()
		.filter((msg) => {
			const words = (typeof msg.content === 'string' ? msg.content : JSON.stringify(msg.content)).split(/\s+/);
			if (wordCount + words.length <= maxWords) {
				wordCount += words.length;
				return true;
			}
			return false;
		})
		.reverse();
}

async function saveChatHistory(chatlog: KVNamespace, animal: string, userId: string, messages: any[]): Promise<void> {
	await chatlog.put(`${animal}:${userId}`, JSON.stringify(messages));
}

function extractResponseText(aiResponse: any): string {
	return typeof aiResponse === 'string' ? aiResponse : aiResponse.response || JSON.stringify(aiResponse);
}

function jsonResponse(data: object, status: number = 200): Response {
	return new Response(JSON.stringify(data), {
		status,
		headers: {
			'Content-Type': 'application/json',
			'Cache-Control': 'no-cache',
		},
	});
}
