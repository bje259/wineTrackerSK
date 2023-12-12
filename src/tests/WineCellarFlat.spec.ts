import WineCellar from '$lib/WineCellar';
import WineCellarFlat from '$lib/WineCellarFlat';
import type { Cellar, CellarFlat, Wine, WineFlat } from '$lib/types';
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
		expect(wines![0]).toEqual(wine);
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
		expect(myCellar.getWinesByProducer('Chateau Margaux')![0].Qty).toBe(5);
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

describe('WineCellar Flat', () => {
	let cellar: Cellar;
	let wine: Wine;

	let wineFlat: WineFlat;
	let wineFlat2: WineFlat;

	let cellarFlat: CellarFlat = [];

	let wineCellarFlat: WineCellarFlat;
	let producer: string;

	beforeEach(() => {
		wineCellarFlat = new WineCellarFlat();
		producer = 'Chateau Margaux';

		wineFlat = {
			'Wine Name': 'Margaux 2015',
			'Vineyard Location': 'Bordeaux, France',
			Variety: 'Cabernet Sauvignon',
			Inventory: [
				{
					Vintage: 2015,
					Bin: 'A1',
					Qty: 10,
					Purchased: '2020-01-01'
				}
			],
			Notes: 'Excellent vintage',
			Producer: 'Chateau Margaux'
		};
		wineFlat2 = {
			'Wine Name': 'Nello Coombsville',
			'Vineyard Location': 'Napa Valley, California',
			Variety: 'Red Blend',
			Inventory: [
				{
					Vintage: 2016,
					Bin: 'A1',
					Qty: 10,
					Purchased: '2020-01-01'
				}
			],
			Notes: 'Excellent vintage',
			Producer: 'Sciandri Family Vineyards'
		};
		wine = {
			'Wine Name': 'Margaux 2015',
			'Vineyard Location': 'Bordeaux, France',
			Variety: 'Cabernet Sauvignon',
			Vintage: 2015,
			Bin: 'A1',
			Qty: 10,
			Purchased: '2020-01-01',
			Notes: 'Excellent vintage'
		};
		cellarFlat = [wineFlat, wineFlat2];
		cellar = {
			'Chateau Margaux': [
				{
					'Wine Name': 'Margaux 2015',
					'Vineyard Location': 'Bordeaux, France',
					Variety: 'Cabernet Sauvignon',
					Vintage: 2015,
					Bin: 'A1',
					Qty: 10,
					Purchased: '2020-01-01',
					Notes: 'Excellent vintage'
				}
			],
			'Sciandri Family Vineyards': [
				{
					'Wine Name': 'Nello Coombsville',
					'Vineyard Location': 'Napa Valley, California',
					Variety: 'Red Blend',
					Vintage: 2016,
					Bin: 'A1',
					Qty: 10,
					Purchased: '2020-01-01',
					Notes: 'Excellent vintage'
				}
			]
		};
	});

	//test converting a Cellar to a CellarFlat
	test('WineCellarFlat should convert a Cellar to a CellarFlat', () => {
		cellarFlat = WineCellarFlat.convertToFlat(cellar);
		//use inline snapshot
		expect(cellarFlat).toMatchInlineSnapshot(`
			[
			  {
			    "Inventory": [
			      {
			        "Bin": "A1",
			        "Purchased": "2020-01-01",
			        "Qty": 10,
			        "Vintage": 2015,
			      },
			    ],
			    "Notes": "Excellent vintage",
			    "Producer": "Chateau Margaux",
			    "Variety": "Cabernet Sauvignon",
			    "Vineyard Location": "Bordeaux, France",
			    "Wine Name": "Margaux 2015",
			  },
			  {
			    "Inventory": [
			      {
			        "Bin": "A1",
			        "Purchased": "2020-01-01",
			        "Qty": 10,
			        "Vintage": 2016,
			      },
			    ],
			    "Notes": "Excellent vintage",
			    "Producer": "Sciandri Family Vineyards",
			    "Variety": "Red Blend",
			    "Vineyard Location": "Napa Valley, California",
			    "Wine Name": "Nello Coombsville",
			  },
			]
		`);

		//expect(wineCellarFlat.cellarFlat).toEqual(cellarFlat);
	});

	//test converting a CellarFlat to a Cellar using static method
	test('WineCellarFlat should convert a CellarFlat to a Cellar', () => {
		let cellar2 = WineCellarFlat.convertToCellar(cellarFlat);
		let cellarFlat2 = WineCellarFlat.convertToFlat(cellar);

		expect(cellar2).toMatchInlineSnapshot(`
			{
			  "Chateau Margaux": [
			    {
			      "Bin": "A1",
			      "Notes": "Excellent vintage",
			      "Purchased": "2020-01-01",
			      "Qty": 10,
			      "Variety": "Cabernet Sauvignon",
			      "Vineyard Location": "Bordeaux, France",
			      "Vintage": 2015,
			      "Wine Name": "Margaux 2015",
			    },
			  ],
			  "Sciandri Family Vineyards": [
			    {
			      "Bin": "A1",
			      "Notes": "Excellent vintage",
			      "Purchased": "2020-01-01",
			      "Qty": 10,
			      "Variety": "Red Blend",
			      "Vineyard Location": "Napa Valley, California",
			      "Vintage": 2016,
			      "Wine Name": "Nello Coombsville",
			    },
			  ],
			}
		`);
		expect(cellarFlat2).toMatchInlineSnapshot(`
			[
			  {
			    "Inventory": [
			      {
			        "Bin": "A1",
			        "Purchased": "2020-01-01",
			        "Qty": 10,
			        "Vintage": 2015,
			      },
			    ],
			    "Notes": "Excellent vintage",
			    "Producer": "Chateau Margaux",
			    "Variety": "Cabernet Sauvignon",
			    "Vineyard Location": "Bordeaux, France",
			    "Wine Name": "Margaux 2015",
			  },
			  {
			    "Inventory": [
			      {
			        "Bin": "A1",
			        "Purchased": "2020-01-01",
			        "Qty": 10,
			        "Vintage": 2016,
			      },
			    ],
			    "Notes": "Excellent vintage",
			    "Producer": "Sciandri Family Vineyards",
			    "Variety": "Red Blend",
			    "Vineyard Location": "Napa Valley, California",
			    "Wine Name": "Nello Coombsville",
			  },
			]
		`);
		/* expect(cellar2).toEqual(cellar);
		expect(cellarFlat2).toEqual(cellarFlat); */
	});

	//test converting from wine to wineFlat, then back to wine
	test('WineCellarFlat should convert a wine to a wineFlat, then back to a wine', () => {
		let wineFlat2 = WineCellarFlat.convertWineToFlat(wineFlat.Producer, wine);
		let wine2 = WineCellarFlat.convertWineFlatToWine(wineFlat2);
		expect(wineFlat2).toMatchInlineSnapshot(`
			{
			  "Inventory": [
			    {
			      "Bin": "A1",
			      "Purchased": "2020-01-01",
			      "Qty": 10,
			      "Vintage": 2015,
			    },
			  ],
			  "Notes": "Excellent vintage",
			  "Producer": "Chateau Margaux",
			  "Variety": "Cabernet Sauvignon",
			  "Vineyard Location": "Bordeaux, France",
			  "Wine Name": "Margaux 2015",
			}
		`);
		expect(wine2).toMatchInlineSnapshot(`
			{
			  "Bin": "A1",
			  "Notes": "Excellent vintage",
			  "Purchased": "2020-01-01",
			  "Qty": 10,
			  "Variety": "Cabernet Sauvignon",
			  "Vineyard Location": "Bordeaux, France",
			  "Vintage": 2015,
			  "Wine Name": "Margaux 2015",
			}
		`);

		//expect(wineFlat2).toEqual(wineFlat);
		//expect(wine2).toEqual(wine);
	});

	test('addWine should add wine to the cellarFlat', () => {
		const wineCellarFlat = new WineCellarFlat();
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

		wineCellarFlat.addWine(producer, wine);

		const expectedCellarFlat: CellarFlat = [
			{
				Producer: producer,
				'Wine Name': wine['Wine Name'],
				'Vineyard Location': wine['Vineyard Location'],
				Variety: wine.Variety,
				Inventory: [
					{
						Vintage: wine.Vintage,
						Bin: wine.Bin ? wine.Bin : '',
						Qty: wine.Qty,
						Purchased: wine.Purchased
					}
				],
				Notes: wine.Notes
			}
		];

		expect(wineCellarFlat.cellarFlat).toEqual(expectedCellarFlat);
	});

	//test adding wine via wineFlat
	test('addWine should add wine to the cellarFlat', () => {
		wineCellarFlat.addWine(wineFlat);

		expect(wineCellarFlat.cellarFlat[0]).toEqual(wineFlat);
	});

	test('removeWine should remove wine from the cellarFlat and update the cellar', () => {
		wineCellarFlat.cellarFlat = cellarFlat;
		const result = wineCellarFlat.removeWine(producer, wine['Wine Name']);
		console.log('WineCellarconversion debug');
		console.log(WineCellarFlat.convertWineFlatToWine(wineFlat2));
		expect(result).toBe(true);
		expect(wineCellarFlat.cellarFlat).toHaveLength(1);
		expect(wineCellarFlat.cellarFlat[0]).toContain(wineFlat2);
		expect(wineCellarFlat.cellar[wineFlat2.Producer]).toEqual([
			WineCellarFlat.convertWineFlatToWine(wineFlat2)
		]);
		expect(wineCellarFlat.cellar).toMatchInlineSnapshot(`
			{
			  "Sciandri Family Vineyards": [
			    {
			      "Bin": "A1",
			      "Notes": "Excellent vintage",
			      "Purchased": "2020-01-01",
			      "Qty": 10,
			      "Variety": "Red Blend",
			      "Vineyard Location": "Napa Valley, California",
			      "Vintage": 2016,
			      "Wine Name": "Nello Coombsville",
			    },
			  ],
			}
		`);
	});

	test('removeWine should remove wine from the cellarFlat and update the cellar', () => {
		wineCellarFlat.cellarFlat = cellarFlat;
		const result = wineCellarFlat.removeWine(producer, wine['Wine Name'], wine);

		expect(result).toBe(true);
		expect(wineCellarFlat.cellarFlat).toHaveLength(1);
		expect(wineCellarFlat.cellarFlat[0]).toEqual(wineFlat2);
		expect(wineCellarFlat.cellar[wineFlat2.Producer]).toEqual([
			WineCellarFlat.convertWineFlatToWine(wineFlat2)
		]);
	});

	test('removeWineFlat should remove wine from the cellarFlat and update the cellar', () => {
		wineCellarFlat.cellarFlat = cellarFlat;
		const result = wineCellarFlat.removeWineFlat(wineFlat);

		expect(result).toBe(true);
		expect(wineCellarFlat.cellarFlat).toHaveLength(1);
		expect(wineCellarFlat.cellarFlat[0]).toEqual(wineFlat2);
		expect(wineCellarFlat.cellar[wineFlat2.Producer]).toEqual([
			WineCellarFlat.convertWineFlatToWine(wineFlat2)
		]);
	});

	test('removeProducer should remove wines by the specified producer', () => {
		wineCellarFlat.cellarFlat = cellarFlat;
		const producer = 'Chateau Margaux';

		// Add some wines to the cellar
		// Remove wines by the specified producer
		const result = wineCellarFlat.removeProducer(producer);

		// Check that wines by the specified producer are removed
		expect(result).toBe(true);
		expect(wineCellarFlat.cellarFlat.length).toBe(1);
		expect(wineCellarFlat.cellarFlat[0].Producer).toBe('Sciandri Family Vineyards');
		expect(wineCellarFlat.cellar['Sciandri Family Vineyards']).toEqual([
			WineCellarFlat.convertWineFlatToWine(wineFlat2)
		]);
	});

	test('updateWine should update the wine in the cellarFlat', () => {
		const producer = 'Chateau Margaux';
		const producer2 = 'Sciandri Family Vineyards';
		const wine = {
			'Wine Name': 'Margaux 2015',
			'Vineyard Location': 'Bordeaux, France',
			Variety: 'Cabernet Sauvignon',
			Vintage: 2015,
			Bin: 'A1',
			Qty: 10,
			Purchased: '2020-01-01',
			Notes: 'Excellent vintage'
		};
		const wine2 = {
			'Wine Name': 'Nello Coombsville',
			'Vineyard Location': 'Napa Valley, California',
			Variety: 'Red Blend',
			Vintage: 2016,
			Bin: 'A1',
			Qty: 10,
			Purchased: '2020-01-01',
			Notes: 'Excellent vintage'
		};
		const updatedWine = {
			'Wine Name': 'Margaux 2015',
			'Vineyard Location': 'Bordeaux, France',
			Variety: 'Cabernet Sauvignon',
			Vintage: 2015,
			Bin: 'A1',
			Qty: 5,
			Purchased: '2020-01-01',
			Notes: 'Excellent vintage'
		};

		// Add the wine to the cellarFlat
		wineCellarFlat.addWine(producer, wine);
		wineCellarFlat.addWine(producer2, wine2);
		expect(wineCellarFlat.cellarFlat).toMatchInlineSnapshot(`
			[
			  {
			    "Inventory": [
			      {
			        "Bin": "A1",
			        "Purchased": "2020-01-01",
			        "Qty": 10,
			        "Vintage": 2015,
			      },
			    ],
			    "Notes": "Excellent vintage",
			    "Producer": "Chateau Margaux",
			    "Variety": "Cabernet Sauvignon",
			    "Vineyard Location": "Bordeaux, France",
			    "Wine Name": "Margaux 2015",
			  },
			  {
			    "Inventory": [
			      {
			        "Bin": "A1",
			        "Purchased": "2020-01-01",
			        "Qty": 10,
			        "Vintage": 2016,
			      },
			    ],
			    "Notes": "Excellent vintage",
			    "Producer": "Sciandri Family Vineyards",
			    "Variety": "Red Blend",
			    "Vineyard Location": "Napa Valley, California",
			    "Wine Name": "Nello Coombsville",
			  },
			]
		`);
		// Update the wine in the cellarFlat
		const result = wineCellarFlat.updateWine(producer, updatedWine);

		// Check if the wine was updated successfully
		wineCellarFlat.updateSearchParams({
			producer: producer,
			searchterm: wine['Wine Name'],
			variety: wine.Variety,
			vineyard: wine['Vineyard Location']
		});
		expect(wineCellarFlat.currentSearchParams).toMatchInlineSnapshot(`
			{
			  "Producer": {
			    "isActive": true,
			    "value": "Chateau Margaux",
			  },
			  "SearchTerm": {
			    "isActive": true,
			    "value": "Margaux 2015",
			  },
			  "Variety": {
			    "isActive": true,
			    "value": "Cabernet Sauvignon",
			  },
			  "Vineyard Location": {
			    "isActive": true,
			    "value": "Bordeaux, France",
			  },
			}
		`);

		expect(wineCellarFlat.cellarFlat).toMatchInlineSnapshot(`
			[
			  {
			    "Inventory": [
			      {
			        "Bin": "A1",
			        "Purchased": "2020-01-01",
			        "Qty": 5,
			        "Vintage": 2015,
			      },
			    ],
			    "Notes": "Excellent vintage",
			    "Producer": "Chateau Margaux",
			    "Variety": "Cabernet Sauvignon",
			    "Vineyard Location": "Bordeaux, France",
			    "Wine Name": "Margaux 2015",
			  },
			  {
			    "Inventory": [
			      {
			        "Bin": "A1",
			        "Purchased": "2020-01-01",
			        "Qty": 10,
			        "Vintage": 2016,
			      },
			    ],
			    "Notes": "Excellent vintage",
			    "Producer": "Sciandri Family Vineyards",
			    "Variety": "Red Blend",
			    "Vineyard Location": "Napa Valley, California",
			    "Wine Name": "Nello Coombsville",
			  },
			]
		`);

		expect(wineCellarFlat.filteredCellarFlat).toMatchInlineSnapshot(`
			[
			  {
			    "Inventory": [
			      {
			        "Bin": "A1",
			        "Purchased": "2020-01-01",
			        "Qty": 5,
			        "Vintage": 2015,
			      },
			    ],
			    "Notes": "Excellent vintage",
			    "Producer": "Chateau Margaux",
			    "Variety": "Cabernet Sauvignon",
			    "Vineyard Location": "Bordeaux, France",
			    "Wine Name": "Margaux 2015",
			  },
			]
		`);

		const updatedCellarFlat = wineCellarFlat.getFilteredCellarFlat();
		expect(result).toBe(true);

		expect(updatedCellarFlat).toMatchInlineSnapshot(`
			[
			  {
			    "Inventory": [
			      {
			        "Bin": "A1",
			        "Purchased": "2020-01-01",
			        "Qty": 5,
			        "Vintage": 2015,
			      },
			    ],
			    "Notes": "Excellent vintage",
			    "Producer": "Chateau Margaux",
			    "Variety": "Cabernet Sauvignon",
			    "Vineyard Location": "Bordeaux, France",
			    "Wine Name": "Margaux 2015",
			  },
			]
		`);

		expect(updatedCellarFlat[0]).toEqual(WineCellarFlat.convertWineToFlat(producer, updatedWine));
	});

	test('getCellar should convert cellarFlat to cellar and return the cellar object', () => {
		wineCellarFlat.cellarFlat = cellarFlat;

		const tmpCellar = wineCellarFlat.getCellar();

		expect(tmpCellar['Chateau Margaux']).toEqual([
			{
				'Wine Name': 'Margaux 2015',
				'Vineyard Location': 'Bordeaux, France',
				Variety: 'Cabernet Sauvignon',
				Vintage: 2015,
				Bin: 'A1',
				Qty: 10,
				Purchased: '2020-01-01',
				Notes: 'Excellent vintage'
			}
		]);
	});

	test('getAllWinesFlat should return an array of flattened wines', () => {
		wineCellarFlat = new WineCellarFlat(cellarFlat);

		const result = wineCellarFlat.getAllWinesFlat();

		expect(result).toMatchInlineSnapshot(`
			[
			  {
			    "Bin": "A1",
			    "Notes": "Excellent vintage",
			    "Purchased": "2020-01-01",
			    "Qty": 10,
			    "Variety": "Cabernet Sauvignon",
			    "Vineyard Location": "Bordeaux, France",
			    "Vintage": 2015,
			    "Wine Name": "Margaux 2015",
			    "producer": "Chateau Margaux",
			  },
			  {
			    "Bin": "A1",
			    "Notes": "Excellent vintage",
			    "Purchased": "2020-01-01",
			    "Qty": 10,
			    "Variety": "Red Blend",
			    "Vineyard Location": "Napa Valley, California",
			    "Vintage": 2016,
			    "Wine Name": "Nello Coombsville",
			    "producer": "Sciandri Family Vineyards",
			  },
			]
		`);

		//expect(result).toEqual([wineFlat,wineFlat2]);
	});
	test('getProducerNames should return unique producer names', () => {
		wineCellarFlat = new WineCellarFlat(cellarFlat);
		expect(wineCellarFlat.cellarFlat).toMatchInlineSnapshot(`
			[
			  {
			    "Inventory": [
			      {
			        "Bin": "A1",
			        "Purchased": "2020-01-01",
			        "Qty": 10,
			        "Vintage": 2015,
			      },
			    ],
			    "Notes": "Excellent vintage",
			    "Producer": "Chateau Margaux",
			    "Variety": "Cabernet Sauvignon",
			    "Vineyard Location": "Bordeaux, France",
			    "Wine Name": "Margaux 2015",
			  },
			  {
			    "Inventory": [
			      {
			        "Bin": "A1",
			        "Purchased": "2020-01-01",
			        "Qty": 10,
			        "Vintage": 2016,
			      },
			    ],
			    "Notes": "Excellent vintage",
			    "Producer": "Sciandri Family Vineyards",
			    "Variety": "Red Blend",
			    "Vineyard Location": "Napa Valley, California",
			    "Wine Name": "Nello Coombsville",
			  },
			]
		`);

		const result = wineCellarFlat.getProducerNames();

		expect(result).toMatchInlineSnapshot(`
			[
			  {
			    "name": "Chateau Margaux",
			    "value": "Chateau Margaux",
			  },
			  {
			    "name": "Sciandri Family Vineyards",
			    "value": "Sciandri Family Vineyards",
			  },
			]
		`);

		expect(result).toEqual([
			{ name: wineFlat.Producer, value: wineFlat.Producer },
			{ name: wineFlat2.Producer, value: wineFlat2.Producer }
		]);
	});
	test('getVarietyNames should return unique variety names', () => {
		wineCellarFlat = new WineCellarFlat(cellarFlat);

		const result = wineCellarFlat.getVarietyNames();

		expect(result).toMatchInlineSnapshot(`
			[
			  {
			    "name": "Cabernet Sauvignon",
			    "value": "Cabernet Sauvignon",
			  },
			  {
			    "name": "Red Blend",
			    "value": "Red Blend",
			  },
			]
		`);

		/* expect(result).toEqual([
			{ name: wineFlat.Variety, value: wineFlat.Variety },
			{ name: wineFlat2.Variety, value: wineFlat2.Variety }
		]); */
	});
	test('getVineyardNames should return unique vineyard names', () => {
		wineCellarFlat = new WineCellarFlat(cellarFlat);

		const vineyardNames = wineCellarFlat.getVineyardNames();

		expect(vineyardNames).toEqual([
			{ name: wineFlat['Vineyard Location'], value: wineFlat['Vineyard Location'] },
			{ name: wineFlat2['Vineyard Location'], value: wineFlat2['Vineyard Location'] }
		]);
	});
	test('chkFlatByPrdNmVyVar should return true if the wine exists in the cellar', () => {
		const result = WineCellarFlat.chkFlatByPrdNmVyVar(
			cellarFlat,
			wineFlat.Producer,
			wineFlat['Wine Name'],
			wineFlat['Vineyard Location'],
			wineFlat.Variety
		);

		expect(result).toBe(true);
	});

	test('chkFlatByPrdNmVyVar should return false if the wine does not exist in the cellar', () => {
		const producer = 'Chateau Margaux';
		const wineName = 'Wine B';
		const vineyard = 'Bordeaux, France';
		const variety = 'Cabernet Sauvignon';

		const result = WineCellarFlat.chkFlatByPrdNmVyVar(
			cellarFlat,
			producer,
			wineName,
			vineyard,
			variety
		);

		expect(result).toBe(false);
	});
	test('updateCellarFlat should update the cellarFlat, filteredCellarFlat, and cellar properties', () => {
		let updatedWineCellarFlat = new WineCellarFlat();

		updatedWineCellarFlat.updateCellarFlat(cellarFlat);

		expect(updatedWineCellarFlat.cellarFlat).toEqual(cellarFlat);
		expect(updatedWineCellarFlat.filteredCellarFlat).toEqual(cellarFlat);
		expect(updatedWineCellarFlat.cellar).toEqual(cellar);
	});
	test('updateSearchParams should update the searchParams property', () => {
		const searchParams = {
			producer: 'Chateau Margaux',
			searchterm: 'Margaux 2015',
			variety: 'Cabernet Sauvignon',
			vineyard: 'Bordeaux, France'
		};

		wineCellarFlat.updateSearchParams(searchParams);

		expect(wineCellarFlat.currentSearchParams).toMatchInlineSnapshot(`
			{
			  "Producer": {
			    "isActive": true,
			    "value": "Chateau Margaux",
			  },
			  "SearchTerm": {
			    "isActive": true,
			    "value": "Margaux 2015",
			  },
			  "Variety": {
			    "isActive": true,
			    "value": "Cabernet Sauvignon",
			  },
			  "Vineyard Location": {
			    "isActive": true,
			    "value": "Bordeaux, France",
			  },
			}
		`);

		//expect(wineCellarFlat.currentSearchParams).toEqual(searchParams);
	});
	test('updateCellar should update the cellar and convert it to flat', () => {
		wineCellarFlat.updateCellar(cellar);

		expect(wineCellarFlat.cellar).toEqual(cellar);
		expect(wineCellarFlat.cellarFlat).toEqual(cellarFlat);
	});
	test('getProducerCount should return the number of producers', () => {
		wineCellarFlat = new WineCellarFlat(cellarFlat);

		const producerCount = wineCellarFlat.getProducerCount();
		expect(producerCount).toBe(2);
	});
});
describe.only('WineCellarFlat', () => {
	let wineCellarFlat: WineCellarFlat;

	beforeEach(() => {
		wineCellarFlat = new WineCellarFlat();
	});

	describe('checkWineByNameVintage', () => {
		it('should return the wine object if found', () => {
			// Arrange
			const wineName = 'Margaux 2015';
			const vintage = 2015;
			const expectedWine: Wine = {
				'Wine Name': 'Margaux 2015',
				'Vineyard Location': 'Bordeaux, France',
				Variety: 'Cabernet Sauvignon',
				Vintage: 2015,
				Bin: 'A1',
				Qty: 10,
				Purchased: '2020-01-01',
				Notes: 'Excellent vintage'
			};
			wineCellarFlat.cellarFlat = [
				{
					Producer: 'Chateau Margaux',
					'Wine Name': 'Margaux 2015',
					'Vineyard Location': 'Bordeaux, France',
					Variety: 'Cabernet Sauvignon',
					Inventory: [
						{
							Vintage: 2015,
							Bin: 'A1',
							Qty: 10,
							Purchased: '2020-01-01'
						}
					],
					Notes: 'Excellent vintage'
				},
				{
					Producer: 'Other Producer',
					'Wine Name': 'Other Wine',
					'Vineyard Location': 'Other Location',
					Variety: 'Other Variety',
					Inventory: [
						{
							Vintage: 2020,
							Bin: 'B1',
							Qty: 5,
							Purchased: '2021-01-01'
						}
					],
					Notes: 'Some notes'
				}
			];

			// Act
			const result = wineCellarFlat.checkWineByNameVintage(wineName, vintage);

			// Assert
			expect(result).toEqual(expectedWine);
		});

		it('should return undefined if wine is not found', () => {
			// Arrange
			const wineName = 'Non-existent Wine';
			const vintage = 2020;
			wineCellarFlat.cellarFlat = [
				{
					Producer: 'Chateau Margaux',
					'Wine Name': 'Margaux 2015',
					'Vineyard Location': 'Bordeaux, France',
					Variety: 'Cabernet Sauvignon',
					Inventory: [
						{
							Vintage: 2015,
							Bin: 'A1',
							Qty: 10,
							Purchased: '2020-01-01'
						}
					],
					Notes: 'Excellent vintage'
				},
				{
					Producer: 'Other Producer',
					'Wine Name': 'Other Wine',
					'Vineyard Location': 'Other Location',
					Variety: 'Other Variety',
					Inventory: [
						{
							Vintage: 2020,
							Bin: 'B1',
							Qty: 5,
							Purchased: '2021-01-01'
						}
					],
					Notes: 'Some notes'
				}
			];

			// Act
			const result = wineCellarFlat.checkWineByNameVintage(wineName, vintage);

			// Assert
			expect(result).toBeUndefined();
		});
	});
});
