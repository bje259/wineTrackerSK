<script lang="ts">
	import type { Wine } from "./types";
	import { Button, CloseButton, Input, Label, NumberInput } from "flowbite-svelte";
	import { createEventDispatcher } from "svelte";
	import { myWineCellar } from "./store";

	const dispatch = createEventDispatcher();

	export let producer: string;
	let openNewWine = false;
	const newProducerMode = producer === "_New Producer";
	let openVerb = "Open";
	let newProducerName = "";
	let newWineName = "";
	let newVineyardLocation = "";
	let newWineVariety = "";
	let newWineVintage = 2020;
	let newWineBin = "";
	let newWineQty = 1;
	let newWinePurchased = "";
	let newWineNotes = "";
	let newWine: Wine = {
		"Wine Name": newWineName,
		"Vineyard Location": newVineyardLocation,
		Variety: newWineVariety,
		Vintage: newWineVintage,
		Bin: newWineBin,
		Qty: newWineQty,
		Purchased: newWinePurchased,
		Notes: newWineNotes
	};
	let tempWines: Wine[] = [];

	/*let newWine: Wine = {
		"Wine Name": "Margaux 2015",
		"Vineyard Location": "Bordeaux, France",
		Variety: "Cabernet Sauvignon",
		Vintage: 2015,
		Bin: "A1",
		Qty: 10,
		Purchased: "2020-01-01",
		Notes: "Excellent vintage"
	};*/

	function newProducerSubmit() {
		console.log(`ZZ Wine newProducerSubmit - newProducer: ${newProducerName}`);
		let storedValue = localStorage.getItem(newProducerName) ?? "[]";
		if (storedValue === "[]") {
			console.log(
				`ZZ Wine newProducerNameSubmit - newProducerName: ${newProducerName} - no wines found in local storage - creating new entry`
			);
			localStorage.setItem(newProducerName, JSON.stringify([]));
			myWineCellar.update((current) => {
				current.addProducer(newProducerName);
				return current;
			});
			console.log(`Updated myWineCellar with new producer ${newProducerName}`);
			dispatch("wineUpdated");
			console.log("dispatched wineUpdated");
			producer = newProducerName;
		}
		openNewWine = true;
		newProducerName = "";
	}

	function newWineSubmit() {
		console.log(`ZZ Wine newWineSubmit - producer: ${producer} - newWine:`);
		console.log(newWine);
		console.log(`ZZ Wine newWineSubmit - newWine.Qty: ${newWine.Qty}`);

		let storedValue = localStorage.getItem(producer) ?? "[]";
		try {
			tempWines = JSON.parse(storedValue) as Wine[];
			console.log(`ZZ Wine newWineSubmit - pulled producer's wines from local storage:`);
			console.log(tempWines);
			myWineCellar.update((current) => {
				current.updateCellarByProducer(producer, tempWines);
				return current;
			});
			console.log("Updated myWineCellar with tempWines");
			console.log($myWineCellar.getWinesByProducer(producer));
			myWineCellar.update((current) => {
				current.addWine(producer, newWine);
				return current;
			});
			console.log(`Updated myWineCellar with newWine
				${newWine["Wine Name"]}
				${newWine.Qty}`);
			console.log("New myWineCellar wine entry:");
			console.log($myWineCellar.getWinesByProducerWineName(producer, newWine["Wine Name"]));
			console.log("updating local storage");
			localStorage.setItem(producer, JSON.stringify($myWineCellar.getWinesByProducer(producer)));
			console.log("dispatching wineUpdated");
			dispatch("wineUpdated");
			console.log("dispatched wineUpdated");
		} catch (error) {
			console.error("Error parsing JSON from localStorage", error);
			tempWines = [];
		}
		clearText((v) => (newWineName = v));
		clearText((v) => (newVineyardLocation = v));
		clearText((v) => (newWineVariety = v));
		newWineVintage = 2020;
		newWineQty = 1;
		clearText((v) => (newWineBin = v));
		clearText((v) => (newWinePurchased = v));
		clearText((v) => (newWineNotes = v));
		openNewWine = false;
	}

	function clearText(setter: (value: string) => void): void {
		setter("");
	}
	function resetNumber(setter: (value: number) => void): void {
		setter(0);
	}
	function openAddPanel() {
		openNewWine = !openNewWine;
	}

	$: openVerb = openNewWine ? "Close" : "Open";

	$: newWine = {
		"Wine Name": newWineName,
		"Vineyard Location": newVineyardLocation,
		Variety: newWineVariety,
		Vintage: newWineVintage,
		Bin: newWineBin,
		Qty: newWineQty,
		Purchased: newWinePurchased,
		Notes: newWineNotes
	};
</script>

{#if newProducerMode}
	{#if !openNewWine}
		<div class="flex flex-col items-center justify-center">
			<Label for="qty" class="mt-2">Enter new producer name</Label>
			<Input bind:value={newProducerName} placeholder="Enter new producer name" class="mt-2">
				<CloseButton
					slot="right"
					on:click={() => clearText((v) => (newProducerName = v))}
					required
				/>
			</Input>
		</div>
	{/if}
	<div class="flex flex-col items-center justify-center">
		<Button
			type="button"
			class="flex-auto text-white bg-gradient-to-r from-teal-400 via-teal-500 to-teal-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-teal-300 dark:focus:ring-teal-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center m-4"
			on:click={() => newProducerSubmit()}
		>
			{#if openNewWine}
				"Close Panel -"
			{/if}Add new producer
		</Button>
	</div>
{:else if !newProducerMode}
	<Button
		type="button"
		class="text-white bg-gradient-to-r from-teal-400 via-teal-500 to-teal-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-teal-300 dark:focus:ring-teal-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center m-4"
		on:click={() => openAddPanel()}
	>
		{openVerb} Panel - Add new wine
	</Button>
{/if}
{#if openNewWine}
	<Input bind:value={newWineName} placeholder="Enter wine name" class="mt-2">
		<CloseButton slot="right" on:click={() => clearText((v) => (newWineName = v))} required />
	</Input>
	<Input bind:value={newVineyardLocation} placeholder="Enter vineyard location" class="mt-2">
		<CloseButton slot="right" on:click={() => clearText((v) => (newVineyardLocation = v))} />
	</Input>
	<Input bind:value={newWineVariety} placeholder="Enter wine variety" class="mt-2">
		<CloseButton slot="right" on:click={() => clearText((v) => (newWineVariety = v))} />
	</Input>
	<Label for="qty" class="mt-2">Enter wine vintage</Label>
	<NumberInput type="number" id="qty" bind:value={newWineVintage} class="mt-2" required>
		<CloseButton slot="right" on:click={() => resetNumber((v) => (newWineVintage = v))} />
	</NumberInput>
	<Input bind:value={newWineBin} placeholder="Enter wine bin" class="mt-2">
		<CloseButton slot="right" on:click={() => clearText((v) => (newWineBin = v))} />
	</Input>
	<Label class="mt-2">Enter wine quantity</Label>
	<NumberInput type="number" bind:value={newWineQty} placeholder="" class="mt-2" required>
		<CloseButton slot="right" on:click={() => resetNumber((v) => (newWineQty = v))} />
	</NumberInput>
	<Input bind:value={newWinePurchased} placeholder="Enter wine purchase date" class="mt-2">
		<CloseButton slot="right" on:click={() => clearText((v) => (newWinePurchased = v))} />
	</Input>
	<Input bind:value={newWineNotes} placeholder="Enter wine notes" class="mt-2">
		<CloseButton slot="right" on:click={() => clearText((v) => (newWineNotes = v))} />
	</Input>
	<Button
		type="submit"
		class="text-white bg-gradient-to-r from-teal-400 via-teal-500 to-teal-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-teal-300 dark:focus:ring-teal-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center m-4"
		on:click={() => newWineSubmit()}
	>
		Submit
	</Button>
{/if}
