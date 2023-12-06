<script lang="ts">
import { browser } from '$app/environment';
import AddSpecificWine from '$lib/AddSpecificWine.svelte';
import WineCellarFlat from '$lib/WineCellarFlat';
import WineComp from '$lib/WineComp.svelte';
import { Skeleton } from '$lib/components/ui/skeleton';
import { myWineCellar, myWineCellarFlat, storeExample, useNewDataType } from '$lib/store.js';
import type { Cellar, CellarFlat, Wine, WineFlat } from '$lib/types';
import { Button, CloseButton, Input, Select } from 'flowbite-svelte';
import { createEventDispatcher, onMount } from 'svelte';
import type { Writable } from 'svelte/store';
import '../app.pcss';
import './styles.css';
//import type {EventTarget} from 'svelte';
//todo update to use wineflat
//declarations
let openNewWine = false;
let openVerb = 'Open';
let ownedWines: Wine[] = [];
let searchTerm = '';
let selectedProducer = '';
let selectedVariety = '';
let selectedVineyard = '';
//let ownedWinesString = "";
let debugMode = false;
let searchParams: { [paramName: string]: { name: string; value: string }[] } = {
	producer: [{ name: 'All Producers', value: '' }],
	variety: [{ name: 'All Varieties', value: '' }],
	vineyard: [{ name: 'All Vineyards', value: '' }]
};
const dispatch = createEventDispatcher();
let cellar: Cellar = $myWineCellar.getCellar();
let cellarFlat: CellarFlat = [];
let producerList: string[] = [];
let sortedWines: { [producer: string]: WineFlat[] } = {};
let showThisWine: { [Producer: string]: boolean } = {};

import { getContext } from 'svelte';

let blackList = [
	'theme',
	'_localization',
	'mode',
	'modeCurrent',
	'storeExample',
	'modeUserPrefers',
	'modeOsPrefers'
];

const eventListenerStore: Writable<EventTarget> = getContext('eventListener');
$: debugMode = getContext('debugMode');

//functions
function clearSearch(setter: (value: string) => void): void {
	setter('');
}

function isIterable(obj) {
	return obj != null && typeof obj[Symbol.iterator] === 'function';
}

// todo this shouldn't need to happen twice skip myWinceCellar.updateCellar
// Load owned aspects from local storage on component mount
onMount(() => {
	eventListenerStore.set(document);
	dispatch('wineUpdated', { detail: 'wineUpdated' });
	if (!debugMode && !$useNewDataType) {
		$myWineCellar.updateCellar(loadOwnedWinesFromLocalStorage());

		cellar = $myWineCellar.getCellar();
		console.log('onMount called loading from local storage');
		console.log($myWineCellar.getCellar());

		updateDDLs();
	}
});

//todo with wineflat update, this may not be needed, just delete individual wines
/**
 * Delete all wines from a producer
 * @param producer The producer to delete
 * @returns void
 * @example
 * deleteProducer("Chateau de la Tour");
 * // Deletes all wines from Chateau de la Tour
 */
function deleteProducer(producer: string) {
	console.log('deleteProducer called');
	console.log(producer);

	if ($useNewDataType) {
		myWineCellarFlat.update((current) => {
			if (current.removeProducer(producer)) {
				console.log('deleteProducer removed producer');
			} else {
				console.log('deleteProducer did not remove producer');
			}
			return current;
		});
		$storeExample = JSON.stringify($myWineCellarFlat.getCellarFlat());
	} else {
		localStorage.removeItem(producer);
		myWineCellar.update((current) => {
			if (current.removeProducer(producer)) {
				console.log('deleteProducer removed producer');
			} else {
				console.log('deleteProducer did not remove producer');
			}
			return current;
		});
	}
	updateDDLs();
	dispatch('wineUpdated', { detail: 'wineUpdated' });
}

function handleWinesUpdated() {
	// Update the local data or trigger a refresh
	if (!debugMode) {
		console.log('handleWinesUpdated (App.svelte) called loading from local storage');
		//$myWineCellar.updateCellar(loadOwnedWinesFromLocalStorage());
	}
	dispatch('wineUpdated', { detail: 'wineUpdated' });
	updateDDLs();
}
//todo make sure works with wineflat does this need to exist in layout and page?
function updateDDLs() {
	console.log('updateDDLs called  - reseting searchParams');
	searchParams = {
		producer: [{ name: 'All Producers', value: '' }],
		variety: [{ name: 'All Varieties', value: '' }],
		vineyard: [{ name: 'All Vineyards', value: '' }]
	};
	if (browser) {
		cellarFlat = $myWineCellarFlat.getFilteredCellarFlat({
			searchterm: searchTerm,
			producer: selectedProducer,
			variety: selectedVariety,
			vineyard: selectedVineyard
		});
		console.log(cellarFlat);
		producerList = cellarFlat.map((element) => element['Producer']);
		sortedWines = producerList.reduce((acc, cur) => {
			acc[cur] = cellarFlat.filter((wine) => wine.Producer === cur);
			return acc;
		}, {});
		console.log('updateDDLs called  - adding searchParams');
		$myWineCellarFlat.getProducerNames().forEach((element) => console.log(element.name));
		addOptions('producer', $myWineCellarFlat.getProducerNames());
		addOptions('variety', $myWineCellarFlat.getVarietyNames());
		addOptions('vineyard', $myWineCellarFlat.getVineyardNames());
		console.log('updateDDLs searchParams');
		console.log(searchParams);
		return;
	}

	if ($myWineCellar.getProducerCount() > 0 && !$useNewDataType) {
		console.log(
			'updateDDLs called  - adding searchParams producer count is ' +
				$myWineCellar.getProducerCount()
		);
		$myWineCellar.getProducerNames().forEach((element) => console.log(element.name));
		addOptions('producer', $myWineCellar.getProducerNames());
		addOptions('variety', $myWineCellar.getVarietyNames());
		addOptions('vineyard', $myWineCellar.getVineyardNames());
		console.log('updateDDLs searchParams using old data');
		console.log(searchParams);
	}
}

//todo determine if needed on layout and page, this doesn't match the one in layout
function addOptions(paramKey: string, newOptions: { name: string; value: string }[]) {
	if (searchParams[paramKey]) {
		searchParams[paramKey] = [...searchParams[paramKey], ...newOptions];
	} else {
		// Optionally handle the case where the paramKey does not exist
		searchParams[paramKey] = newOptions;
	}
}
//todo does this need to exist here?
function loadOwnedWinesFromLocalStorage(): Cellar {
	const loadedOwnedWines: Cellar = {};

	for (let i = 0; localStorage && i < localStorage.length; i++) {
		const key = localStorage.key(i) || '[]';
		if (key && !blackList.includes(key)) {
			const values = localStorage.getItem(key);
			console.log('loadfromstorage key ' + key);
			if (values) {
				try {
					if (!isIterable(JSON.parse(values))) continue;
					loadedOwnedWines[key] = JSON.parse(values) as Wine[];
				} catch (error) {
					console.error(`Error parsing data for key "${key}":`, error);
				}
			}
		}
	}
	console.log('loadfromstorage loadedOwnedWines /n');
	console.log(loadedOwnedWines);
	return loadedOwnedWines;
}

//reactive statements
//todo turn back on when ready to do more than initial wines
//todo update to use wineflat
/*$: {
	console.log('Reactive cellar in App.svelte updating from store');
	cellar = $myWineCellar.getFilteredCellar({
		searchterm: searchTerm,
		producer: selectedProducer,
		variety: selectedVariety,
		vineyard: selectedVineyard
	});
}
*/

/*$: {
	console.log(`Reactive check key length ${Object.keys(cellar).length}`);
	if (Object.keys(cellar).length > 0) {
		ownedWines = Object.values(cellar).flat();
		//$ownedWinesString = JSON.stringify(ownedWines);
	}
	console.log('Printing ownedWines and ownedAspectsString');
	console.log(ownedWines);
	//console.log(ownedWinesString);
}
*/
//$ownedWinesString = JSON.stringify(ownedWines);

$: {
	console.log('Reactive DDL update');
	updateDDLs();
}
cellarFlat = $myWineCellarFlat.getCellarFlat();
console.log('Reactive cellar in page.svelte updating from store');
console.log(cellarFlat);
console.log(
	`search term: ${searchTerm} producer: ${selectedProducer} variety: ${selectedVariety} vineyard: ${selectedVineyard}`
);

$: if (browser) {
	cellarFlat = $myWineCellarFlat.getFilteredCellarFlat({
		searchterm: searchTerm,
		producer: selectedProducer,
		variety: selectedVariety,
		vineyard: selectedVineyard
	});
	console.log(cellarFlat);
	producerList = cellarFlat.map((element) => element['Producer']);
	sortedWines = producerList.reduce((acc, cur) => {
		acc[cur] = cellarFlat.filter((wine) => wine.Producer === cur);
		return acc;
	}, {});
}

$: {
	console.log(`producerList current:`);
	console.log(producerList);
	console.log('sortedWines current:');
	console.log(sortedWines);
}

function showWine(producer: string): boolean {
	//console.log(`showWine called with wineFlat`);
	//console.log(producer);
	if (sortedWines[producer] && Object.keys(sortedWines[producer]).length > 0) {
		//console.log(`showWine found wineFlat.Producer`);
		//console.log(producer);
		return true;
	}
	return false;
}

$: console.log(`show key count to debug ${Object.keys(sortedWines).length}`);

$: {
	console.log(`showThisWine current:`);
	console.log(showThisWine);
}

$: if (browser) {
	//console.log('turning producer list into producer bool map');
	let tmpShowThisWine = {};
	producerList.forEach((element) => {
		tmpShowThisWine[element] = showWine(element);
	});
	showThisWine = tmpShowThisWine;
	//console.log(showThisWine);
}
</script>

<svelte:head>
	<title>Billy's Wine Cellar SK Version</title>
	<meta name="description" content="Billy's Wine Cellar SK Version" />
</svelte:head>

<section>
	<div class="p-4">
		<div class="mx-auto mb-8 grid md:max-w-md">
			<h1 class="mb-4 justify-self-center text-2xl font-medium text-cyan-700">
				Billy's Wine Cellar
			</h1>
			<Input bind:value={searchTerm} placeholder="Search by keyword" class="mt-2">
				<CloseButton slot="right" on:click={() => clearSearch((v) => (searchTerm = v))} />
			</Input>
			<Select
				placeholder="Select a producer"
				class="mt-2"
				items={searchParams.producer}
				bind:value={selectedProducer}
			/>
			<Select
				placeholder="Select a variety"
				class="mt-2"
				items={searchParams.variety}
				bind:value={selectedVariety}
			/>
			<Select
				placeholder="Select a vineyard"
				class="mt-2"
				items={searchParams.vineyard}
				bind:value={selectedVineyard}
			/>
			<AddSpecificWine producer={"_New Producer"} on:wineUpdated={handleWinesUpdated} />
		</div>
		<!--todo update for wineflat-->
		<!--todo incorporate toggle for different sorts-->
		<div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
			{#if Object.keys(sortedWines).length > 0}
				{#each Object.keys(sortedWines) as producer (producer)}
					{#if showThisWine[producer]}
						<div class="mb-8 flex flex-col justify-items-start">
							<h1 class="mb-4 text-2xl font-medium text-cyan-500">
								{producer}
							</h1>
							{#each sortedWines[producer] as wine, index (wine)}
								<WineComp
									wine={WineCellarFlat.convertWineFlatToWine(wine)}
									producer={producer}
									{index}
									wineFlat={wine}
									on:wineUpdated={handleWinesUpdated}
								/>
							{/each}

							<div
								class="grid grid-cols-1 gap-1 divide-x overflow-hidden rounded-lg border bg-white rtl:flex-row-reverse dark:divide-gray-700 dark:border-gray-700 dark:bg-gray-800"
							>
								<AddSpecificWine producer={producer} on:wineUpdated={handleWinesUpdated} />

								<Button
									type="button"
									class="m-4 rounded-lg bg-gradient-to-r from-teal-400 via-teal-500 to-teal-600 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-gradient-to-br focus:outline-none focus:ring-4 focus:ring-teal-300 dark:focus:ring-teal-800"
									on:click={() => deleteProducer(producer)}
								>
									Delete all wines from producer
								</Button>
							</div>
						</div>
					{/if}
				{/each}
			{:else}
				<div class="flex items-center space-x-4">
					<Skeleton class="h-12 w-12 rounded-full" />
					<div class="space-y-2">
						<Skeleton class="h-4 w-[250px]" />
						<Skeleton class="h-4 w-[200px]" />
						<Skeleton class="h-4 w-[150px]" />
						<Skeleton class="h-4 w-[200px]" />
						<Skeleton class="h-4 w-[150px]" />
					</div>
				</div>
			{/if}
		</div>
	</div>
</section>
