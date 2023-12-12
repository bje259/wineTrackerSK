/* eslint-disable */
// @ts-nocheck
import WineCellar from '$lib/WineCellar';
import type { Cellar, Wine } from '$lib/types';
import { beforeEach, describe, expect, it, test } from 'vitest';

describe('WineCellar', () => {
	let wineCellar: WineCellar;
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
	beforeEach(() => {
		wineCellar = new WineCellar({});
	});

	test('addWine should add wine to the cellar', () => {
		wineCellar.addWine(producer, wine);
		expect(wineCellar.cellar[producer]).toHaveLength(1);
		expect(wineCellar.cellar[producer][0]).toEqual(wine);
	});

	test('addWine should add wine to the existing producer in the cellar', () => {
		const producerA = 'Producer A';
		const wine1 = { 'Wine Name': 'Wine A', Vintage: 2020, Qty: 1 };
		const wine2 = { 'Wine Name': 'Wine B', Vintage: 2021, Qty: 2 };

		wineCellar.addWine(producerA, wine1);
		wineCellar.addWine(producerA, wine2);

		expect(wineCellar.cellar[producerA]).toHaveLength(2);
		expect(wineCellar.cellar[producerA][0]).toEqual(wine1);
		expect(wineCellar.cellar[producerA][1]).toEqual(wine2);
	});

	test('removeWine should remove wine from the cellar', () => {
		wineCellar.addWine(producer, wine);
		const result = wineCellar.removeWine(producer, wine['Wine Name'], wine);
		expect(result).toBe(true);
		expect(wineCellar.cellar[producer]).toHaveLength(0);
	});

	test('removeWine should return false if wine is not found in the cellar', () => {
		const result = wineCellar.removeWine(producer, wine['Wine Name']);
		expect(result).toBe(false);
	});

	test('getWinesByProducer should return wines produced by the specified producer', () => {
		wineCellar.addWine(producer, wine);
		const wines = wineCellar.getWinesByProducer(producer);
		expect(wines).toHaveLength(1);
		expect(wines[0]).toEqual(wine);
	});

	test('getWinesByProducer should return undefined if no wines are found', () => {
		const wines = wineCellar.getWinesByProducer(producer);
		expect(wines).toBeUndefined();
	});

	test('getCellar should return the cellar object', () => {
		wineCellar.addWine(producer, wine);
		const cellar = wineCellar.getCellar();
		expect(cellar).toEqual({ [producer]: [wine] });
	});

	test('checkWineByNameVintage should return the wine object if found', () => {
		wineCellar.addWine(producer, wine);
		const foundWine = wineCellar.checkWineByNameVintage(wine['Wine Name'], wine.Vintage);
		expect(foundWine).toEqual(wine);
	});

	test('checkWineByNameVintage should return undefined if wine is not found', () => {
		const foundWine = wineCellar.checkWineByNameVintage(wine['Wine Name'], wine.Vintage);
		expect(foundWine).toBeUndefined();
	});
});

describe('WineCellar Filter tests', () => {
	let loadWinesString = `{
	"B.R. Cohn": [
		{
			"Wine Name": "Cabernet Sauvignon",
			"Vineyard Location": "North Coast",
			"Variety": "Cabernet Sauvignon",
			"Vintage": 2013,
			"Bin": "8-3",
			"Qty": 1,
			"Purchased": "",
			"Notes": ""
		}
	],
	"Barons De Rothschild (Lafite)": [
		{
			"Wine Name": "Saint Emilion Reserve Speciale",
			"Vineyard Location": "Saint Emilion",
			"Variety": "Red Blend",
			"Vintage": 2012,
			"Bin": "5-1",
			"Qty": 1,
			"Purchased": "",
			"Notes": ""
		}
	],
	"Becker Vineyards": [
		{
			"Wine Name": "Barbera ",
			"Vineyard Location": "Texas Hill Country",
			"Variety": "Barbera",
			"Vintage": 2020,
			"Bin": "12-2",
			"Qty": 1,
			"Purchased": "10/24/2023",
			"Notes": ""
		},
		{
			"Wine Name": "Barbera - Merlot",
			"Vineyard Location": "Texas  ",
			"Variety": "Red Blend",
			"Vintage": 2012,
			"Bin": "15-2",
			"Qty": 1,
			"Purchased": "",
			"Notes": ""
		}
	]
}`;
	let loadedOwnedWines: Cellar = {};

	try {
		loadedOwnedWines = JSON.parse(loadWinesString) as Cellar;
	} catch (error) {
		console.error(`Error parsing data from demo string:`, error);
	}

	const myCellar = new WineCellar(loadedOwnedWines);

	it('should filter the cellar by producer', () => {
		const filteredCellar = myCellar.getFilteredCellar({ producer: 'Becker Vineyards' });

		expect(filteredCellar).toEqual({
			'Becker Vineyards': [
				{
					'Wine Name': 'Barbera ',
					'Vineyard Location': 'Texas Hill Country',
					Variety: 'Barbera',
					Vintage: 2020,
					Bin: '12-2',
					Qty: 1,
					Purchased: '10/24/2023',
					Notes: ''
				},
				{
					'Wine Name': 'Barbera - Merlot',
					'Vineyard Location': 'Texas  ',
					Variety: 'Red Blend',
					Vintage: 2012,
					Bin: '15-2',
					Qty: 1,
					Purchased: '',
					Notes: ''
				}
			]
		});
	});

	it('should filter the cellar by variety', () => {
		const filteredCellar = myCellar.getFilteredCellar({ variety: 'Cabernet Sauvignon' });

		expect(filteredCellar).toEqual({
			'B.R. Cohn': [
				{
					'Wine Name': 'Cabernet Sauvignon',
					'Vineyard Location': 'North Coast',
					Variety: 'Cabernet Sauvignon',
					Vintage: 2013,
					Bin: '8-3',
					Qty: 1,
					Purchased: '',
					Notes: ''
				}
			]
		});
	});

	it('should filter the cellar by vineyard location', () => {
		const filteredCellar = myCellar.getFilteredCellar({ vineyard: 'Texas Hill Country' });

		expect(filteredCellar).toEqual({
			'Becker Vineyards': [
				{
					'Wine Name': 'Barbera ',
					'Vineyard Location': 'Texas Hill Country',
					Variety: 'Barbera',
					Vintage: 2020,
					Bin: '12-2',
					Qty: 1,
					Purchased: '10/24/2023',
					Notes: ''
				}
			]
		});
	});

	it('should filter the cellar by search term ', () => {
		const filteredCellar = myCellar.getFilteredCellar({ searchterm: 'Barbera' });

		expect(filteredCellar).toEqual({
			'Becker Vineyards': [
				{
					'Wine Name': 'Barbera ',
					'Vineyard Location': 'Texas Hill Country',
					Variety: 'Barbera',
					Vintage: 2020,
					Bin: '12-2',
					Qty: 1,
					Purchased: '10/24/2023',
					Notes: ''
				},
				{
					'Wine Name': 'Barbera - Merlot',
					'Vineyard Location': 'Texas  ',
					Variety: 'Red Blend',
					Vintage: 2012,
					Bin: '15-2',
					Qty: 1,
					Purchased: '',
					Notes: ''
				}
			]
		});
	});
	it('should filter the cellar by vineyard searchterm ', () => {
		const filteredCellar = myCellar.getFilteredCellar({ searchterm: 'texas' });

		expect(filteredCellar).toEqual({
			'Becker Vineyards': [
				{
					'Wine Name': 'Barbera ',
					'Vineyard Location': 'Texas Hill Country',
					Variety: 'Barbera',
					Vintage: 2020,
					Bin: '12-2',
					Qty: 1,
					Purchased: '10/24/2023',
					Notes: ''
				},
				{
					'Wine Name': 'Barbera - Merlot',
					'Vineyard Location': 'Texas  ',
					Variety: 'Red Blend',
					Vintage: 2012,
					Bin: '15-2',
					Qty: 1,
					Purchased: '',
					Notes: ''
				}
			]
		});
	});
});

describe('WineCellar update', () => {
	it('should update the wine correctly', () => {
		const myCellar = new WineCellar();
		myCellar.addWine('Chateau Margaux', {
			'Wine Name': 'Margaux 2015',
			'Vineyard Location': 'Bordeaux, France',
			Variety: 'Cabernet Sauvignon',
			Vintage: 2015,
			Bin: 'A1',
			Qty: 10,
			Purchased: '2020-01-01',
			Notes: 'Excellent vintage'
		});

		const updatedWine = {
			'Wine Name': 'Margaux 2015',
			'Vineyard Location': 'Bordeaux, France',
			Variety: 'Cabernet Sauvignon',
			Vintage: 2015,
			Bin: 'A1',
			Qty: 5, // Updated quantity
			Purchased: '2020-01-01',
			Notes: 'Excellent vintage'
		};

		const result = myCellar.updateWine('Chateau Margaux', updatedWine);

		expect(result).toBe(true);
		expect(myCellar.getWinesByProducer('Chateau Margaux')[0].Qty).toBe(5);
	});
});

describe('WineCellar getNames', () => {
	let loadWinesString = `{
	"B.R. Cohn": [
		{
			"Wine Name": "Cabernet Sauvignon",
			"Vineyard Location": "North Coast",
			"Variety": "Cabernet Sauvignon",
			"Vintage": 2013,
			"Bin": "8-3",
			"Qty": 1,
			"Purchased": "",
			"Notes": ""
		}
	],
	"Barons De Rothschild (Lafite)": [
		{
			"Wine Name": "Saint Emilion Reserve Speciale",
			"Vineyard Location": "Saint Emilion",
			"Variety": "Red Blend",
			"Vintage": 2012,
			"Bin": "5-1",
			"Qty": 1,
			"Purchased": "",
			"Notes": ""
		}
	],
	"Becker Vineyards": [
		{
			"Wine Name": "Barbera ",
			"Vineyard Location": "Texas Hill Country",
			"Variety": "Barbera",
			"Vintage": 2020,
			"Bin": "12-2",
			"Qty": 1,
			"Purchased": "10/24/2023",
			"Notes": ""
		},
		{
			"Wine Name": "Barbera - Merlot",
			"Vineyard Location": "Texas  ",
			"Variety": "Red Blend",
			"Vintage": 2012,
			"Bin": "15-2",
			"Qty": 1,
			"Purchased": "",
			"Notes": ""
		}
	]
}`;
	let loadedOwnedWines: Cellar = {};

	try {
		loadedOwnedWines = JSON.parse(loadWinesString) as Cellar;
	} catch (error) {
		console.error(`Error parsing data from demo string:`, error);
	}

	const myCellar = new WineCellar(loadedOwnedWines);

	it('should return producer names in the form of {name: producerName, value: producerName', () => {
		const producerNames = myCellar.getProducerNames();

		expect(producerNames).toEqual([
			{ name: 'B.R. Cohn', value: 'B.R. Cohn' },
			{ name: 'Barons De Rothschild (Lafite)', value: 'Barons De Rothschild (Lafite)' },
			{ name: 'Becker Vineyards', value: 'Becker Vineyards' }
		]);
	});

	it('should return variety names in the form of {name: varietyName, value: varietyName', () => {
		const varietyNames = myCellar.getVarietyNames();
		console.log(varietyNames);
		expect(varietyNames).toEqual([
			{ name: 'Cabernet Sauvignon', value: 'Cabernet Sauvignon' },
			{ name: 'Red Blend', value: 'Red Blend' },
			{ name: 'Barbera', value: 'Barbera' }
		]);
	});

	it('should return vineyard names in the form of {name: vineyard, value: vineyard', () => {
		const vineyardNames = myCellar.getVineyardNames();
		console.log(vineyardNames);
		expect(vineyardNames).toEqual([
			{ name: 'North Coast', value: 'North Coast' },
			{ name: 'Saint Emilion', value: 'Saint Emilion' },
			{ name: 'Texas Hill Country', value: 'Texas Hill Country' },
			{ name: 'Texas  ', value: 'Texas  ' }
		]);
	});
});
