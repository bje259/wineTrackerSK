<script lang='ts'>
	import { browser } from '$app/environment';
	import ThemeSwitch from '$lib/ThemeSwitch/ThemeSwitch.svelte';
	import { myWineCellar, ownedWinesString } from "$lib/store.js";
	import type { Cellar, Wine } from '$lib/types';
	import { localStorageStore } from '@skeletonlabs/skeleton';
	import
		{
			Button,
			Modal,
			Textarea
		} from "flowbite-svelte";
	import { createEventDispatcher, onMount, setContext } from "svelte";
	import { Hamburger } from "svelte-hamburgers";
	import { writable, type Writable } from 'svelte/store';
	import "../app.pcss";
	import presetList from "../lib/presetList.json";
	import Header from './Header.svelte';
	import './styles.css';
	
 
 // import EventTarget from 'svelte';

 	const storeExample: Writable<string> = localStorageStore('storeExample', 'initialValueHere');
  const eventListenerStore: Writable<EventTarget> = writable();

	setContext('eventListener', eventListenerStore);

	//let ownedWinesString = "";
	let importWinesString = "";
	let cellar: Cellar = $myWineCellar.getCellar();
	
	let searchParams: { [paramName: string]: { name: string; value: string }[] } = {
		producer: [{ name: "All Producers", value: "" }],
		variety: [{ name: "All Varieties", value: "" }],
		vineyard: [{ name: "All Vineyards", value: "" }]
	};
	
	let open = false;
	let importModal = false;
	let exportModal = false;
	const dispatch  = createEventDispatcher();
	
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
function handleWinesUpdated() {
		// Update the local data or trigger a refresh
		let tempCellar: Cellar = loadOwnedWinesFromLocalStorage();
		console.log("handleWinesUpdated (App.svelte) called loading from local storage");
		$myWineCellar.updateCellar(tempCellar);
		$ownedWinesString = JSON.stringify(tempCellar);
		if (browser) $storeExample=JSON.stringify(tempCellar);
		updateDDLs();
	}

	function addOptions(paramKey: string, newOptions: { name: string; value: string }[]) {
		if (searchParams[paramKey]) {
			searchParams[paramKey] = [...searchParams[paramKey], ...newOptions];
		} else {
			// Optionally handle the case where the paramKey does not exist
		}
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

	

	

	// Load owned aspects from local storage on component mount
	onMount(() => {
		$myWineCellar.updateCellar(loadOwnedWinesFromLocalStorage());
		dispatch("wineUpdated", { detail: "wineUpdated" });
		cellar = $myWineCellar.getCellar();
		console.log("onMount called loading from local storage");
		console.log($myWineCellar.getCellar());

		updateDDLs();
	});

	function importData(e: MouseEvent): void {
		if (importWinesString === "") {
			return;
		}
		const importWines: Cellar = JSON.parse(importWinesString) as Cellar;

		// Save owned Wines to local storage
		for (const key in importWines) {
			const values = importWines[key];
			localStorage.setItem(key, JSON.stringify(values));
		}

		importWinesString = "";
		importModal = false;
	}

	function copyText(e: MouseEvent): void {
		navigator.clipboard
			.writeText($ownedWinesString)
			.then(() => {
				alert("Copied Aspects to Clipboard");
			})
			.catch(() => {
				alert("something went wrong");
			});
	}

	function loadPreset() {
		//$myWineCellar.updateCellar(presetList);
		// Save owned Wines to local storage
		let importWines: Cellar = presetList;
		for (const key in importWines) {
			const values = importWines[key];
			localStorage.setItem(key, JSON.stringify(values));
		}
		console.log("loadPreset called");
		console.log(presetList);
		//updateDDLs();
		cellar = $myWineCellar.getCellar();
		
		//dispatch("wineUpdated", { detail: "wineUpdated" });
	}

$: if (cellar) {
	$ownedWinesString = JSON.stringify(cellar);
	if (browser) $storeExample=JSON.stringify(cellar);
}

	$: eventListenerStore.subscribe((eventListener) => {
    if (eventListener) {
      eventListener.addEventListener('wineUpdated', (e:CustomEvent) => {
        console.log('Event received in layout:', e.detail);
		handleWinesUpdated();
      });
    }
  });

  $: {
	//console.log($storeExample);
	if(browser&&localStorage.getItem('storeExample') === null){
	//console.log(localStorage.getItem('storeExample'));
  }}
</script>

<Modal title="Import Wines" bind:open={importModal} autoclose>
	<Textarea bind:value={importWinesString} />
	<Button on:click={importData}>Import</Button>
</Modal>

<Modal title="Export Aspects" bind:open={exportModal} autoclose>
	<Textarea bind:value={$ownedWinesString} readonly />
	<Button on:click={copyText}>Copy</Button>
</Modal>
<div class="flex flex-shrink left-0">
<Hamburger --color="grey" bind:open />
{#if open}
	<Button on:click={() => (exportModal = true)}>Export</Button>
	<Button on:click={() => (importModal = true)}>Import</Button>
	<Button on:click={loadPreset}>Load Billy's Preset Wine List</Button>
{/if}
</div>
<ThemeSwitch />


<div class="app">
	<Header></Header>

	<main>
		<slot></slot>
	</main>

	<footer>
	</footer>
</div>




<style>
	.app {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
	}

	main {
		flex: 1;
		display: flex;
		flex-direction: column;
		padding: 1rem;
		width: 100%;
		max-width: 64rem;
		margin: 0 auto;
		box-sizing: border-box;
	}

	footer {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		padding: 12px;
	}

	@media (min-width: 480px) {
		footer {
			padding: 12px 0;
		}
	}
</style>
