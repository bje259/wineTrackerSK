import type { TBottle, TBottles } from '$lib/types';
import { fail } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms/server';
import type z from 'zod';
import type { Actions, PageServerLoad } from './$types';
import { bottleSchema, type BottleFormSchema } from './EditBottle.svelte';
export const load: PageServerLoad = () => {
	return {
		form: superValidate(bottleSchema),
		bottles: bottles
	};
};

function maxId(bottles: TBottles): number {
	let maxId = bottles.reduce((max, bottle) => Math.max(max, bottle.Id), 0);
	return maxId;
}

function resetForm(data: z.infer<BottleFormSchema>): void {
	data.wineName = '';
	data.vintage = 2020;
	data.producer = '';
	data.purchased = '01/01/1900';
	data.consumed = '01/01/1900';
}

let bottles: TBottles = [
	{
		Id: 1,
		Name: 'Barbera',
		Vintage: 2019,
		Producer: 'Becker Vineyards',
		Purchased: '03/01/2021',
		Consumed: '01/01/1900'
	},
	{
		Id: 2,
		Name: 'Barbera',
		Vintage: 2019,
		Producer: 'Becker Vineyards',
		Purchased: '03/01/2021',
		Consumed: '01/01/1900'
	},
	{
		Id: 3,
		Name: 'Barbera',
		Vintage: 2019,
		Producer: 'Becker Vineyards',
		Purchased: '03/01/2021',
		Consumed: '01/01/1900'
	}
];

export const actions: Actions = {
	newBottle: async (event) => {
		const form = await superValidate(event, bottleSchema);
		if (!form.valid) {
			return fail(400, {
				form
			});
		}
		const bottle: TBottle = {
			Id: maxId(bottles) + 1,
			Name: form.data.wineName,
			Vintage: form.data.vintage,
			Producer: form.data.producer,
			Purchased: form.data.purchased ? form.data.purchased : '01/01/1900',
			Consumed: form.data.consumed ? form.data.consumed : '01/01/1900'
		};
		bottles = [...bottles, bottle];
		resetForm(form.data);
		return {
			form
		};
	}
};
