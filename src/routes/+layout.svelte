<script lang="ts">
import { browser } from '$app/environment';
import { myWineCellar, myWineCellarFlat } from '$lib/ClassStores';
import WineCellarFlat from '$lib/WineCellarFlat';
import { ownedWinesString, storeExample, useNewDataType } from '$lib/store.js';
import type { Cellar, CellarFlat, Wine } from '$lib/types';
import { AppBar, LightSwitch } from '@skeletonlabs/skeleton';
import {
	Button,
	CloseButton,
	Drawer,
	Modal,
	Sidebar,
	SidebarDropdownItem,
	SidebarDropdownWrapper,
	SidebarGroup,
	SidebarItem,
	SidebarWrapper,
	Textarea
} from 'flowbite-svelte';
import {
	ArrowRightToBracketSolid,
	BagSolid,
	ChartPieSolid,
	FileEditSolid,
	GridSolid,
	MailBoxSolid,
	ShoppingCartSolid,
	UsersSolid
} from 'flowbite-svelte-icons';
import { createEventDispatcher, onMount, setContext } from 'svelte';
import { Hamburger } from 'svelte-hamburgers';
import { sineIn } from 'svelte/easing';
import { writable, type Writable } from 'svelte/store';
import '../app.pcss';
import presetList from '../lib/presetList.json';
import presetListupdateforFlat from '../lib/presetListupdateforFlat.json';
import Header from './Header.svelte';
import './styles.css';
let hidden2 = true;
let spanClass = 'flex-1 ml-3 whitespace-nowrap';
let transitionParams = {
	x: -320,
	duration: 200,
	easing: sineIn
};

// import EventTarget from 'svelte';

const eventListenerStore: Writable<EventTarget> = writable();
const debugMode = true;
setContext('eventListener', eventListenerStore);
setContext('debugMode', debugMode);
//let ownedWinesString = "";
let importWinesString = '';
let cellar: Cellar = $myWineCellar.getCellar();
let cellarFlat: CellarFlat = [];

let searchParams: { [paramName: string]: { name: string; value: string }[] } = {
	producer: [{ name: 'All Producers', value: '' }],
	variety: [{ name: 'All Varieties', value: '' }],
	vineyard: [{ name: 'All Vineyards', value: '' }]
};
let blackList = [
	'theme',
	'_localization',
	'mode',
	'modeCurrent',
	'storeExample',
	'modeUserPrefers',
	'modeOsPrefers'
];

let open = false;
let initialQuickload = false;
let importModal = false;
let exportModal = false;
const dispatch = createEventDispatcher();

//rdy for bool
function loadOwnedWinesInitial(): Cellar {
	const loadedOwnedWines: Cellar = {};
	let tmpCellar: CellarFlat = [];
	if (browser) {
		console.log('xxxxxloading cell flat from storage store');
		tmpCellar = JSON.parse($storeExample) as CellarFlat;
		$myWineCellarFlat.updateCellarFlat(tmpCellar);
		cellarFlat = tmpCellar;
	}
	let count = 0;
	if (!$useNewDataType) return WineCellarFlat.convertToCellar(tmpCellar);
	for (let i = 0; localStorage && i < localStorage.length && count < 10; i++) {
		const key = localStorage.key(i) || '[]';
		console.log(`key ${key} in blackList ${blackList.includes(key)}`);
		if (key && !blackList.includes(key)) {
			const values = localStorage.getItem(key);
			console.log('init loadfromstorage key ' + key);
			if (values) {
				try {
					if (JSON.parse(values).length > 10) continue;
					loadedOwnedWines[key] = JSON.parse(values) as Wine[];
					count += loadedOwnedWines[key].length || 0;
				} catch (error) {
					console.error(`Error parsing init data for key "${key}":`, error);
				}
			}
		}
	}
	console.log('init loadfromstorage loadedOwnedWines /n');
	console.log(loadedOwnedWines);
	console.log(JSON.parse($storeExample));
	//console.log($myWineCellar.getCellar());
	if (Object.keys(loadedOwnedWines).length > 0) initialQuickload = true;
	return loadedOwnedWines;
}

$: if (browser) {
	console.log(
		'XxXxXtrying to output cellar flat' + $myWineCellarFlat.getCellarFlat().length || 'Fail'
	);
	console.log($myWineCellar.getAllWinesFlat());
	console.log('Updating flat from store');
	let tmpCellar: CellarFlat = [];
	if (browser) {
		console.log('xxxxxloading cell flat from storage store');
		tmpCellar = JSON.parse($storeExample) as CellarFlat;
		$myWineCellarFlat.updateCellarFlat(tmpCellar);
	}
}
$: if (browser && !initialQuickload) {
	$myWineCellar.updateCellar(loadOwnedWinesInitial());
	//invalidateAll();
}

//rdy for bool
function loadOwnedWinesFromLocalStorage(): CellarFlat {
	let tmpCellar: CellarFlat = [];
	if (browser) {
		console.log('xxxxxloading cell flat from storage store');
		tmpCellar = JSON.parse($storeExample) as CellarFlat;
		$myWineCellarFlat.updateCellarFlat(tmpCellar);
	}

	return tmpCellar;

	/*for (let i = 0; localStorage && i < localStorage.length; i++) {
		const key = localStorage.key(i) || '[]';
		console.log(`key ${key} in blackList ${blackList.includes(key)}`);
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
	return loadedOwnedWines;*/
}

//rdy for bool
function handleWinesUpdated() {
	// Update the local data or trigger a refresh
	let tmpCellar: CellarFlat = [];
	if (browser) {
		console.log('xxxxxloading cell flat from storage store');
		tmpCellar = JSON.parse($storeExample) as CellarFlat;
		$myWineCellarFlat.updateCellarFlat(tmpCellar);
	}
	if ($useNewDataType) {
		$ownedWinesString = JSON.stringify($myWineCellarFlat.getCellarFlat());
		updateDDLs();
		return;
	}
	let tempCellar: CellarFlat = loadOwnedWinesFromLocalStorage();
	console.log('handleWinesUpdated (App.svelte) called loading from local storage');
	$myWineCellarFlat.updateCellarFlat(tempCellar);
	$ownedWinesString = JSON.stringify(tempCellar);
	//if (browser) $storeExample = JSON.stringify(tempCellar);
	updateDDLs();
}

function addOptions(paramKey: string, newOptions: { name: string; value: string }[]) {
	if (searchParams[paramKey]) {
		searchParams[paramKey] = [...searchParams[paramKey], ...newOptions];
	} else {
		// Optionally handle the case where the paramKey does not exist
		searchParams[paramKey] = newOptions;
	}
}
//todo update to use wineflat
//rdy for bool
function updateDDLs() {
	console.log('updateDDLs called  - reseting searchParams');
	searchParams = {
		producer: [{ name: 'All Producers', value: '' }],
		variety: [{ name: 'All Varieties', value: '' }],
		vineyard: [{ name: 'All Vineyards', value: '' }]
	};
	if ($useNewDataType && $myWineCellarFlat.getProducerCount() > 0) {
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
		console.log('updateDDLs called  - adding searchParams');
		$myWineCellar.getProducerNames().forEach((element) => console.log(element.name));
		addOptions('producer', $myWineCellar.getProducerNames());
		addOptions('variety', $myWineCellar.getVarietyNames());
		addOptions('vineyard', $myWineCellar.getVineyardNames());
		console.log('updateDDLs searchParams using old data');
		console.log(searchParams);
	}
}

$: console.log($myWineCellarFlat.getProducerCount());

async function loadDataAsync() {
	const data = loadOwnedWinesFromLocalStorage();
	// Process your data if needed
	return Promise.resolve(data); // This wraps the result in a Promise
}

// Load owned aspects from local storage on component mount
onMount(async () => {
	const data = await loadDataAsync();
	if (!debugMode) {
		//$myWineCellar.updateCellar(data);
		dispatch('wineUpdated', { detail: 'wineUpdated' });
		cellar = WineCellarFlat.convertToCellar(data);
		cellarFlat = browser ? (JSON.parse($storeExample) as CellarFlat) : [];
		//cellar = $myWineCellar.getCellar();
		console.log('onMount called loading from local storage');
		//console.log($myWineCellar.getCellar());

		updateDDLs();
	}
});

function importData(_e: MouseEvent): void {
	if (importWinesString === '') {
		return;
	}
	if ($useNewDataType) {
		let importWinesFlat: CellarFlat = JSON.parse(importWinesString) as CellarFlat;
		$myWineCellarFlat.updateCellarFlat(importWinesFlat);
		$storeExample = JSON.stringify(importWinesFlat);
		importWinesString = '';
		importModal = false;
		return;
	}
	const importWines: Cellar = JSON.parse(importWinesString) as Cellar;

	// Save owned Wines to local storage
	for (const key in importWines) {
		const values = importWines[key];
		localStorage.setItem(key, JSON.stringify(values));
	}

	importWinesString = '';
	importModal = false;
}

function copyText(_e: MouseEvent): void {
	navigator.clipboard
		.writeText($ownedWinesString)
		.then(() => {
			alert('Copied wines to Clipboard');
		})
		.catch(() => {
			alert('something went wrong');
		});
}
//todo update to use wineflat
//rdy for bool
function loadPreset() {
	//$myWineCellar.updateCellar(presetList);
	// Save owned Wines to local storage
	if ($useNewDataType) {
		let importWinesFlat: CellarFlat = presetListupdateforFlat;
		$myWineCellarFlat.updateCellarFlat(importWinesFlat);
		$storeExample = JSON.stringify(importWinesFlat);
		importWinesString = '';
		importModal = false;
		return;
	}

	let importWines: Cellar = presetList;
	for (const key in importWines) {
		const values = importWines[key];
		localStorage.setItem(key, JSON.stringify(values));
	}
	console.log('loadPreset called');
	console.log(presetList);
	//updateDDLs();
	cellar = $myWineCellar.getCellar();
	cellarFlat = browser ? (JSON.parse($storeExample) as CellarFlat) : [];
	//dispatch("wineUpdated", { detail: "wineUpdated" });
}

$: if (cellar && browser && !$useNewDataType) {
	$ownedWinesString = JSON.stringify(cellar);
	//if (browser) $storeExample=JSON.stringify(cellar);
}

$: if (cellarFlat && browser && $useNewDataType) {
	$ownedWinesString = cellarFlat ? JSON.stringify(cellarFlat) : '[]';
	//if (browser) $storeExample=JSON.stringify(cellar);
}

$: eventListenerStore.subscribe((eventListener) => {
	if (eventListener) {
		eventListener.addEventListener('wineUpdated', (e: Event) => {
			const customEvent = e as CustomEvent<any>;
			console.log('Event received in layout:', customEvent.detail);
			handleWinesUpdated();
		});
	}
});
</script>

<!--tododecide if drawer is needed for production potential make it dev tools using secret localstorage value-->
<Drawer
	transitionType="fly"
	transitionParams={transitionParams}
	bind:hidden={hidden2}
	id="sidebar2"
>
	<div class="flex items-center">
		<h5
			id="drawer-navigation-label-3"
			class="text-base font-semibold uppercase text-gray-500 dark:text-gray-400"
		>
			Menu
		</h5>
		<CloseButton on:click={() => (hidden2 = true)} class="mb-4 dark:text-white" />
	</div>
	<Sidebar>
		<SidebarWrapper divClass="overflow-y-auto py-4 px-3 rounded dark:bg-gray-800">
			<SidebarGroup>
				<SidebarItem label="Home" href="/">
					<svelte:fragment slot="icon">
						<ChartPieSolid
							class="h-5 w-5 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white"
						/>
					</svelte:fragment>
				</SidebarItem>
				<SidebarItem label="About" href="/about">
					<svelte:fragment slot="icon">
						<UsersSolid
							class="h-5 w-5 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white"
						/>
					</svelte:fragment>
				</SidebarItem>
				<SidebarItem label="Beta" href="/Beta">
					<svelte:fragment slot="icon">
						<UsersSolid
							class="h-5 w-5 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white"
						/>
					</svelte:fragment>
				</SidebarItem>
				<SidebarDropdownWrapper label="Button Testing">
					<svelte:fragment slot="icon">
						<ShoppingCartSolid
							class="h-5 w-5 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white"
						/>
					</svelte:fragment>
					<SidebarDropdownItem label="Decrement" />
					<SidebarDropdownItem label="Increment" />
					<SidebarDropdownItem label="test" />
				</SidebarDropdownWrapper>
				<SidebarItem label="Kanban" spanClass={spanClass}>
					<svelte:fragment slot="icon">
						<GridSolid
							class="h-5 w-5 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white"
						/>
					</svelte:fragment>
					<svelte:fragment slot="subtext">
						<span
							class="ml-3 inline-flex items-center justify-center rounded-full bg-gray-200 px-2 text-sm font-medium text-gray-800 dark:bg-gray-700 dark:text-gray-300"
						>
							Pro
						</span>
					</svelte:fragment>
				</SidebarItem>
				<SidebarItem label="Inbox" spanClass={spanClass}>
					<svelte:fragment slot="icon">
						<MailBoxSolid
							class="h-5 w-5 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white"
						/>
					</svelte:fragment>
					<svelte:fragment slot="subtext">
						<span
							class="ml-3 inline-flex h-3 w-3 items-center justify-center rounded-full bg-primary-200 p-3 text-sm font-medium text-primary-600 dark:bg-primary-900 dark:text-primary-200"
						>
							3
						</span>
					</svelte:fragment>
				</SidebarItem>
				<SidebarItem label="Users">
					<svelte:fragment slot="icon">
						<UsersSolid
							class="h-5 w-5 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white"
						/>
					</svelte:fragment>
				</SidebarItem>
				<SidebarItem label="Products">
					<svelte:fragment slot="icon">
						<BagSolid
							class="h-5 w-5 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white"
						/>
					</svelte:fragment>
				</SidebarItem>
				<SidebarItem label="Sign In">
					<svelte:fragment slot="icon">
						<ArrowRightToBracketSolid
							class="h-5 w-5 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white"
						/>
					</svelte:fragment>
				</SidebarItem>
				<SidebarItem label="Sign Up">
					<svelte:fragment slot="icon">
						<FileEditSolid
							class="h-5 w-5 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white"
						/>
					</svelte:fragment>
				</SidebarItem>
			</SidebarGroup>
		</SidebarWrapper>
	</Sidebar>
</Drawer>

<Modal title="Import Wines" bind:open={importModal} autoclose>
	<Textarea bind:value={importWinesString} />
	<Button on:click={importData}>Import</Button>
</Modal>

<Modal title="Export Aspects" bind:open={exportModal} autoclose>
	<Textarea bind:value={$ownedWinesString} readonly />
	<Button on:click={copyText}>Copy</Button>
</Modal>

<AppBar
	slotDefault="place-self-center"
	slotTrail="place-content-end"
	regionRowMain="flex gap-4 items-center"
	slotLead="flex flex-none items-center justify-between"
	padding="p-1"
	spacing="space-y-4"
	gap="gap-4"
>
	<svelte:fragment slot="lead"
		><div class="left-0 col-span-2 flex flex-shrink">
			<Hamburger --color="grey" bind:open={open} />
			{#if open}
				<Button on:click={() => (exportModal = true)}>Export</Button>
				<Button on:click={() => (importModal = true)}>Import</Button>
				<Button on:click={loadPreset}>Load Billy's Preset Wine List</Button>
			{/if}
		</div></svelte:fragment
	>
	<svelte:fragment slot="trail"
		><LightSwitch fillLight="fill-surface-50" fillDark="fill-surface-900" /></svelte:fragment
	>
</AppBar>
<!--todo potentially make conditional on devcode in local storage-->
<div class=" ml-3 mt-2">
	<Button on:click={() => (hidden2 = false)}>Show navigation</Button>
</div>

<div class="app">
	<Header></Header>
	<!--<InventoryMgmt
				producer = {cellarFlat[0].Producer}
				wineFlat={cellarFlat[0]}
				wine={cellar[0][0]}
				index={0}
				on:wineUpdated={handleWinesUpdated}
			/>-->
	<main class="m-7">
		<slot />
	</main>

	<footer></footer>
</div>

<style>

/* .app {
	display: flex;
	flex-direction: column;
	min-height: 100vh;
} */

/* main {
	flex: 1;
	display: flex;
	flex-direction: column;
	padding: 1rem;
	width: 100%;
	max-width: 64rem;
	margin: 0 auto;
	box-sizing: border-box;
} */

/* footer {
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	padding: 12px;
} */

/* @media (min-width: 480px) {
	footer {
		padding: 12px 0;
	}
} */
</style>
