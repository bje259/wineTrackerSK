import type { WineFlat } from '$lib/types';
import { localStorageStore } from '@skeletonlabs/skeleton';
import { persisted } from 'svelte-persisted-store';
import type { Writable } from 'svelte/store';
import { writable } from 'svelte/store';
export const ownedWinesString = writable(''); // New store for ownedWinesString
export const useNewDataType = writable(true);
export const nextId: Writable<number> = localStorageStore('nextId', 5);
export const storeExample: Writable<string> = localStorageStore('storeExample', '[]');
export const testNewStore = persisted('testNew', {
	Producer: 'Chateau Margaux',
	'Wine Name': 'Margaux 2015',
	'Vineyard Location': 'Bordeaux, France',
	Variety: 'Cabernet Sauvignon',
	Inventory: [
		{
			Vintage: 2015,
			Bin: 'A1',
			Qty: 10,
			Purchased: '2020-01-01'
		}
	],
	Notes: 'Excellent vintage'
} as WineFlat);
