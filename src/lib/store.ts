import WineCellar from '$lib/WineCellar';
import WineCellarFlat from '$lib/WineCellarFlat';
import { localStorageStore } from '@skeletonlabs/skeleton';
import type { Writable } from 'svelte/store';
import { writable } from 'svelte/store';
export const myWineCellar = writable(new WineCellar()); // New store for myWineCellar
export const myWineCellarFlat = writable(new WineCellarFlat());
export const ownedWinesString = writable(''); // New store for ownedWinesString
export const useNewDataType = writable(true);
export const storeExample: Writable<string> = localStorageStore('storeExample', '[]');
//export const testWineFlat: Writable<string> = localStorageStore('testWineFlat', '[]');
