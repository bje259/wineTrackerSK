<script lang="ts">
	//import WineCellar from './WineCellar';
	import type { Wine } from "./types";
	import { Button, Label } from "flowbite-svelte";
	import { createEventDispatcher } from "svelte";
	import { myWineCellar } from "./store";

	// increment the value of the input field
	//counterInput.increment();

	// decrement the value of the input field
	//if (counterInput) counterInput.decrement();

	const dispatch = createEventDispatcher();

	export let producer: string;
	export let wine: Wine;
	export let index: number;

	let tempWines: Wine[] = [];
	$: ownedWines = $myWineCellar.getWinesByProducer(producer) || [];

	function handleWineUpdated() {
		let storedValue = localStorage.getItem(producer) ?? "[]";
		try {
			tempWines = JSON.parse(storedValue);
		} catch (error) {
			console.error("Error parsing JSON from localStorage", error);
			tempWines = [];
		}
		console.log(`ZZ Wine handleWineUpdated - tempWines: ${tempWines}`);
		myWineCellar.update((current) => {
			current.updateCellarByProducer(producer, tempWines);
			return current;
		});
		tempWines = [];
		dispatch("wineUpdated");
	}
	function qtyIncrement() {
		console.log(`ZZ Wine qtyIncrement - producer: ${producer} - wine:`);
		console.log(wine);
		console.log(`ZZ Wine qtyIncrement - wine.Qty: ${wine.Qty}`);

		wine.Qty = wine.Qty + 1;
		console.log(`ZZ Wine qtyIncrement - wine.Qty: ${wine.Qty}`);
		let storedValue = localStorage.getItem(producer) ?? "[]";
		try {
			tempWines = JSON.parse(storedValue);
			console.log(`ZZ Wine qtyIncrement - pulled producer's wines from local storage:`);
			console.log(tempWines);
			myWineCellar.update((current) => {
				current.updateCellarByProducer(producer, tempWines);
				return current;
			});
			console.log("Updated myWineCellar with tempWines");
			console.log($myWineCellar.getWinesByProducer(producer));
			myWineCellar.update((current) => {
				current.updateWine(producer, wine, index);
				return current;
			});
			console.log(`Updated myWineCellar with wine
				${wine["Wine Name"]}
				${wine.Qty}`);
			console.log("New myWineCellar wine entry:");
			console.log($myWineCellar.getWinesByProducerWineName(producer, wine["Wine Name"]));
			console.log("updating local storage");
			tempWines = $myWineCellar.getWinesByProducer(producer);
			let tempWinesString = JSON.stringify(tempWines);
			localStorage.setItem(producer, tempWinesString);
			console.log("local storage updated");
		} catch (error) {
			console.error("Error parsing JSON from localStorage", error);
			tempWines = [];
		}
		tempWines = [];
		dispatch("wineUpdated");
	}

	function qtyDecrement() {
		console.log(`ZZ Wine qtyDecrement - producer: ${producer} - wine:`);
		console.log(wine);
		console.log(`ZZ Wine qtyDecrement - wine.Qty: ${wine.Qty}`);
		if (wine.Qty > 0) {
			wine.Qty = wine.Qty - 1;
			console.log(`ZZ Wine qtyDecrement - wine.Qty: ${wine.Qty}`);
			let storedValue = localStorage.getItem(producer) ?? "[]";
			try {
				tempWines = JSON.parse(storedValue);
				console.log(`ZZ Wine qtyDecrement - pulled producer's wines from local storage:`);
				console.log(tempWines);
				myWineCellar.update((current) => {
					current.updateCellarByProducer(producer, tempWines);
					return current;
				});
				console.log("Updated myWineCellar with tempWines");
				console.log($myWineCellar.getWinesByProducer(producer));
				myWineCellar.update((current) => {
					current.updateWine(producer, wine, index);
					return current;
				});
				console.log(`Updated myWineCellar with wine
				${wine["Wine Name"]}
				${wine.Qty}`);
				console.log("New myWineCellar wine entry:");
				console.log($myWineCellar.getWinesByProducerWineName(producer, wine["Wine Name"]));
				console.log("updating local storage");
				tempWines = $myWineCellar.getWinesByProducer(producer);
				let tempWinesString = JSON.stringify(tempWines);
				localStorage.setItem(producer, tempWinesString);
				console.log("local storage updated");
			} catch (error) {
				console.error("Error parsing JSON from localStorage", error);
				tempWines = [];
			}

			tempWines = [];
			dispatch("wineUpdated");
		} else {
			console.log("Error wine cannot go below 0");
		}
	}

	function deleteWine() {
		console.log(`ZZ Wine deleteWine - wine: ${wine}`);
		console.log(`ZZ Wine deleteWine - wine.Qty: ${wine.Qty}`);
		if (wine.Qty > 0) {
			wine.Qty = 0;
			console.log(`ZZ Wine deleteWine - wine.Qty: ${wine.Qty}`);
			let storedValue = localStorage.getItem(producer) ?? "[]";
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
				console.error("Error parsing JSON from localStorage", error);
				ownedWines = [];
			}
			console.log("Updated myWineCellar with tempWines");
			console.log($myWineCellar.getWinesByProducer(producer));
			tempWines = [];
			console.log("dispatching wineUpdated");

			dispatch("wineUpdated");
		}
	}
</script>

<div class="mb-8 flex flex-col">
	<h3 class="text-lg font-medium mb-2 text-amber-600">
		Name: {wine["Wine Name"]}<br />Vineyard Location: {wine["Vineyard Location"]}<br />Variety: {wine.Variety
			? `(${wine.Variety})`
			: ""}
	</h3>
	<div class="flex flex-col">
		<div class="grid grid-cols-3">
			<p class="text-base mb-4 flex-grow">
				Vintage: {wine.Vintage ? `${wine.Vintage} ` : ""}
				<br />Bin: {wine.Bin ? `${wine.Bin} ` : ""}
			</p>
			<Button class="self-end flex-shrink-0 justify-self-end col-start-3" on:click={deleteWine}
				>Delete</Button
			>
		</div>
		<div
			class="grid grid-flow-col grid-cols-6 col-start-1 col-end-4 grid-rows-2 flex-shrink-1 gap-1 overflow-hidden divide-x rounded-lg rtl:flex-row-reverse ml-2"
		>
			<Label
				for="counter-input-example"
				class="block mb-1 text-sm font-medium text-gray-900 dark:text-white flex-shrink-1 col-span-2 bottom-0 content-end self-end"
				>Choose quantity:</Label
			>
			<div class="inline-flex row-span-1 col-span-3 top-0 inset-0 border-l-transparent">
				<Button
					type="button"
					class="flex-shrink-0 border-transparent bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600  hover:bg-gray-200 inline-flex items-center justify-center   rounded-md h-5 w-5 focus:ring-gray-100 dark:focus:ring-gray-700 focus:ring-2 focus:outline-none"
					on:click={qtyDecrement}
				>
					-
				</Button>

				<Label class=" inline-flex">Qty: {Number.isFinite(wine.Qty) ? `${wine.Qty} ` : ""}</Label>
				<Button
					type="button"
					class="flex-shrink-0 bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:border-gray-600 hover:bg-gray-200 inline-flex items-center justify-center border border-gray-300 rounded-md h-5 w-5 focus:ring-gray-100 dark:focus:ring-gray-700 focus:ring-2 focus:outline-none"
					on:click={qtyIncrement}
				>
					+
				</Button>
			</div>
		</div>
		<p class="text-base mb-4 flex-grow">
			<br />Purchase Date: {wine.Purchased ? `${wine.Purchased} ` : ""}
			{#if wine.Notes !== undefined && wine.Notes !== null && wine.Notes !== ""}
				<br />
				Notes: {wine.Notes}
			{/if}
		</p>
	</div>
</div>
