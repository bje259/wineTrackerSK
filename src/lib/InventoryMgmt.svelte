<script lang="ts">
import * as Card from '$lib/components/ui/card';
import { myWineCellarFlat } from '$lib/store';
import type { InvItem, Wine, WineFlat } from '$lib/types';
import { Label } from 'flowbite-svelte';
import { createEventDispatcher, onMount } from 'svelte';
import { localStorageStore } from '@skeletonlabs/skeleton';
export let producer: string = '';
export let wine: Wine = {} as Wine;
export let index: number;
export let wineFlat: WineFlat;
/*{
	Producer: '',
	'Wine Name': '',
	'Vineyard Location': '',
	Variety: '',
	Inventory: [
		{
			Vintage: 0,
			Bin: '',
			Qty: 0,
			Purchased: ''
		}
	],
	Notes: ''
};*/

let invItem = {} as InvItem;

const dispatch = createEventDispatcher();
//todo update to use wineflat
let tempWines: Wine[] = [];
let tempWinesFlat: WineFlat[] = [];
//$: ownedWines = $myWineCellar.getWinesByProducer(producer) || [];

//todo update to use wineflat
/* function handleWineUpdated() {
	let storedValue = localStorage.getItem(producer) ?? '[]';
	try {
		tempWines = JSON.parse(storedValue);
	} catch (error) {
		console.error('Error parsing JSON from localStorage', error);
		tempWines = [];
	}
	console.log(`ZYyyyy Wine handleWineUpdated - tempWines: ${tempWines}`);
	myWineCellar.update((current) => {
		current.updateCellarByProducer(producer, tempWines);
		return current;
	});
	tempWines = []; */
dispatch('wineUpdated');
/* } */

onMount(() => {
	invItem = wineFlat.Inventory[index] ?? {
		Vintage: wineFlat.Inventory[index].Vintage,
		Bin: wineFlat.Inventory[index].Bin,
		Qty: wineFlat.Inventory[index].Qty,
		Purchased: wineFlat.Inventory[index].Purchased
	};
	let vint = 0;
	console.log('Zyyyyyyyoriginl mounted InvMgmt wineFlat:', wineFlat);
	//console.log(wineFlat);
	console.log('Zyyyyindex receivd?', index);
	//console.log(index);
	const tmpWine: Wine | undefined = $myWineCellarFlat.checkWineByNameVintage(
		wine['Wine Name'],
		vint as number
	);
	const tmpWineFlat: WineFlat | undefined = $myWineCellarFlat.checkWineByNameVintageFlat(
		wineFlat['Wine Name'],
		vint as number
	);
	producer = 'Chateau Margaux';
	wine = {
		'Wine Name': 'Margaux 2015',
		'Vineyard Location': 'Bordeaux, France',
		Variety: 'Cabernet Sauvignon',
		Vintage: 2015,
		Bin: 'A1',
		Qty: 10,
		Purchased: '2020-01-01',
		Notes: 'Excellent vintage'
	};
	/* invItem = [
		{
			Vintage: 2015,
			Bin: 'A1',
			Qty: 10,
			Purchased: '2020-01-01'
		}
	]; */
});

$: {
	console.log('zyyyyyyxyxy reactive inv mgmt check');
	console.log(JSON.stringify(wineFlat), null, 2);
}

//todo update to use wineflat
function qtyIncrementInv(e: MouseEvent) {
	console.log(`Zyyyyyyy Wine qtyIncrement - producer: - wine:`);
	console.log(JSON.stringify(wineFlat, null, 2));

	$myWineCellarFlat.increaseWineQty(wineFlat['Wine Name'], wineFlat.Inventory[index].Vintage, 1);
	dispatch('wineUpdated');

	/* console.log(`Zyyyyyyy Wine qtyIncrement - producer: - wine:`,producer, wineFlat);
	//console.log(wineFlat);
	console.log(`Zyyyyyyyy Wine qtyIncrement - wineFlat.Qty: for index`,index,invItem[0].Qty);

	invItem[0].Qty = invItem[0].Qty + 1;
	console.log(`Zyyyyyyy Wine qtyIncrement - wineFlat.Qty: `,invItem[0].Qty);
	let storedCellar: CellarFlat = [];
	try {
		storedCellar = (JSON.parse($storeExample) as CellarFlat) ?? [];
		console.log(`Zyyyyyyy Wine qtyIncrement - pulled producer's wines from local storage:`);
		console.log(storedCellar);
		myWineCellarFlat.update((current) => {
			current.updateCellarFlat(storedCellar);
			return current;
		});
		console.log('ZyyyyUpdated myWineCellar with storedCellarFlat');
		console.log($myWineCellarFlat.getWinesByProducer(producer));
		myWineCellarFlat.update((current) => {
			current.updateWine(producer, WineCellarFlat.convertWineFlatToWine(wineFlat), index);
			return current;
		});
		console.log(`ZyyyyyUpdated myWineCellar with wine
				${wineFlat['Wine Name']}
				${invItem[0].Qty}`);
		console.log('ZyyyyyNew myWineCellar wine entry:');
		console.log($myWineCellarFlat.getWinesByProducerWineName(producer, wine['Wine Name']));
		console.log('Zyyyyupdating local storage');
		storedCellar = $myWineCellarFlat.getCellarFlat();
		$storeExample = JSON.stringify(storedCellar);
		console.log('Zyyyylocal storage updated');
	} catch (error) {
		console.error('Error parsing JSON from localStorage', error);
		storedCellar = [];
	}
	storedCellar = []; */
}

//todo update to use wineflat
function qtyDecrementInv(e: MouseEvent): void {
	$myWineCellarFlat.increaseWineQty(wineFlat['Wine Name'], wineFlat.Inventory[index].Vintage, -1);
	dispatch('wineUpdated');

	/* console.log(`Zyyyyyyyy Wine qtyDecrement - producer: ${producer} - wine:`);
	console.log(wineFlat);
	console.log(`Zyyyyyyy Wine qtyDecrement - wineFlat.Qty: ${invItem[0].Qty}`);

	invItem[0].Qty = invItem[0].Qty - 1;
	console.log(`Zyyyyyyy Wine qtyDecrement - wineFlat.Qty: ${invItem[0].Qty}for index ${index}`);
	let storedCellar: CellarFlat = [];
	try {
		storedCellar = (JSON.parse($storeExample) as CellarFlat) ?? [];
		console.log(`Zyyyyyyy Wine qtyDecrement - pulled producer's wines from local storage:`);
		console.log(storedCellar);
		myWineCellarFlat.update((current) => {
			current.updateCellarFlat(storedCellar);
			return current;
		});
		console.log('ZyyyyyUpdated myWineCellar with storedCellarFlat');
		console.log($myWineCellarFlat.getWinesByProducer(producer));
		myWineCellarFlat.update((current) => {
			current.updateWine(producer, WineCellarFlat.convertWineFlatToWine(wineFlat), index);
			return current;
		});
		console.log(`ZyyyyUpdated myWineCellar with wine
				${wineFlat['Wine Name']}
				${invItem[0].Qty}`);
		console.log('ZyyyyNew myWineCellar wine entry:');
		console.log($myWineCellarFlat.getWinesByProducerWineName(producer, wine['Wine Name']));
		console.log('Zyyyyupdating local storage');
		storedCellar = $myWineCellarFlat.getCellarFlat();
		$storeExample = JSON.stringify(storedCellar);
		console.log('Zyyyylocal storage updated');
	} catch (error) {
		console.error('Error parsing JSON from localStorage', error);
		storedCellar = [];
	}
	storedCellar = [];
	dispatch('wineUpdated'); */
}

//setContext('decrement', qtyDecrement);

//todo update to use wineflat
function deleteWine() {
	$myWineCellarFlat.removeWineFlat(wineFlat);

	/* console.log(`Zyyyy Wine deleteWine - wine: ${wineFlat}`);
	console.log(`Zyyyy Wine deleteWine - wineFlat.Qty: ${invItem[0].Qty}`);
	if (invItem[0].Qty > 0) {
		invItem[0].Qty = 0;
		console.log(`ZY Wine deleteWine - wineFlat.Qty: ${invItem[0].Qty}`);
		let storedValue = $storeExample ?? '[]';
		let storedCellar: CellarFlat = [];
		try {
			storedCellar = JSON.parse(storedValue);
			console.log(`ZY Wine delete wine - pulled producer's wines from local storage:`);
			console.log(storedCellar);
			storedCellar.splice(index, 1);
			$storeExample = JSON.stringify(storedCellar);
			myWineCellarFlat.update((current) => {
				current.updateCellarFlat(storedCellar);
				return current;
			});
		} catch (error) {
			console.error('Error parsing JSON from localStorage', error);
			storedCellar = [];
		}
		console.log('Updated myWineCellar with tempWines');
		console.log($myWineCellarFlat.getWinesByProducer(producer));
		tempWines = [];
		console.log('dispatching wineUpdated');

		dispatch('wineUpdated');
	} */
}
</script>

{#if wineFlat && invItem}
	<Card.Root class="w-[200px] justify-center">
		<Card.Content class="p-3">
			<div class="flex flex-col">
				<div class="flex flex-auto justify-between">
					<p class="mb-4 text-base">
						Vintage: {invItem.Vintage? invItem.Vintage : 'N/A'}
						<br />Bin: {invItem.Bin? invItem.Bin : 'N/A'}
						{#if invItem.Purchased}<br />Purchase Date: {invItem.Purchased}{/if}
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
						<button class="w-12" on:click={qtyDecrementInv}>-</button>
						<Label class="w-12 p-2 text-center dark:text-black">{invItem.Qty}</Label>
						<button class="w-12" on:click={qtyIncrementInv}>+</button>
					</div>
				</div>
			</div>
		</Card.Content>
	</Card.Root>
{/if}
