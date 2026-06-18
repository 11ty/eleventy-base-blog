import { z } from "zod";

// Draft content, validate `draft` front matter
export default function() {
	return function(data) {
		// Note that drafts may be skipped in a preprocessor (see eleventy.config.js)
		// when doing a standard build (not --serve or --watch)
		let result = z.object({
			draft: z.coerce.boolean().default(false)
		}).safeParse(data);

		if(result.error) {
			throw result.error;
		}
	}
}
