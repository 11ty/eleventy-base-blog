import { z } from "zod";
import { fromZodError } from 'zod-validation-error';

export default function(data) {
	// Draft content, validate `draft` front matter
	let result = z.object({
		draft: z.boolean().or(z.undefined()),
	}).safeParse(data);

	if(result.error) {
		throw fromZodError(result.error);
	}
}
