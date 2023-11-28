import WineCellar from '$lib/WineCellar';
import { writable } from 'svelte/store';
export const myWineCellar = writable(new WineCellar()); // New store for myWineCellar
export const ownedWinesString = writable(''); // New store for ownedWinesString
