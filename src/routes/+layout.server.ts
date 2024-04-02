import type { RequestEvent } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { zod } from 'sveltekit-superforms/adapters';
import { z } from 'zod';
import { superValidate } from 'sveltekit-superforms';

const schema = z.object({
	courseName: z.string(),
	courseNumber: z.string()
});

export const load: PageServerLoad = async (event: RequestEvent) => {
	const form = await superValidate(zod(schema));

	if (event.locals.user) {
		return {
			user: event.locals.user,
			form
		};
	}

	return { form };
};
