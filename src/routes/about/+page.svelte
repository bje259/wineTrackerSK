<script lang="ts">
import { browser } from '$app/environment';
import { myWineCellar, myWineCellarFlat } from '$lib/ClassStores';
import InventoryMgmt from '$lib/InventoryMgmt.svelte';
import * as Card from '$lib/components/ui/card';
import { ownedWinesString, storeExample, useNewDataType } from '$lib/store';
import type { CellarFlat, Wine, WineFlat } from '$lib/types';
import { Label } from 'flowbite-svelte';
import { createEventDispatcher } from 'svelte';

export let producer: string = 'Chateau Margaux';
export let wine: Wine = {
	'Wine Name': 'Margaux 2015',
	'Vineyard Location': 'Bordeaux, France',
	Variety: 'Cabernet Sauvignon',
	Vintage: 2015,
	Bin: 'A1',
	Qty: 10,
	Notes: 'Excellent vintage'
};

export let wineFlat: WineFlat = {
	Producer: 'Sciandri',
	'Wine Name': 'Nello Coombsville',
	'Vineyard Location': 'Napa Valley',
	Variety: 'Red Blend',
	Inventory: [{ Vintage: 2016, Bin: '14-2', Qty: 1, Purchased: '' }],
	Notes: ''
};
export let index: number = 0;
wineFlat =
	$myWineCellarFlat.checkWineByNameVintageFlat(wine['Wine Name'], wine.Vintage) ?? wineFlat;
//wineFlat = WineCellarFlat.convertWineToFlat(producer, wine);
const dispatch = createEventDispatcher();

let tempWines: Wine[] = [];
let tempWinesFlat: WineFlat[] = [];
$: ownedWines = $myWineCellarFlat.getWinesByProducer(producer) || [];
$: ownedWinesFlat = $myWineCellarFlat.getCellarFlat() || [];

function handleWineUpdated() {
	// Update the local data or trigger a refresh
	let tmpCellar: CellarFlat = [];
	if (browser) {
		console.log('xxxxxloading cell flat from storage store');
		tmpCellar = JSON.parse($storeExample) as CellarFlat;
		$myWineCellarFlat.updateCellarFlat(tmpCellar);
	}
	if ($useNewDataType) {
		$ownedWinesString = JSON.stringify($myWineCellarFlat.getCellarFlat());
		//updateDDLs();
		return;
	}
	let tempCellar: CellarFlat = JSON.parse($storeExample) as CellarFlat;
	console.log('handleWinesUpdated (App.svelte) called loading from local storage');
	$myWineCellarFlat.updateCellarFlat(tempCellar);
	$ownedWinesString = JSON.stringify(tempCellar);
	//if (browser) $storeExample = JSON.stringify(tempCellar);
	//updateDDLs();
}
function qtyIncrement() {
	console.log(`ZY Wine qtyIncrement - producer: ${producer} - wine:`);
	console.log(wine);
	console.log(`ZY Wine qtyIncrement - wine.Qty: ${wineFlat.Inventory[index].Qty}`);
	let qty = wineFlat.Inventory[index].Qty;
	qty = qty + 1;
	console.log(`ZY Wine qtyIncrement - wine.Qty: ${qty}`);
	let storedValue = localStorage.getItem(producer) ?? '[]';
	try {
		tempWinesFlat = JSON.parse(storedValue) as WineFlat[];
		console.log(`ZY Wine qtyIncrement - pulled producer's wines from local storage:`);
		console.log(tempWinesFlat);
		myWineCellarFlat.update((current) => {
			current.updateCellarFlat(tempWinesFlat);
			return current;
		});
		console.log('Updated myWineCellar with tempWines');
		console.log(JSON.stringify($myWineCellarFlat.getCellarFlat(), null, 2));
		myWineCellar.update((current) => {
			current.updateWine(producer, wine, index);
			return current;
		});
		console.log(`Updated myWineCellar with wine
				${wine['Wine Name']}
				${qty}`);
		console.log('New myWineCellar wine entry:');
		console.log($myWineCellar.getWinesByProducerWineName(producer, wine['Wine Name']));
		console.log('updating local storage');
		tempWines = $myWineCellar.getWinesByProducer(producer) ?? [];
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

function qtyDecrement() {
	console.log(`ZY Wine qtyDecrement - producer: ${producer} - wine:`);
	console.log(wine);
	console.log(`ZY Wine qtyDecrement - wine.Qty: ${wine.Qty}`);
	if (wine.Qty > 0) {
		wine.Qty = wine.Qty - 1;
		console.log(`ZY Wine qtyDecrement - wine.Qty: ${wine.Qty}`);
		let storedValue = localStorage.getItem(producer) ?? '[]';
		try {
			tempWines = JSON.parse(storedValue);
			console.log(`ZY Wine qtyDecrement - pulled producer's wines from local storage:`);
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
			tempWines = $myWineCellar.getWinesByProducer(producer) ?? [];
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

function doSomething() {
	console.log('doSomething called');
}

function deleteWine() {
	console.log(`ZY Wine deleteWine - wine: ${wine}`);
	console.log(`ZY Wine deleteWine - wine.Qty: ${wine.Qty}`);
	if (wine.Qty > 0) {
		wine.Qty = 0;
		console.log(`ZY Wine deleteWine - wine.Qty: ${wine.Qty}`);
		let storedValue = localStorage.getItem(producer) ?? '[]';
		try {
			tempWines = JSON.parse(storedValue);
			console.log(`ZY Wine delete wine - pulled producer's wines from local storage:`);
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

<svelte:head>
	<title>Sandbox Area</title>
	<meta name="description" content="About this app" />
</svelte:head>

<Card.Root class="w-[200px] justify-center">
	<Card.Content class="p-3">
		<div class="flex flex-col">
			<div class="flex flex-auto justify-between">
				<p class="mb-4 text-base">
					Vintage: {wine.Vintage ? `${wine.Vintage} ` : ""}
					<br />Bin: {wine.Bin ? `${wine.Bin} ` : ""}
					{#if wine.Purchased}<br />Purchase Date: {wine.Purchased ? `${wine.Purchased} ` : ""}{/if}
				</p>
				<button
					class="variant-soft chip justify-around self-start hover:variant-filled"
					on:click={deleteWine}
				>
					<span>❌</span>
				</button>
			</div>

			<Label
				for="counter-input-example"
				class="flex-shrink-1 bottom-0 col-span-2 mb-1 block content-end self-start text-sm font-medium text-gray-900 dark:text-white"
				>Choose quantity:</Label
			>
			<div class="inset-0 top-0 col-span-3 row-span-1 inline-flex border-l-transparent">
				<div class="variant-filled bg-secondary-400-500-token btn-group dark:divide-gray-700">
					<button class="w-12" on:click={qtyDecrement}>-</button>
					<Label class="w-12 p-2 text-center dark:text-black">{wine.Qty}</Label>
					<button class="w-12" on:click={qtyIncrement}>+</button>
				</div>
			</div>
		</div>
	</Card.Content>
</Card.Root>

<div class="card w-[200px]">
	<section class="p-3">
		<div class="flex flex-col">
			<div class="flex flex-auto justify-between">
				<p class="mb-4 text-base">
					Vintage: {wine.Vintage ? `${wine.Vintage} ` : ""}
					<br />Bin: {wine.Bin ? `${wine.Bin} ` : ""}
					{#if wine.Purchased}<br />Purchase Date: {wine.Purchased ? `${wine.Purchased} ` : ""}{/if}
				</p>
				<button
					class="variant-soft chip justify-around self-start hover:variant-filled"
					on:click={deleteWine}
				>
					<span>❌</span>
				</button>
			</div>

			<Label
				for="counter-input-example"
				class="flex-shrink-1 bottom-0 col-span-2 mb-1 block content-end self-start text-sm font-medium text-gray-900 dark:text-white"
				>Choose quantity:</Label
			>
			<div class="inset-0 top-0 col-span-3 row-span-1 inline-flex border-l-transparent">
				<div class="variant-filled bg-secondary-400-500-token btn-group dark:divide-gray-700">
					<button class="w-12" on:click={qtyDecrement}>-</button>
					<Label class="w-12 p-2 text-center dark:text-black">{wine.Qty}</Label>
					<button class="w-12" on:click={qtyIncrement}>+</button>
				</div>
			</div>
		</div>
	</section>
</div>
<InventoryMgmt
	wine={wine}
	producer={producer}
	index={index}
	wineFlat={wineFlat}
	on:wineUpdated={handleWineUpdated}
/>
