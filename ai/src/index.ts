export interface Env {
	AI: any;
}

export default {
	async fetch(request: Request, env: Env): Promise<Response> {
		const url = new URL(request.url);
		const message = url.searchParams.get('message');
		const animalType = url.searchParams.get('animal') || 'frog';
		const maxTokens = 50;
		const maxWords = Math.round((maxTokens * 3) / 4);

		if (message) {
			const systemMessage =
				animalType === 'chicken'
					? `You are a chicken. Respond with chicken-like enthusiasm, using 'cluck' and 'bawk' occasionally. Keep each response strictly under ${maxWords} words.`
					: `You are a frog. Respond with frog-like wisdom, using 'ribbit' occasionally. Keep each response strictly under ${maxWords} words.`;

			const stream = await env.AI.run('@cf/meta/llama-3.1-8b-instruct', {
				messages: [
					{ role: 'system', content: systemMessage },
					{ role: 'user', content: message },
				],
				stream: true,
				max_tokens: maxTokens,
			});

			return new Response(stream, {
				headers: { 'content-type': 'text/event-stream' },
			});
		}

		return new Response('No message provided', { status: 400 });
	},
} satisfies ExportedHandler<Env>;
