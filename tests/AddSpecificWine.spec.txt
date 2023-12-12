import { WineCellar } from '$lib/WineCellar';
import { myWineCellar } from '$lib/store';
import type { Cellar, Wine } from '$lib/types';
import { beforeEach, describe, expect, test } from 'vitest';

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
let fOn: boolean[] = [
	false,
	false,
	false,
	false,
	false,
	false,
	false,
	false,
	false,
	false,
	false,
	false,
	false,
	false,
	false
];

let openNewWine = false;
let newProducerMode = false;
let newProducerName = '';
let newWineName = '';
let newWineProducer = '';
let newWineVariety = '';
let newVineyardLocation = '';
let newWineVintage = 0;
let newWineBin = '';
let newWineQty = 0;
let newWinePurchased = '';
let newWineNotes = '';
let producer = '';
let tempWines: Wine[] = [];
let newWine: Wine;
let wineName = '';
let variety = '';
let vintage = 0;
let bin = '';
let qty = 0;
let purchased = '';
let notes = '';
let wine: Wine;
let wineCellar: Cellar;
let producers: string[];
let wines: Wine[];
let wineNames: string[];
let wineVarieties: string[];
let wineVintages: number[];
let wineBins: string[];
let wineQtys: number[];
let winePurchaseds: string[];
let wineNotes: string[];
let ownedWineCellar = new WineCellar();
const unsubscribe = myWineCellar.subscribe((value) => {
	ownedWineCellar = value;
});

let dispatch = (type: string, detail?: any) => {
	document.dispatchEvent(
		new CustomEvent(type, {
			detail
		})
	);
};

/**
 * @description function to check the state of various elements in the UI using OR, AND and NOT logic on the fOn array.  Negative indices have the not (!) operator applied to the value mapped to the ABS value of the index.
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
 *
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
}

describe('Tests function controlling logic checks for UI form', () => {
	test('chk - OR logic, openNewWine is true', () => {
		fOn[0] = true;
		fOn[1] = false;
		expect(chk([0, 1], true)).toBe(true);
	});

	test('chk - OR logic, newProducerMode is true', () => {
		fOn[0] = false;
		fOn[1] = true;
		expect(chk([0, 1], true)).toBe(true);
	});

	test('chk - OR logic, openNewWine and newProducerMode are false', () => {
		fOn[0] = false;
		fOn[1] = false;
		expect(chk([0, 1], true)).toBe(false);
	});

	test('chk - AND logic, openNewWine and newProducerMode are true', () => {
		fOn[0] = true;
		fOn[1] = true;
		expect(chk([0, 1], false)).toBe(true);
	});

	test('chk - AND logic, openNewWine is true and newProducerMode is false', () => {
		fOn[0] = true;
		fOn[1] = false;
		expect(chk([0, -1], false)).toBe(true);
	});

	test('chk - AND logic, openNewWine is false and newProducerMode is true', () => {
		fOn[0] = false;
		fOn[1] = true;
		expect(chk([-0, 1], false)).toBe(true);
	});

	test('chk - AND logic, openNewWine and newProducerMode are false; Note with negative indices, and both flags flase, I expect the expression to check - is fOn[0] false and fOn[1] false?', () => {
		fOn[0] = false;
		fOn[1] = false;
		expect(chk([-0, -1], false)).toBe(true);
	});

	test('chk - AND logic, openNewWine is true and newProducerMode is false', () => {
		fOn[0] = true;
		fOn[1] = false;
		expect(chk([-0, -1], false)).toBe(false);
	});
});

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
		ownedWineCellar.addProducer(newProducerName);
	}
	console.log(`Updated myWineCellar with new producer ${newProducerName}`);
	dispatch('wineUpdated');
	console.log('dispatched wineUpdated');
	producer = newProducerName;
}
openNewWine = true;
newProducerName = '';

describe('AddSpecificWine intends to allow user interaction to add wins to the cellar.  Tests here will be focused on utility functions within the svelte component', () => {
	const producer = 'Chateau Margaux';
	const wine: Wine = {
		'Wine Name': 'Margaux 2015',
		'Vineyard Location': 'Bordeaux, France',
		Variety: 'Cabernet Sauvignon',
		Vintage: 2015,
		Bin: 'A1',
		Qty: 10,
		Purchased: '2020-01-01',
		Notes: 'Excellent vintage'
	};
	beforeEach(() => {});

	test('WineCellar should be defined', () => {
		expect(ownedWineCellar).toBeDefined();
	});

	test('WineCellar should have a producers array', () => {
		expect(ownedWineCellar.getProducerNames()).toBeDefined();
	});

	test('myWineCellar should have a wines array', () => {
		expect(ownedWineCellar.getAllWinesFlat()).toBeDefined();
	});

	test(' I should be able to submit a new producer', () => {
		newProducerName = producer;
		newProducerSubmit();
		expect(
			ownedWineCellar.getProducerNames().some((producer) => producer.name === newProducerName)
		).toBe(true);
	});
});

function clearText(f: (v: string) => void) {
	f('');
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
		console.log(ownedWineCellar.getWinesByProducer(producer));
		myWineCellar.update((current) => {
			current.addWine(producer, newWine);
			return current;
		});
		console.log(`Updated myWineCellar with newWine
				${newWine['Wine Name']}
				${newWine.Qty}`);
		console.log('New myWineCellar wine entry:');
		console.log(ownedWineCellar.getWinesByProducerWineName(producer, newWine['Wine Name']));
		console.log('updating local storage');
		localStorage.setItem(producer, JSON.stringify(ownedWineCellar.getWinesByProducer(producer)));
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

describe('Testing the newWineSubmit form functions', () => {
	newWine = {
		'Wine Name': 'Margaux 2015',
		'Vineyard Location': 'Bordeaux, France',
		Variety: 'Cabernet Sauvignon',
		Vintage: 2015,
		Bin: 'A1',
		Qty: 10,
		Purchased: '2020-01-01',
		Notes: 'Excellent vintage'
	};
	producer = 'Chateau Margaux';
	beforeEach(() => {
		newWineName = newWine['Wine Name'];
		newVineyardLocation = newWine['Vineyard Location'];
		newWineVariety = newWine.Variety;
		newWineVintage = newWine.Vintage;
		newWineBin = newWine.Bin;
		newWineQty = newWine.Qty;
		newWinePurchased = newWine.Purchased;
		newWineNotes = newWine.Notes;
	});

	test('I should be able to submit a new wine', () => {
		newWineSubmit();
		expect(ownedWineCellar.getWinesByProducerWineName(producer, newWineName)).toBeDefined();
	});

	test('I should be able to submit a new wine', () => {
		newWineSubmit();
		expect(ownedWineCellar.getWinesByProducerWineName(producer, newWineName)).toBeDefined();
	});
});
