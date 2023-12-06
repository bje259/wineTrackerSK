<script lang="ts">
//import WineCellar from './WineCellar';
import { createEventDispatcher } from 'svelte';
import InventoryMgmt from './InventoryMgmt.svelte';
import WineCellarFlat from './WineCellarFlat';
import { myWineCellar, myWineCellarFlat, storeExample } from './store';
import type { CellarFlat, Wine, WineFlat } from './types';

// increment the value of the input field
//counterInput.increment();

// decrement the value of the input field
//if (counterInput) counterInput.decrement();

const dispatch = createEventDispatcher();

//todo update export to be wineflat
export let producer: string;
export let wine: Wine;
export let index: number;
export let wineFlat: WineFlat;

let tempWines: Wine[] = [];
$: ownedWines = $myWineCellarFlat.getWinesByProducer(producer) || [];

//todo update to just pass along to parent
function handleWineUpdated() {
	/*let storedCellarFlat: CellarFlat = [];
	try {
		storedCellarFlat = JSON.parse($storeExample);
	} catch (error) {
		console.error('Error parsing JSON from localStorage', error);
		storedCellarFlat = [];
	}
	console.log(`ZZ Wine handleWineUpdated - tempWines: ${storedCellarFlat}`);
	myWineCellarFlat.update((current) => {
		current.updateCellarFlat(storedCellarFlat);
		return current;
	});
	tempWines = [];*/
	dispatch('wineUpdated');
}
//todo update to use wineflat
function qtyIncrement() {
	console.log(`ZZ Wine qtyIncrement - producer: ${producer} - wine:`);
	console.log(wineFlat);
	console.log(`ZZ Wine qtyIncrement - wine.Qty: ${wineFlat.Inventory[index].Qty}`);

	wineFlat.Inventory[index].Qty = wineFlat.Inventory[index].Qty + 1;
	console.log(`ZZ Wine qtyIncrement - wine.Qty: ${wineFlat.Inventory[index].Qty}`);
	let storedCellar: CellarFlat = [];
	try {
		storedCellar = (JSON.parse($storeExample) as CellarFlat) ?? [];
		console.log(`ZZ Wine qtyIncrement - pulled producer's wines from local storage:`);
		console.log(storedCellar);
		myWineCellarFlat.update((current) => {
			current.updateCellarFlat(storedCellar);
			return current;
		});
		console.log('Updated myWineCellar with storedCellarFlat');
		console.log($myWineCellarFlat.getWinesByProducer(producer));
		myWineCellar.update((current) => {
			current.updateWine(producer, WineCellarFlat.convertWineFlatToWine(wineFlat), index);
			return current;
		});
		console.log(`Updated myWineCellar with wine
				${wineFlat['Wine Name']}
				${wineFlat.Inventory[index].Qty}`);
		console.log('New myWineCellar wine entry:');
		console.log($myWineCellarFlat.getWinesByProducerWineName(producer, wine['Wine Name']));
		console.log('updating local storage');
		storedCellar = $myWineCellarFlat.getCellarFlat();
		$storeExample = JSON.stringify(storedCellar);
		console.log('local storage updated');
	} catch (error) {
		console.error('Error parsing JSON from localStorage', error);
		storedCellar = [];
	}
	storedCellar = [];
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
	<div class="flex flex-row">
		{#each wineFlat.Inventory as inv, index (inv)}
			<InventoryMgmt
				producer={producer}
				wineFlat={wineFlat}
				wine={wine}
				index={index}
				on:wineUpdated={handleWineUpdated}
			/>
		{/each}

		{#if wine.Notes !== undefined && wine.Notes !== null && wine.Notes !== ""}
			<p>
				Notes: {wine.Notes}
			</p>
		{/if}
	</div>
</div>
