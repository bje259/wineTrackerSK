import { writable } from 'svelte/store';
import WineCellar from './WineCellar';
import WineCellarFlat from './WineCellarFlat';
export const myWineCellar = writable(new WineCellar()); // New store for myWineCellar
export const myWineCellarFlat = writable(new WineCellarFlat());
