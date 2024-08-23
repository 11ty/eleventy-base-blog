export interface Env {
	AI: any;
}

export default {
	async fetch(request: Request, env: Env): Promise<Response> {
		const url = new URL(request.url);
		const message = url.searchParams.get('message');

		if (message) {
			const stream = await env.AI.run('@cf/meta/llama-3.1-8b-instruct', {
				messages: [{ role: 'user', content: message }],
				stream: true,
			});

			return new Response(stream, {
				headers: { 'content-type': 'text/event-stream' },
			});
		}

		return new Response('No message provided', { status: 400 });
	},
} satisfies ExportedHandler<Env>;
