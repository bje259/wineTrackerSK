<script lang="ts">
//import WineCellar from './WineCellar';
import { Button, Label } from 'flowbite-svelte';
import { createEventDispatcher } from 'svelte';
import { myWineCellar } from './store';
import type { Wine } from './types';

// increment the value of the input field
//counterInput.increment();

// decrement the value of the input field
//if (counterInput) counterInput.decrement();

const dispatch = createEventDispatcher();

//todo update export to be wineflat
export let producer: string;
export let wine: Wine;
export let index: number;

let tempWines: Wine[] = [];
$: ownedWines = $myWineCellar.getWinesByProducer(producer) || [];

//todo update to just pass along to parent
function handleWineUpdated() {
	let storedValue = localStorage.getItem(producer) ?? '[]';
	try {
		tempWines = JSON.parse(storedValue);
	} catch (error) {
		console.error('Error parsing JSON from localStorage', error);
		tempWines = [];
	}
	console.log(`ZZ Wine handleWineUpdated - tempWines: ${tempWines}`);
	myWineCellar.update((current) => {
		current.updateCellarByProducer(producer, tempWines);
		return current;
	});
	tempWines = [];
	dispatch('wineUpdated');
}
//todo update to use wineflat
function qtyIncrement() {
	console.log(`ZZ Wine qtyIncrement - producer: ${producer} - wine:`);
	console.log(wine);
	console.log(`ZZ Wine qtyIncrement - wine.Qty: ${wine.Qty}`);

	wine.Qty = wine.Qty + 1;
	console.log(`ZZ Wine qtyIncrement - wine.Qty: ${wine.Qty}`);
	let storedValue = localStorage.getItem(producer) ?? '[]';
	try {
		tempWines = JSON.parse(storedValue);
		console.log(`ZZ Wine qtyIncrement - pulled producer's wines from local storage:`);
		console.log(tempWines);
		myWineCellar.update((current) => {
			current.updateCellarByProducer(producer, tempWines);
			return current;
		});
		console.log('Updated myWineCellar with tempWines');
		console.log($myWineCellar.getWinesByProducer(producer));
		myWineCellar.update((current) => {
			current.updateWine(producer, wine, index);
			return current;
		});
		console.log(`Updated myWineCellar with wine
				${wine['Wine Name']}
				${wine.Qty}`);
		console.log('New myWineCellar wine entry:');
		console.log($myWineCellar.getWinesByProducerWineName(producer, wine['Wine Name']));
		console.log('updating local storage');
		tempWines = $myWineCellar.getWinesByProducer(producer);
		let tempWinesString = JSON.stringify(tempWines);
		localStorage.setItem(producer, tempWinesString);
		console.log('local storage updated');
	} catch (error) {
		console.error('Error parsing JSON from localStorage', error);
		tempWines = [];
	}
	tempWines = [];
	dispatch('wineUpdated');
}
//todo update to use wineflat
function qtyDecrement() {
	console.log(`ZZ Wine qtyDecrement - producer: ${producer} - wine:`);
	console.log(wine);
	console.log(`ZZ Wine qtyDecrement - wine.Qty: ${wine.Qty}`);
	if (wine.Qty > 0) {
		wine.Qty = wine.Qty - 1;
		console.log(`ZZ Wine qtyDecrement - wine.Qty: ${wine.Qty}`);
		let storedValue = localStorage.getItem(producer) ?? '[]';
		try {
			tempWines = JSON.parse(storedValue);
			console.log(`ZZ Wine qtyDecrement - pulled producer's wines from local storage:`);
			console.log(tempWines);
			myWineCellar.update((current) => {
				current.updateCellarByProducer(producer, tempWines);
				return current;
			});
			console.log('Updated myWineCellar with tempWines');
			console.log($myWineCellar.getWinesByProducer(producer));
			myWineCellar.update((current) => {
				current.updateWine(producer, wine, index);
				return current;
			});
			console.log(`Updated myWineCellar with wine
				${wine['Wine Name']}
				${wine.Qty}`);
			console.log('New myWineCellar wine entry:');
			console.log($myWineCellar.getWinesByProducerWineName(producer, wine['Wine Name']));
			console.log('updating local storage');
			tempWines = $myWineCellar.getWinesByProducer(producer);
			let tempWinesString = JSON.stringify(tempWines);
			localStorage.setItem(producer, tempWinesString);
			console.log('local storage updated');
		} catch (error) {
			console.error('Error parsing JSON from localStorage', error);
			tempWines = [];
		}

		tempWines = [];
		dispatch('wineUpdated');
	} else {
		console.log('Error wine cannot go below 0');
	}
}
//todo update to use wineflat
function deleteWine() {
	console.log(`ZZ Wine deleteWine - wine: ${wine}`);
	console.log(`ZZ Wine deleteWine - wine.Qty: ${wine.Qty}`);
	if (wine.Qty > 0) {
		wine.Qty = 0;
		console.log(`ZZ Wine deleteWine - wine.Qty: ${wine.Qty}`);
		let storedValue = localStorage.getItem(producer) ?? '[]';
		try {
			tempWines = JSON.parse(storedValue);
			console.log(`ZZ Wine delete wine - pulled producer's wines from local storage:`);
			console.log(tempWines);
			tempWines.splice(index, 1);
			if (tempWines.length === 0) {
				localStorage.removeItem(producer);
			} else {
				localStorage.setItem(producer, JSON.stringify(tempWines));
			}
			myWineCellar.update((current) => {
				current.updateCellarByProducer(producer, tempWines);
				return current;
			});
		} catch (error) {
			console.error('Error parsing JSON from localStorage', error);
			ownedWines = [];
		}
		console.log('Updated myWineCellar with tempWines');
		console.log($myWineCellar.getWinesByProducer(producer));
		tempWines = [];
		console.log('dispatching wineUpdated');

		dispatch('wineUpdated');
	}
}
</script>
<!-- todo use each loop to create inventory management cards-->
<div class="mb-8 flex flex-col">
	<h3 class="left-0 mb-2 text-lg font-medium text-amber-600">
		Name: {wine["Wine Name"]}<br />Vineyard Location: {wine["Vineyard Location"]}<br />Variety: {wine.Variety
			? `(${wine.Variety})`
			: ""}
	</h3>
	<div class="flex flex-col">
		<div class="grid grid-cols-3">
			<p class="mb-4 flex-grow text-base">
				Vintage: {wine.Vintage ? `${wine.Vintage} ` : ""}
				<br />Bin: {wine.Bin ? `${wine.Bin} ` : ""}
			</p>
			<Button class="col-start-3 flex-shrink-0 self-start justify-self-end" on:click={deleteWine}
				>Delete</Button
			>
		</div>
		<div
			class="flex-shrink-1 col-start-1 col-end-4 ml-2 grid grid-flow-col grid-cols-6 grid-rows-2 gap-1 divide-x overflow-hidden rounded-lg rtl:flex-row-reverse"
		>
			<Label
				for="counter-input-example"
				class="flex-shrink-1 bottom-0 col-span-2 mb-1 block content-end self-end text-sm font-medium text-gray-900 dark:text-white"
				>Choose quantity:</Label
			>
			<div class="inset-0 top-0 col-span-3 row-span-1 inline-flex border-l-transparent">
				<Button
					type="button"
					class="fon inline-flex h-5 w-5 flex-shrink-0  items-center justify-center rounded-md border-transparent   bg-gray-100 text-black hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-100 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-700"
					on:click={qtyDecrement}
				>
					-
				</Button>

				<Label class=" inline-flex">Qty: {Number.isFinite(wine.Qty) ? `${wine.Qty} ` : ""}</Label>
				<Button
					type="button"
					class="inline-flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-md border border-gray-300 bg-gray-100 text-black hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-700"
					on:click={qtyIncrement}
				>
					+
				</Button>
			</div>
		</div>
		<p class="mb-4 flex-grow text-base">
			<br />Purchase Date: {wine.Purchased ? `${wine.Purchased} ` : ""}
			{#if wine.Notes !== undefined && wine.Notes !== null && wine.Notes !== ""}
				<br />
				Notes: {wine.Notes}
			{/if}
		</p>
	</div>
</div>
