export interface Env {
	AI: any;
	chatlog: KVNamespace;
}

export default {
	async fetch(request: Request, env: Env): Promise<Response> {
		const url = new URL(request.url);

		if (url.pathname === '/ai') {
			const { message, animal = 'frog', userId = 'anonymous' } = Object.fromEntries(url.searchParams);
			console.log(userId, message);

			const maxTokens = 50;
			const maxWords = Math.round(maxTokens * 0.75);

			if (!message) return jsonResponse({ error: 'No message provided' }, 400);

			const systemMessage = `You are a ${animal === 'chicken' ? 'chicken. Respond with chicken-like enthusiasm' : 'frog. Respond with frog-like wisdom'}. Keep each response strictly under ${maxWords} words without enclosing quotation marks. Do not exceed ${maxWords} words.`;

			try {
				const messages = await getUpdatedChatHistory(env.chatlog, animal, userId, message, 1000);

				const stream = await env.AI.run('@cf/meta/llama-3.1-8b-instruct', {
					messages: [{ role: 'system', content: systemMessage }, ...messages],
					max_tokens: maxTokens,
					stream: true,
				});

				let fullResponse = '';
				let buffer = '';
				const processedStream = new TransformStream({
					transform(chunk, controller) {
						const text = new TextDecoder().decode(chunk);
						buffer += text;

						let endIndex;
						while ((endIndex = buffer.indexOf('\n')) !== -1) {
							const line = buffer.slice(0, endIndex);
							buffer = buffer.slice(endIndex + 1);

							if (line.startsWith('data: ')) {
								try {
									const jsonStr = line.slice(5).trim();
									if (jsonStr === '[DONE]') {
										controller.enqueue(new TextEncoder().encode('data: [DONE]\n\n'));
										return;
									}
									const parsed = JSON.parse(jsonStr);
									if (parsed.response) {
										fullResponse += parsed.response;
										controller.enqueue(new TextEncoder().encode(`data: ${JSON.stringify({ response: parsed.response })}\n\n`));
									}
								} catch (error) {
									console.log(error);
									// If parsing fails, we'll wait for more data
									buffer = line + '\n' + buffer;
									break;
								}
							}
						}
					},
					flush(controller) {
						const updatedMessages = [...messages, { role: 'assistant', content: fullResponse }];
						saveChatHistory(env.chatlog, animal, userId, updatedMessages).catch(console.error);
					},
				});

				return new Response(stream.pipeThrough(processedStream), {
					headers: {
						'Content-Type': 'text/event-stream',
						'Cache-Control': 'no-cache',
						Connection: 'keep-alive',
					},
				});
			} catch (error) {
				console.error('API error:', error);
				return jsonResponse({ error: 'AI processing failed' }, 500);
			}
		}

		return fetch(request);
	},
};

async function getUpdatedChatHistory(
	chatlog: KVNamespace,
	animal: string,
	userId: string,
	message: string,
	maxWords: number,
): Promise<any[]> {
	const history = JSON.parse((await chatlog.get(`${animal}:${userId}`)) || '[]');
	return truncateHistory([...history, { role: 'user', content: message }], maxWords);
}

async function saveChatHistory(chatlog: KVNamespace, animal: string, userId: string, messages: any[]): Promise<void> {
	await chatlog.put(`${animal}:${userId}`, JSON.stringify(messages));
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

function jsonResponse(data: object, status: number = 200): Response {
	return new Response(JSON.stringify(data), {
		status,
		headers: {
			'Content-Type': 'application/json',
			'Cache-Control': 'no-cache',
		},
	});
}
