<script lang='ts'>
	import AddSpecificWine from '$lib/AddSpecificWine.svelte';
	import WineComp from '$lib/WineComp.svelte';
	import { myWineCellar } from "$lib/store.js";
	import type { Cellar, Wine } from '$lib/types';
	import
		{
			Button,
			CloseButton,
			Input,
			Select,
			Spinner
		} from "flowbite-svelte";
	import { createEventDispatcher, onMount } from "svelte";
	import type { Writable } from 'svelte/store';
	import "../app.pcss";
	import './styles.css';
  	//import type {EventTarget} from 'svelte';
	

	//declarations
	let openNewWine = false;
	let openVerb = "Open";
	let ownedWines: Wine[] = [];
	let searchTerm = "";
	let selectedProducer = "";
	let selectedVariety = "";
	let selectedVineyard = "";
	//let ownedWinesString = "";
	let searchParams: { [paramName: string]: { name: string; value: string }[] } = {
		producer: [{ name: "All Producers", value: "" }],
		variety: [{ name: "All Varieties", value: "" }],
		vineyard: [{ name: "All Vineyards", value: "" }]
	};
	const dispatch = createEventDispatcher();
	let cellar: Cellar = $myWineCellar.getCellar();

	import { getContext } from 'svelte';

  const eventListenerStore: Writable<EventTarget> = getContext('eventListener');

  


//functions
function clearSearch(setter: (value: string) => void): void {
		setter("");
	}
	

// Load owned aspects from local storage on component mount
	onMount(() => {
		$myWineCellar.updateCellar(loadOwnedWinesFromLocalStorage());
		eventListenerStore.set(document);
		dispatch("wineUpdated", { detail: "wineUpdated" });
		cellar = $myWineCellar.getCellar();
		console.log("onMount called loading from local storage");
		console.log($myWineCellar.getCellar());

		updateDDLs();
	});

/**
 * Delete all wines from a producer
 * @param producer The producer to delete
 * @returns void
 * @example
 * deleteProducer("Chateau de la Tour");
 * // Deletes all wines from Chateau de la Tour
*/
	function deleteProducer(producer: string) {
		console.log("deleteProducer called");
		console.log(producer);
		localStorage.removeItem(producer);
		myWineCellar.update((current) => {
			if (current.removeProducer(producer)) {
				console.log("deleteProducer removed producer");
			} else {
				console.log("deleteProducer did not remove producer");
			}
			return current;
		});
		updateDDLs();
		dispatch("wineUpdated", { detail: "wineUpdated" });
	}

	function handleWinesUpdated() {
		// Update the local data or trigger a refresh
		console.log("handleWinesUpdated (App.svelte) called loading from local storage");
		$myWineCellar.updateCellar(loadOwnedWinesFromLocalStorage());
		dispatch("wineUpdated", { detail: "wineUpdated" });
		updateDDLs();
	}

	function updateDDLs() {
		console.log("updateDDLs called  - reseting searchParams");
		searchParams = {
			producer: [{ name: "All Producers", value: "" }],
			variety: [{ name: "All Varieties", value: "" }],
			vineyard: [{ name: "All Vineyards", value: "" }]
		};
		addOptions("producer", $myWineCellar.getProducerNames());
		addOptions("variety", $myWineCellar.getVarietyNames());
		addOptions("vineyard", $myWineCellar.getVineyardNames());
		console.log("updateDDLs searchParams");
		console.log(searchParams);
	}

	function addOptions(paramKey: string, newOptions: { name: string; value: string }[]) {
		if (searchParams[paramKey]) {
			searchParams[paramKey] = [...searchParams[paramKey], ...newOptions];
		} else {
			// Optionally handle the case where the paramKey does not exist
			searchParams[paramKey] = newOptions;

		}
	}
	function loadOwnedWinesFromLocalStorage(): Cellar {
		const loadedOwnedWines: Cellar = {};

		for (let i = 0; localStorage && i < localStorage.length; i++) {
			const key = localStorage.key(i) || "[]";
			if (key && key !== "theme" && key !== "_localization" && key !== "storeExample" ) {
				const values = localStorage.getItem(key);
				console.log("loadfromstorage key " + key);
				if (values) {
					try {
						loadedOwnedWines[key] = JSON.parse(values) as Wine[];
					} catch (error) {
						console.error(`Error parsing data for key "${key}":`, error);
					}
				}
			}
		}
		console.log("loadfromstorage loadedOwnedWines /n");
		console.log(loadedOwnedWines);
		return loadedOwnedWines;
	}


//reactive statements

$: {
		console.log("Reactive cellar in App.svelte updating from store");
		cellar = $myWineCellar.getFilteredCellar({
			searchterm: searchTerm,
			producer: selectedProducer,
			variety: selectedVariety,
			vineyard: selectedVineyard
		});
	}

	$: {
		console.log(`Reactive check key length ${Object.keys(cellar).length}`);
		if (Object.keys(cellar).length > 0) {
			ownedWines = Object.values(cellar).flat();
			//$ownedWinesString = JSON.stringify(ownedWines);
		}
		console.log("Printing ownedWines and ownedAspectsString");
		console.log(ownedWines);
		//console.log(ownedWinesString);
	}

//$ownedWinesString = JSON.stringify(ownedWines);

	$: updateDDLs();



</script>

<svelte:head>
	<title>Billy's Wine Cellar SK Version</title>
	<meta name="description" content="Billy's Wine Cellar SK Version" />
</svelte:head>




<section>
	<div class="p-4">
	<div class="mb-8 md:max-w-md mx-auto">
		<h1 class="text-2xl text-cyan-700 font-medium mb-4">Billy's Wine Cellar</h1>
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
	<div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
		{#if Object.keys(cellar).length > 0}
			{#each Object.keys(cellar) as producer (producer)}
				<div class="mb-8 flex flex-col justify-items-start">
					<h1 class="text-2xl text-cyan-500 font-medium mb-4">
						{producer}
					</h1>
					{#each cellar[producer] as wine, i (wine)}
						<WineComp {wine} {producer} index={i} on:wineUpdated={handleWinesUpdated} />
					{/each}
					<div
						class="grid grid-cols-1 gap-1 overflow-hidden bg-white border divide-x rounded-lg rtl:flex-row-reverse dark:bg-gray-800 dark:border-gray-700 dark:divide-gray-700"
					>
						<AddSpecificWine {producer} on:wineUpdated={handleWinesUpdated} />

						<Button
							type="button"
							class="text-white bg-gradient-to-r from-teal-400 via-teal-500 to-teal-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-teal-300 dark:focus:ring-teal-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center m-4"
							on:click={() => deleteProducer(producer)}
						>
							Delete all wines from producer
						</Button>
					</div>
				</div>
			{/each}
		{:else}
			<Spinner />
		{/if}
	</div>
</div>
</section>



