// @ts-ignore
import { WineCellar } from '$lib/WineCellar';
import { myWineCellar } from '$lib/store';
import type { Cellar, Wine } from '$lib/types';
import { beforeEach, describe, expect, test, beforeAll } from 'vitest';

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

let searchParams: { [paramName: string]: { name: string; value: string }[] } = {
	producer: [{ name: 'All Producers', value: '' }],
	variety: [{ name: 'All Varieties', value: '' }],
	vineyard: [{ name: 'All Vineyards', value: '' }]
};

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

function loadOwnedWinesFromLocalStorage(): Cellar {
	const loadedOwnedWines: Cellar = {};

	for (let i = 0; localStorage && i < localStorage.length; i++) {
		const key = localStorage.key(i) || '[]';
		if (key && key !== 'theme' && key !== '_localization' && key !== 'storeExample') {
			const values = localStorage.getItem(key);
			console.log('loadfromstorage key ' + key);
			if (values) {
				try {
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
	localStorage.removeItem(producer);
	myWineCellar.update((current) => {
		if (current.removeProducer(producer)) {
			console.log('deleteProducer removed producer');
		} else {
			console.log('deleteProducer did not remove producer');
		}
		return current;
	});
	updateDDLs();
	dispatch('wineUpdated', { detail: 'wineUpdated' });
}

function handleWinesUpdated() {
	// Update the local data or trigger a refresh
	console.log('handleWinesUpdated (App.svelte) called loading from local storage');
	//myWineCellar.updateCellar(loadOwnedWinesFromLocalStorage());
	dispatch('wineUpdated', { detail: 'wineUpdated' });
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
	console.log('updateDDLs called  - reseting searchParams');
	searchParams = {
		producer: [{ name: 'All Producers', value: '' }],
		variety: [{ name: 'All Varieties', value: '' }],
		vineyard: [{ name: 'All Vineyards', value: '' }]
	};
	addOptions('producer', ownedWineCellar.getProducerNames());
	addOptions('variety', ownedWineCellar.getVarietyNames());
	addOptions('vineyard', ownedWineCellar.getVineyardNames());
	console.log('updateDDLs searchParams');
	console.log(searchParams);
}



function clearText(f: (v: string) => void) {
    f('');
}

describe('WineCellar', () => {
    beforeAll(() => {
        console.log('beforeAll called');
        ownedWineCellar = new WineCellar();
        ownedWineCellar.updateCellar(loadOwnedWinesFromLocalStorage());
        updateDDLs();
    });

    beforeEach(() => {
        console.log('beforeEach called');
        ownedWineCellar = new WineCellar();
        ownedWineCellar.updateCellar(loadOwnedWinesFromLocalStorage());
        updateDDLs();
    });

    test('WineCellar should be defined', () => {
        expect(ownedWineCellar).toBeDefined();
    });

    test('WineCellar should have a producers array', () => {
        expect(ownedWineCellar.getProducerNames()).toBeDefined();
    });

    test('myWineCellar should have a wines array', () => {
        expect(ownedWineCellar.getAllWinesFlat()).toBeDefined();
    });
})


