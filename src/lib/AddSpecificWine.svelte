<script lang="ts">
import { Button, CloseButton, Input, Label, NumberInput } from 'flowbite-svelte';
import { createEventDispatcher } from 'svelte';
import { myWineCellar } from './store';
import type { Wine } from './types';

const dispatch = createEventDispatcher();

export let producer: string;
let openNewWine = false;
const newProducerMode = producer === '_New Producer';
let openVerb = 'Open';
let newProducerName = '';
let newWineName = '';
let newVineyardLocation = '';
let newWineVariety = '';
let newWineVintage = 2020;
let newWineBin = '';
let newWineQty = 1;
let newWinePurchased = '';
let newWineNotes = '';
let newWine: Wine = {
	'Wine Name': newWineName,
	'Vineyard Location': newVineyardLocation,
	Variety: newWineVariety,
	Vintage: newWineVintage,
	Bin: newWineBin,
	Qty: newWineQty,
	Purchased: newWinePurchased,
	Notes: newWineNotes
};
let tempWines: Wine[] = [];

/**
 * @description boolean array for controlling the state of various elements in the UI
 * @param fOn[0] - openNewWine
 * @param fOn[1] - newProducerMode
 * @param fOn[2] - newWineName > 0
 * @param fOn[3] - newWineVintage > 1980 && newWineVintage < 2024
 * @param fOn[4] - newWineQty > 0
 * @param fOn[5] -
 * @param fOn[6] -
 * @param fOn[7] -
 */
let fOn = Array(7).fill(false, 0);

/**
 * @description function to check the state of various elements in the UI using OR, AND and NOT logic on the fOn array.  Negative indices have the not (!) operator applied to the value mapped to the ABS value of the index.
 * Note: Object.is() is used to check for negative zero (-0) as it is not equal to positive zero (0)
 * @param indices - array of indices to check
 * @param useOr - boolean to indicate whether to use OR logic (true) or AND logic (false)
 * @returns boolean
 * @see fOn[] index assignements
 * @param fOn[0] - openNewWine
 * @param fOn[1] - newProducerMode
 * @param fOn[2] - newWineName > 0
 * @param fOn[3] - newWineVintage > 1980 && newWineVintage < 2024
 * @param fOn[4] - newWineQty > 0
 * @example
 * // returns true if openNewWine is true OR newProducerMode is true
 * chk([0,1], true)
 *  // returns true if openNewWine is true AND newProducerMode is true
 * chk([0,1], false)
 * // returns true if openNewWine is true AND newProducerMode is false
 * chk([0,-1], false)
 * // returns true if openNewWine is false AND newProducerMode is true
 * chk([-0,1], false)
 * // returns true if openNewWine is false AND newProducerMode is false
 * chk([-0,-1], false)
 */
function chk(indices: number[], useOr = false) {
	if (useOr) {
		// OR logic - returns true if any condition is true
		return indices.some((index) => {
			return Object.is(Math.abs(index), index) ? fOn[index] : !fOn[Math.abs(index)];
		});
	} else {
		// AND logic - returns true if all conditions are true
		return indices.every((index) => {
			return Object.is(Math.abs(index), index) ? fOn[index] : !fOn[Math.abs(index)];
		});
	}
};

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
	let storedValue = localStorage.getItem(newProducerName) ?? '[]';
	if (storedValue === '[]') {
		console.log(
			`ZZ Wine newProducerNameSubmit - newProducerName: ${newProducerName} - no wines found in local storage - creating new entry`
		);
		localStorage.setItem(newProducerName, JSON.stringify([]));
		myWineCellar.update((current) => {
			current.addProducer(newProducerName);
			return current;
		});
		console.log(`Updated myWineCellar with new producer ${newProducerName}`);
		dispatch('wineUpdated');
		console.log('dispatched wineUpdated');
		producer = newProducerName;
	}
	openNewWine = true;
	newProducerName = '';
}

function newWineSubmit() {
	console.log(`ZZ Wine newWineSubmit - producer: ${producer} - newWine:`);
	console.log(newWine);
	console.log(`ZZ Wine newWineSubmit - newWine.Qty: ${newWine.Qty}`);

	let storedValue = localStorage.getItem(producer) ?? '[]';
	try {
		tempWines = JSON.parse(storedValue) as Wine[];
		console.log(`ZZ Wine newWineSubmit - pulled producer's wines from local storage:`);
		console.log(tempWines);
		myWineCellar.update((current) => {
			current.updateCellarByProducer(producer, tempWines);
			return current;
		});
		console.log('Updated myWineCellar with tempWines');
		console.log($myWineCellar.getWinesByProducer(producer));
		myWineCellar.update((current) => {
			current.addWine(producer, newWine);
			return current;
		});
		console.log(`Updated myWineCellar with newWine
				${newWine['Wine Name']}
				${newWine.Qty}`);
		console.log('New myWineCellar wine entry:');
		console.log($myWineCellar.getWinesByProducerWineName(producer, newWine['Wine Name']));
		console.log('updating local storage');
		localStorage.setItem(producer, JSON.stringify($myWineCellar.getWinesByProducer(producer)));
		console.log('dispatching wineUpdated');
		dispatch('wineUpdated');
		console.log('dispatched wineUpdated');
	} catch (error) {
		console.error('Error parsing JSON from localStorage', error);
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
	setter('');
}
function resetNumber(setter: (value: number) => void): void {
	setter(0);
}
function openAddPanel() {
	openNewWine = !openNewWine;
}

/**
 * @description function to update the value of an element in the fOn array
 * @param arr - array to update
 * @param index - index of element to update
 * @param value - value to update element with
 * @returns array
 * @example
 * // returns [false, true, false, false, false, false, false, false]
 * updateArrayByIndex<boolean>(fOn, 1, true)
 */
function updateArrayByIndex<T>(arr: T[], index: number, value: T) {
	return arr.map((v, i) => (i === index ? value : v));
};

/**
 * @description array of tuples to hold the conditionals and resulting evaluations for the if statements in the UI using the chk function as evaluator (each tuple is an array of two elements - the first element is the conditional statement and the second element is the result of the chk function on the conditional statement)  Here the array is initial with all false values.
 */
let condIfArray: [number[], boolean][] = 
[[[0,1],false],
[[-0,1],false],
[[-1],false],
[[2],false],
[[3],false],
[[4],false],
[[0],false],
[[-0],false]];

let rOn: [number[], boolean][] = 
[[[0,1],false],
[[-0,1],false],
[[-1],false],
[[2],false],
[[3],false],
[[4],false],
[[0],false],
[[-0],false]];

$: openVerb = openNewWine ? 'Close' : 'Open';

$: {
	fOn = updateArrayByIndex<boolean>(fOn, 0, openNewWine);
	fOn = updateArrayByIndex<boolean>(fOn, 1, newProducerMode);
	fOn = updateArrayByIndex<boolean>(fOn, 2, newWineName.length > 0);
	fOn = updateArrayByIndex<boolean>(fOn, 3, newWineVintage > 1980 && newWineVintage < 2024);
	fOn = updateArrayByIndex<boolean>(fOn, 4, newWineQty > 0);


	//fOn[0] = openNewWine;
	//fOn[1] = newProducerMode;
	//fOn[2] = newWineName.length > 0;
	//fOn[3] = newWineVintage > 1980 && newWineVintage < 2024;
	//fOn[4] = newWineQty > 0;
}

$: {
	//will this entire section run when reactivity is triggered?
	fOn = updateArrayByIndex<boolean>(fOn, 0, openNewWine);
	fOn = updateArrayByIndex<boolean>(fOn, 1, newProducerMode);
	fOn = updateArrayByIndex<boolean>(fOn, 2, newWineName.length > 0);
	fOn = updateArrayByIndex<boolean>(fOn, 3, newWineVintage > 1980 && newWineVintage < 2024);
	fOn = updateArrayByIndex<boolean>(fOn, 4, newWineQty > 0);
	
	condIfArray = 
	[[[0,1],false],
	[[-0,1],false],
	[[-1],false],
	[[2],false],
	[[3],false],
	[[4],false],
	[[0],false],
	[[-0],false]];

	rOn = condIfArray.map(cond => [cond[0], chk(cond[0])]);

	//use rOn[0][1] for first if statement
	//use rOn[1][1] for second if statement, etc.
};


// $: console.log(rOn);

// $: {
// 	if (chk([1])) {
// 		console.log('Current bool array status:');
// 		console.log(fOn);
// 		console.log('current button bool result: disabled, then enabled');
// 		console.log(chk([0, 1]));
// 		console.log(chk([-0, 1]));
// 	}
// }
$: newWine = {
	'Wine Name': newWineName,
	'Vineyard Location': newVineyardLocation,
	Variety: newWineVariety,
	Vintage: newWineVintage,
	Bin: newWineBin,
	Qty: newWineQty,
	Purchased: newWinePurchased,
	Notes: newWineNotes
};




//$: condIfArray = updateArrayByIndex<[number[], boolean]>(condIfArray, [0,1], chk([0, 1]));

/**
 * @description boolean array for controlling the state of various elements in the UI
 * @param fOn[0] - openNewWine
 * @param fOn[1] - newProducerMode
 * @param fOn[2] - newWineName > 0
 * @param fOn[3] - newWineVintage > 1980 && newWineVintage < 2024
 * @param fOn[4] - newWineQty > 0
 * @param fOn[5] -
 * @param fOn[6] -
 * @param fOn[7] -
 */
</script>

{#if rOn[1][1]}
	<div class="flex flex-col items-center justify-center">
		<form>
			<Input
				bind:value={newProducerName}
				placeholder="Enter new producer name"
				class="mt-2"
				required
			>
				<CloseButton slot="right" on:click={() => clearText((v) => (newProducerName = v))} />
			</Input>
		</form>
	</div>
{/if}

<div class="flex flex-col items-center justify-center">
	{#if rOn[1][1]}
		<Button
			type="submit"
			class="m-4 flex-auto rounded-lg bg-gradient-to-r from-teal-400 via-teal-500 to-teal-600 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-gradient-to-br focus:outline-none focus:ring-4 focus:ring-teal-300 disabled:opacity-70  dark:focus:ring-teal-800"
			on:click={() => newProducerSubmit()}
		>
			Add new producer
		</Button>
	{:else if rOn[0][1]}
		<Button
			type="button"
			class="m-4 flex-auto rounded-lg bg-gradient-to-r from-teal-400 via-teal-500 to-teal-600 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-gradient-to-br focus:outline-none focus:ring-4 focus:ring-teal-300 disabled:opacity-70  dark:focus:ring-teal-800"
			disabled
		>
			Add new producer
		</Button>
	{/if}
</div>
{#if rOn[2][1]}
	<Button
		type="button"
		class="m-4 rounded-lg bg-gradient-to-r from-teal-400 via-teal-500 to-teal-600 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-gradient-to-br focus:outline-none focus:ring-4 focus:ring-teal-300 dark:focus:ring-teal-800"
		on:click={() => openAddPanel()}
	>
		{openVerb} Panel - Add new wine
	</Button>
{/if}
{#if rOn[6][1]}
	<Input bind:value={newWineName} placeholder="Enter wine name" class="mt-2">
		<CloseButton slot="right" on:click={() => clearText((v) => (newWineName = v))} required />
	</Input>
	<Input bind:value={newVineyardLocation} placeholder="Enter vineyard location" class="mt-2">
		<CloseButton slot="right" on:click={() => clearText((v) => (newVineyardLocation = v))} />
	</Input>
	<Input bind:value={newWineVariety} placeholder="Enter wine variety" class="mt-2">
		<CloseButton slot="right" on:click={() => clearText((v) => (newWineVariety = v))} />
	</Input>
	<Label for="vintage" class="mt-2">Enter wine vintage</Label>
	<NumberInput type="number" id="vintage" bind:value={newWineVintage} class="mt-2" required
	></NumberInput>
	<Input bind:value={newWineBin} placeholder="Enter wine bin" class="mt-2">
		<CloseButton slot="right" on:click={() => clearText((v) => (newWineBin = v))} />
	</Input>
	<Label class="mt-2" for="qty">Enter wine quantity</Label>
	<NumberInput type="number" id="qty" bind:value={newWineQty} placeholder="" class="mt-2" required
	></NumberInput>
	<Input bind:value={newWinePurchased} placeholder="Enter wine purchase date" class="mt-2">
		<CloseButton slot="right" on:click={() => clearText((v) => (newWinePurchased = v))} />
	</Input>
	<Input bind:value={newWineNotes} placeholder="Enter wine notes" class="mt-2">
		<CloseButton slot="right" on:click={() => clearText((v) => (newWineNotes = v))} />
	</Input>
	<Button
		type="submit"
		class="m-4 rounded-lg bg-gradient-to-r from-teal-400 via-teal-500 to-teal-600 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-gradient-to-br focus:outline-none focus:ring-4 focus:ring-teal-300 dark:focus:ring-teal-800"
		on:click={() => newWineSubmit()}
	>
		Submit
	</Button>
{/if}
