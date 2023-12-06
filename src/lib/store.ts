import WineCellar from '$lib/WineCellar';
import WineCellarFlat from '$lib/WineCellarFlat';
import { localStorageStore } from '@skeletonlabs/skeleton';
import type { Writable } from 'svelte/store';
import { writable } from 'svelte/store';
export const myWineCellar = writable(new WineCellar()); // New store for myWineCellar
export const ownedWinesString = writable(''); // New store for ownedWinesString
export const myWineCellarFlat = writable(new WineCellarFlat()); // New store for myWineCellarFlat
export const useNewDataType = writable(true);
export const storeExample: Writable<string> = localStorageStore('storeExample', '[]');
