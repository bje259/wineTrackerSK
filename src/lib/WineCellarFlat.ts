/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { WineCellar } from './WineCellar';
import type { Cellar, CellarFlat, InvItem, SearchParams, Wine, WineFlat } from './types';

/**
 * @description Checks if an object is iterable.
 * @param obj
 * @returns boolean
 */
function isIterable(obj: any): boolean {
	return obj != null && typeof obj[Symbol.iterator] === 'function';
}

/**
 * The WineCellar class represents a collection of wines.
 * @property {Cellar} cellar - The cellar object.
 * @see Wine
 * @see Cellar
 * @see WineCellar
 * @example
 */
export class WineCellarFlat extends WineCellar {
	cellarFlat: CellarFlat;
	filteredCellarFlat: CellarFlat;
	currentSearchParams: SearchParams;

	/**
	 * The WineCellar class represents a collection of wines.
	 * @property {Cellar} cellar Optional- The cellar object.
	 * @property {CellarFlat} cellarFlat Optional- The cellar object in flat format.
	 * @see WineFlat
	 * @see CellarFlat
	 * const myCellar = new WineCellar();
	 * myCellar.addWine("Chateau Margaux", {
	 * 	"Wine Name": "Margaux 2015",
	 * 	"Vineyard Location": "Bordeaux, France",
	 * 	Variety: "Cabernet Sauvignon",
	 * 	Vintage: 2015,
	 * 	Bin: "A1",
	 * 	Qty: 10,
	 * 	Purchased: "2020-01-01",
	 * 	Notes: "Excellent vintage"
	 * });
	 */
	constructor(cell?: Cellar, cellFlat?: CellarFlat) {
		super(cell ? cell : cellFlat ? WineCellarFlat.convertToCellar(cellFlat) : {});
		this.cellarFlat = cellFlat ? cellFlat : cell ? WineCellarFlat.convertToFlat(cell) : [];
		this.filteredCellarFlat = this.cellarFlat;
		this.currentSearchParams = {
			Producer: { isActive: false, value: '' },
			['Vineyard Location']: { isActive: false, value: '' },
			Variety: { isActive: false, value: '' },
			SearchTerm: { isActive: false, value: '' }
		};

	}


	/**
	 * Convert cellar to cellarFlat
	 */
	public static convertToFlat(cellar: Cellar): CellarFlat {
		let cellarFlat: CellarFlat = [];
		for (const producer in cellar) {
			for (const wine of cellar[producer]) {
				if (
					!this.chkFlatByPrdNmVyVar(
						cellarFlat,
						producer,
						wine['Wine Name'],
						wine['Vineyard Location'] ? wine['Vineyard Location'] : null,
						wine.Variety ? wine.Variety : null
					)
				) {
					let newWineFlatItem: WineFlat = {
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
					};
					cellarFlat.push(newWineFlatItem);
				} else {
					let existingWineFlatItem: WineFlat | undefined = cellarFlat.find(
						(w) =>
							w.Producer === producer &&
							w['Wine Name'] === wine['Wine Name'] &&
							w['Vineyard Location'] === wine['Vineyard Location'] &&
							w.Variety === wine.Variety
					);
					if (existingWineFlatItem) {
						let newInvItem: InvItem = {
							Vintage: wine.Vintage,
							Bin: wine.Bin ? wine.Bin : '',
							Qty: wine.Qty,
							Purchased: wine.Purchased
						};
						existingWineFlatItem.Inventory.push(newInvItem);
					}
				}
			}
		}
		return cellarFlat;
	}

	/**
	 * Convert cellarFlat to cellar
	 */
	public static convertToCellar(cellarFlat: CellarFlat): Cellar {
		let cellar: Cellar = {};
		for (const wine of cellarFlat) {
			if (!cellar[wine.Producer]) {
				cellar[wine.Producer] = [];
			}
			for (const invItem of wine.Inventory) {
				let newWine: Wine = {
					'Wine Name': wine['Wine Name'],
					'Vineyard Location': wine['Vineyard Location'],
					Variety: wine.Variety,
					Vintage: invItem.Vintage,
					Bin: invItem.Bin,
					Qty: invItem.Qty,
					Purchased: invItem.Purchased,
					Notes: wine.Notes
				};
				cellar[wine.Producer].push(newWine);
			}
		}
		return cellar;
	}

	public static convertWineToFlat(producer: string, wine: Wine): WineFlat {
		let wineFlat: WineFlat = {
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
		};
		return wineFlat;
	}

	/* public static convertWinesToFlats(producer: string, wines: Wine[]): WineFlat[] {
		let wineFlats: WineFlat[] = [];
		for (let i = 0; i < wines.length; i++) {
			let wineFlat: WineFlat = {
				Producer: producer,
				'Wine Name': wines[i]['Wine Name'],
				'Vineyard Location': wines[i]['Vineyard Location'],
				Variety: wines[i].Variety,
				Inventory: [
					{
						Vintage: wines[i].Vintage,
						Bin: wines[i].Bin,
						Qty: wines[i].Qty,
						Purchased: wines[i].Purchased
					}
				],
				Notes: wines[i].Notes
			};
			wineFlats.push(wineFlat);
		}
		return wineFlats;
	} */

	public static convertWineFlatToWine(wineFlat: WineFlat): Wine {
		let wine: Wine = {
			['Wine Name']: wineFlat['Wine Name'],
			['Vineyard Location']: wineFlat['Vineyard Location'],
			Variety: wineFlat.Variety,
			Vintage: wineFlat.Inventory[0].Vintage,
			Bin: wineFlat.Inventory[0].Bin,
			Qty: wineFlat.Inventory[0].Qty,
			Purchased: wineFlat.Inventory[0].Purchased,
			Notes: wineFlat.Notes
		};
		return wine;
	}

	public static convertWineInvToProdAndWineArray(
		wineInv: WineFlat
	): [producer: string, wine: Wine[]] {
		let wineArray: Wine[] = [];
		for (const invItem of wineInv.Inventory) {
			let wine: Wine = {
				'Wine Name': wineInv['Wine Name'],
				'Vineyard Location': wineInv['Vineyard Location'],
				Variety: wineInv.Variety,
				Vintage: invItem.Vintage,
				Bin: invItem.Bin,
				Qty: invItem.Qty,
				Purchased: invItem.Purchased,
				Notes: wineInv.Notes
			};
			wineArray.push(wine);
		}
		return [wineInv.Producer, wineArray];
	}

	/**
	 * Adds a wine to the wine cellar.
	 * @param producer - The producer of the wine.
	 * @param wine - The wine to be added.
	 * @returns Nothing.
	 * @see Wine
	 * @see Cellar
	 * @see WineCellar
	 * @example
	 * const myCellar = new WineCellar();
	 * myCellar.addWine("Chateau Margaux", {
	 * 	"Wine Name": "Margaux 2015",
	 * 	"Vineyard Location": "Bordeaux, France",
	 * 	Variety: "Cabernet Sauvignon",
	 * 	Vintage: 2015,
	 * 	Bin: "A1",
	 * 	Qty: 10,
	 * 	Purchased: "2020-01-01",
	 * 	Notes: "Excellent vintage"
	 * });
	 * console.log(myCellar.getWinesByProducer("Chateau Margaux"));
	 * // Output:
	 * // [
	 * // 	{
	 * // 		"Wine Name": "Margaux 2015",
	 * // 		"Vineyard Location": "Bordeaux, France",
	 * // 		Variety: "Cabernet Sauvignon",
	 * // 		Vintage: 2015,
	 * // 		Bin: "A1",
	 * // 		Qty: 10,
	 * // 		Purchased: "2020-01-01",
	 * // 		Notes: "Excellent vintage"
	 * // 	}
	 * // ]
	 */

	addWine(producer: string, wine: Wine): void;
	addWine(wineFlat: WineFlat): void;
	addWine(arg1: string | WineFlat, arg2?: Wine): void {
		if (typeof arg1 === 'string') {
			const producer = arg1;
			const existingCellarFlat: CellarFlat = this.cellarFlat || [];
			if (
				arg2 &&
				WineCellarFlat.chkFlatByPrdNmVyVar(
					existingCellarFlat,
					producer,
					arg2['Wine Name'],
					arg2['Vineyard Location'],
					arg2.Variety
				)
			) {
				const existingWineFlat = existingCellarFlat.find(
					(w) =>
						w.Producer === producer &&
						w['Wine Name'] === arg2['Wine Name'] &&
						w['Vineyard Location'] === arg2['Vineyard Location'] &&
						w.Variety === arg2.Variety
				);
				if (existingWineFlat)
					existingCellarFlat[existingCellarFlat.indexOf(existingWineFlat)].Inventory.push({
						Vintage: arg2.Vintage,
						Bin: arg2.Bin ? arg2.Bin : '',
						Qty: arg2.Qty,
						Purchased: arg2.Purchased
					});
				this.cellarFlat = existingCellarFlat;
			} else {
				if (arg2)
					existingCellarFlat.push({
						Producer: producer,
						'Wine Name': arg2['Wine Name'],
						'Vineyard Location': arg2['Vineyard Location'],
						Variety: arg2.Variety,
						Inventory: [
							{
								Vintage: arg2.Vintage,
								Bin: arg2.Bin ? arg2.Bin : '',
								Qty: arg2.Qty,
								Purchased: arg2.Purchased
							}
						],
						Notes: arg2.Notes
					});
				this.cellarFlat = existingCellarFlat;
			}
		} else {
			const wineFlat = arg1;
			const existingCellarFlat: CellarFlat = this.cellarFlat || [];
			if (
				WineCellarFlat.chkFlatByPrdNmVyVar(
					existingCellarFlat,
					wineFlat.Producer,
					wineFlat['Wine Name'],
					wineFlat['Vineyard Location'],
					wineFlat.Variety
				)
			) {
				const existingWineFlat = existingCellarFlat.find(
					(w) =>
						w.Producer === wineFlat.Producer &&
						w['Wine Name'] === wineFlat['Wine Name'] &&
						w['Vineyard Location'] === wineFlat['Vineyard Location'] &&
						w.Variety === wineFlat.Variety
				);
				for (const invItem of wineFlat.Inventory)
					if (existingWineFlat)
						existingCellarFlat[existingCellarFlat.indexOf(existingWineFlat)].Inventory.push({
							Vintage: invItem.Vintage,
							Bin: invItem.Bin,
							Qty: invItem.Qty,
							Purchased: invItem.Purchased
						});
				this.cellarFlat = existingCellarFlat;
			} else {
				existingCellarFlat.push(wineFlat);
				this.cellarFlat = existingCellarFlat;
			}
		}
		//todo decide if I want to keep cellar in sync with cellarFlat
		this.cellar = WineCellarFlat.convertToCellar(this.cellarFlat);
	}

	/**
	 * Removes a wine from the wine cellar.
	 * @param producer - The producer of the wine.
	 * @param wineName - The name of the wine.
	 * @param wine - The wine to be removed (optional).
	 * @returns True if the wine was successfully removed, false otherwise.
	 */
	removeWine(producer: string, wineName: string, wine?: Wine): boolean {
		if (this.cellarFlat) {
			const currentCellarFlat = this.cellarFlat;
			const index = this.cellarFlat.findIndex(
				(w) =>
					w.Producer === producer &&
					w['Wine Name'] === wineName &&
					wine?.Variety &&
					w['Vineyard Location'] === wine['Vineyard Location'] &&
					w.Variety === wine.Variety
			);

			if (index !== -1) {
				currentCellarFlat.splice(index, 1);
				this.cellarFlat = currentCellarFlat;
				this.cellar = WineCellarFlat.convertToCellar(this.cellarFlat);
				return true;
			}
		}
		return false;
	}

	/**
	 * Remove a producer from a wine cellar.
	 * @param producer - The producer of the wine.
	 * @returns True if the producer was successfully removed, false otherwise.
	 * @see WineFlat
	 * @see CellarFlat
	 */
	removeProducer(producer: string): boolean {
		let tempCellarFlat: CellarFlat = [];
		let foundProducer = false;
		for (const wine of this.cellarFlat) {
			if (wine.Producer !== producer) {
				tempCellarFlat.push(wine);
			} else {
				foundProducer = true;
			}
		}
		this.cellarFlat = tempCellarFlat;
		return foundProducer;
	}

	/**
	 * Updates a wine given the producer and wine object.
	 * @param producer - The producer of the wine.
	 * @param wine - The wine to be updated.
	 * @param i - The index of the wine to be updated.
	 * @returns True if the wine was successfully updated, false otherwise.
	 * @see Wine
	 * @see Cellar
	 * @see WineCellar
	 * @example
	 * const myCellar = new WineCellar();
	 * myCellar.addWine("Chateau Margaux", {
	 * 	"Wine Name": "Margaux 2015",
	 * 	"Vineyard Location": "Bordeaux, France",
	 * 	Variety: "Cabernet Sauvignon",
	 * 	Vintage: 2015,
	 * 	Bin: "A1",
	 * 	Qty: 10,
	 * 	Purchased: "2020-01-01",
	 * 	Notes: "Excellent vintage"
	 * });
	 * const wines = myCellar.getWinesByProducer("Chateau Margaux");
	 * wines[0].Qty = 5;
	 * myCellar.updateWine("Chateau Margaux", wines[0]);
	 * console.log(myCellar.getWinesByProducer("Chateau Margaux"));
	 * // Output:
	 * // [
	 * // 	{
	 * // 		"Wine Name": "Margaux 2015",
	 * // 		"Vineyard Location": "Bordeaux, France",
	 * // 		Variety: "Cabernet Sauvignon",
	 * // 		Vintage: 2015,
	 * // 		Bin: "A1",
	 * // 		Qty: 5,
	 * // 		Purchased: "2020-01-01",
	 * // 		Notes: "Excellent vintage"
	 * // 	}
	 * // ]
	 */
	updateWine(producer: string, wine: Wine, i: number = -1): boolean {
		if (this.cellarFlat) {
			const wineFlat = WineCellarFlat.convertWineToFlat(producer, wine);
			const currentCellarFlat = this.cellarFlat;
			if (i === -1) {
				const index = this.cellarFlat.findIndex(
					(w) =>
						w.Producer === producer &&
						w['Wine Name'] === wine['Wine Name'] &&
						w['Vineyard Location'] === wine['Vineyard Location'] &&
						w.Variety === wine.Variety
				);
				if (index !== -1) {
					currentCellarFlat[index] = wineFlat;
					this.cellarFlat = currentCellarFlat;
					return true;
				}
			} else {
				currentCellarFlat[i] = wineFlat;
				this.cellarFlat = currentCellarFlat;
				return true;
			}
		}
		return false;
	}
	//use filter function for flatwine version
	/**
	 * Retrieves an array of wines by the specified producer.
	 * @param producer - The name of the producer.
	 * @returns An array of wines produced by the specified producer, or undefined if no wines are found.
	 */
	getWinesByProducer(producer: string): Wine[] | undefined {
		this.cellar = WineCellarFlat.convertToCellar(this.cellarFlat);
		return this.cellar[producer];
	}

	//use filter function for flatwine version
	/**
	 * Retrive any matching wines by the specified producer and wine name.
	 * @param producer - The name of the producer.
	 * @param wineName - The name of the wine.
	 * @returns An array of wines produced by the specified producer and wine name, or undefined if no wines are found.
	 * @see Wine
	 * @see Cellar
	 * @see WineCellar
	 * @example
	 * const myCellar = new WineCellar();
	 * myCellar.addWine("Chateau Margaux", {
	 * 	"Wine Name": "Margaux 2015",
	 * 	"Vineyard Location": "Bordeaux, France",
	 * 	Variety: "Cabernet Sauvignon",
	 * 	Vintage: 2015,
	 * 	Bin: "A1",
	 * 	Qty: 10,
	 * 	Purchased: "2020-01-01",
	 * 	Notes: "Excellent vintage"
	 * });
	 * console.log(myCellar.getWinesByProducerWineName("Chateau Margaux", "Margaux 2015"));
	 * // Output:
	 * // [
	 * // 	{
	 * // 		"Wine Name": "Margaux 2015",
	 * // 		"Vineyard Location": "Bordeaux, France",
	 * // 		Variety: "Cabernet Sauvignon",
	 * // 		Vintage: 2015,
	 * // 		Bin: "A1",
	 * // 		Qty: 10,
	 * // 		Purchased: "2020-01-01",
	 * // 		Notes: "Excellent vintage"
	 * // 	}
	 * // ]
	 */
	getWinesByProducerWineName(producer: string, wineName: string): Wine[] | undefined {
		if (this.cellar[producer]) {
			return this.cellar[producer].filter((wine) => wine['Wine Name'] === wineName);
		}
		return undefined;
	}

	/**
	 * Retrieves the cellar object.
	 * @returns The cellar object.
	 */
	getCellar(): Cellar {
		this.cellar = WineCellarFlat.convertToCellar(this.cellarFlat);
		return this.cellar;
	}

	getCellarFlat(): CellarFlat {
		return this.cellarFlat;
	}

	/**
	 * Retrieves a flat array of all producers and wines in the cellar.
	 * @returns An array of wines produced by the specified producer, or undefined if no wines are found.
	 * @example
	 * const myCellar = new WineCellar();
	 * myCellar.addWine("Chateau Margaux", {
	 * 	"Wine Name": "Margaux 2015",
	 * 	"Vineyard Location": "Bordeaux, France",
	 * 	Variety: "Cabernet Sauvignon",
	 * 	Vintage: 2015,
	 * 	Bin: "A1",
	 * 	Qty: 10,
	 * 	Purchased: "2020-01-01",
	 * 	Notes: "Excellent vintage"
	 * });
	 * console.log(myCellar.getAllWinesFlat());
	 * // Output:
	 * // [
	 * // 	{
	 * // 		producer: "Chateau Margaux",
	 * // 		"Wine Name": "Margaux 2015",
	 * // 		"Vineyard Location": "Bordeaux, France",
	 * // 		Variety: "Cabernet Sauvignon",
	 * // 		Vintage: 2015,
	 * // 		Bin: "A1",
	 * // 		Qty: 10,
	 * // 		Purchased: "2020-01-01",
	 * // 		Notes: "Excellent vintage"
	 * // 	}
	 * // ]
	 */
	getAllWinesFlat(): {
		producer: string;
		'Wine Name': string;
		'Vineyard Location'?: string;
		Variety?: string | undefined;
		Vintage: number;
		Bin?: string | undefined;
		Qty: number;
		Purchased?: string | undefined;
		Notes?: string | undefined;
	}[] {
		let wines: {
			producer: string;
			'Wine Name': string;
			'Vineyard Location'?: string;
			Variety?: string | undefined;
			Vintage: number;
			Bin?: string | undefined;
			Qty: number;
			Purchased?: string | undefined;
			Notes?: string | undefined;
		}[] = [];
		for (const wine of this.cellarFlat) {
			for (const invItem of wine.Inventory) {
				wines.push({
					producer: wine.Producer,
					'Wine Name': wine['Wine Name'],
					'Vineyard Location': wine['Vineyard Location'],
					Variety: wine.Variety,
					Vintage: invItem.Vintage,
					Bin: invItem.Bin,
					Qty: invItem.Qty,
					Purchased: invItem.Purchased,
					Notes: wine.Notes
				});
			}
		}
		return wines;
	}

	/**
	 * Retrieve producer names formatted as {name: "Producer Name", value: "Producer Name"}.
	 * @returns An array of producer names.
	 * @example
	 * const myCellar = new WineCellar();
	 * myCellar.addWine("Chateau Margaux", {
	 * 	"Wine Name": "Margaux 2015",
	 * 	"Vineyard Location": "Bordeaux, France",
	 * 	Variety: "Cabernet Sauvignon",
	 * 	Vintage: 2015,
	 * 	Bin: "A1",
	 * 	Qty: 10,
	 * 	Purchased: "2020-01-01",
	 * 	Notes: "Excellent vintage"
	 * });
	 * console.log(myCellar.getProducerNames());
	 * // Output:
	 * // [
	 * 		{
	 * 			name: "Chateau Margaux",
	 * 			value: "Chateau Margaux"
	 * 		}
	 * // ]
	 */
	getProducerNames(): { name: string; value: string }[] {
		const producers: { name: string; value: string }[] = [];
		const winesFlat = this.filteredCellarFlat;
		//if (!isIterable(winesFlat)) return [];
		for (const wines of this.filteredCellarFlat) {
			producers.push({ name: wines.Producer, value: wines.Producer });
		}
		console.log(producers);
		console.log('get producer names mid moethod:');
		const uniqueProducers = producers.filter(
			(v, i, a) => a.findIndex((t) => t.name === v.name) === i
		);
		console.log(uniqueProducers);
		console.log('above are unqiue producers');
		return uniqueProducers || [];
	}

	/**
	 * Retrieve variety names formatted as {name: "variety", value: "variety"}.
	 * @returns An array of variety names.
	 */
	getVarietyNames(): { name: string; value: string }[] {
		const varieties: { name: string; value: string }[] = [];
		const winesFlat = this.filteredCellarFlat;
		//if (!isIterable(winesFlat)) return [];
		for (const wineFlat of winesFlat) {
			if (wineFlat.Variety) varieties.push({ name: wineFlat.Variety, value: wineFlat.Variety });
		}
		const uniqueVarieties = varieties.filter(
			(v, i, a) => a.findIndex((t) => t.name === v.name) === i
		);
		return uniqueVarieties || [];
	}

	/**
	 * Retrieve vineyard names formatted as {name: "vineyard", value: "vineyard"}.
	 * @returns An array of vineyard names.
	 */
	getVineyardNames(): { name: string; value: string }[] {
		const vineyards: { name: string; value: string }[] = [];
		const winesFlat = this.filteredCellarFlat;
		//if (!isIterable(winesFlat)) return [];
		for (const wineFlat of winesFlat) {
			if (wineFlat['Vineyard Location'])
				vineyards.push({
					name: wineFlat['Vineyard Location'],
					value: wineFlat['Vineyard Location']
				});
		}
		const uniqueVineyards = vineyards.filter(
			(v, i, a) => a.findIndex((t) => t.name === v.name) === i
		);
		return uniqueVineyards || [];
	}

	/**
	 * Retrieve a filtered cellar based on the provided filters (optional filters include searchterm, producer, variety, vineyard).
	 * @param filters - An object containing optional filters.
	 * @returns A filtered cellar object.
	 * @example
	 * const myCellar = new WineCellar();
	 * myCellar.addWine("Chateau Margaux", {
	 * 	"Wine Name": "Margaux 2015",
	 * 	"Vineyard Location": "Bordeaux, France",
	 * 	Variety: "Cabernet Sauvignon",
	 * 	Vintage: 2015,
	 * 	Bin: "A1",
	 * 	Qty: 10,
	 * 	Purchased: "2020-01-01",
	 * 	Notes: "Excellent vintage"
	 * });
	 * console.log(myCellar.getFilteredCellar({ searchterm: "Margaux" }));
	 * // Output:
	 * // {
	 * // 	"Chateau Margaux": [
	 * // 		{
	 * // 			"Wine Name": "Margaux 2015",
	 * // 			"Vineyard Location": "Bordeaux, France",
	 * // 			Variety: "Cabernet Sauvignon",
	 * // 			Vintage: 2015,
	 * // 			Bin: "A1",
	 * // 			Qty: 10,
	 * // 			Purchased: "2020-01-01",
	 * // 			Notes: "Excellent vintage"
	 * // 		}
	 * // 	]
	 * // }
	 */
	getFilteredCellar(filters: {
		searchterm?: string;
		producer?: string;
		variety?: string;
		vineyard?: string;
	}): Cellar {
		let filteredCellar: Cellar = {};
		for (const producer in this.cellar) {
			for (const wine of this.cellar[producer]) {
				if (
					(!filters.searchterm ||
						filters.searchterm === '' ||
						wine['Wine Name']?.toLowerCase().includes(filters.searchterm.toLowerCase()) ||
						wine['Vineyard Location']?.toLowerCase().includes(filters.searchterm.toLowerCase()) ||
						wine['Variety']?.toLowerCase().includes(filters.searchterm.toLowerCase()) ||
						wine['Bin']?.toLowerCase().includes(filters.searchterm.toLowerCase()) ||
						wine['Notes']?.toLowerCase().includes(filters.searchterm.toLowerCase()) ||
						producer.toLowerCase().includes(filters.searchterm.toLowerCase())) &&
					(!filters.producer ||
						filters.producer === '' ||
						producer.toLowerCase().includes(filters.producer.toLowerCase())) &&
					(!filters.variety ||
						filters.variety === '' ||
						wine.Variety?.toLowerCase().includes(filters.variety.toLowerCase())) &&
					(!filters.vineyard ||
						filters.vineyard === '' ||
						wine['Vineyard Location']?.toLowerCase().includes(filters.vineyard.toLowerCase()))
				) {
					if (!filteredCellar[producer]) {
						filteredCellar[producer] = [];
					}
					filteredCellar[producer].push(wine);
				}
			}
		}
		return filteredCellar;
	}

	/**
	 * Update search parameters for the filtered cellar.
	 *
	 */
	updateSearchParams(filters: {
		searchterm?: string;
		producer?: string;
		variety?: string;
		vineyard?: string;
	}): void {
		this.currentSearchParams = {
			Producer: { isActive: false, value: '' },
			['Vineyard Location']: { isActive: false, value: '' },
			Variety: { isActive: false, value: '' },
			SearchTerm: { isActive: false, value: '' }
		};

		
		let invKeys: (keyof InvItem)[] = ['Vintage', 'Bin', 'Qty', 'Purchased'];
		let searchToken = '';
		let keys: (keyof SearchParams)[] = [];
		for (const key in this.currentSearchParams) {
		if (key === 'SearchTerm') {
			continue;
		}
		keys.push(key as keyof SearchParams);
		}
			}
			
		
	
	


	/**
	 * Update filtered celler data based on current search parameters.
	 * @param
	 * @returns
	 */

	updateFilteredCellar(searchToken: string): void {
		//cycle through the search params one at a time and updated the cellarFlat
		//if the search term is empty, then skip that search param
		//if the search term is not empty, then filter the cellarFlat based on that search param
		//SearchTerm
		let keys: (keyof WineFlat)[] = [
			'Wine Name',
			'Vineyard Location',
			'Variety',
			'Inventory',
			'Notes',
			'Producer'
		];
		let invKeys: (keyof InvItem)[] = ['Vintage', 'Bin', 'Qty', 'Purchased'];

		let currentCellarFlat = this.cellarFlat;
		if (this.currentSearchParams.SearchTerm?.isActive) {
			currentCellarFlat = currentCellarFlat.filter((wineFlat) => {
				if (searchToken === 'Inventory') return true;
				return keys.some((key) => {
					if (key === 'Inventory') {
						return true;
					} else {
						let searchTermValue = this.currentSearchParams.SearchTerm?.value;
						if (typeof searchTermValue === 'string') {
							return wineFlat[key]?.toLowerCase().includes(searchTermValue.toLowerCase());
						}
						return false;
					}
				});
			});
			//Inventory
			if(currentCellarFlat&&(searchToken==='Inventory'||searchToken==='SearchTerm')){
				currentCellarFlat = currentCellarFlat.filter((wineFlat) => {
					return wineFlat.Inventory.some((invItem) => {
						return invKeys.some((key) => {
							return invItem[key]?.toString().toLowerCase().includes(searchToken.toLowerCase());
						});
					});
				});
			}
		}
		//Producer
		if (this.currentSearchParams.Producer ? this.currentSearchParams["Producer"] : true) {
			currentCellarFlat = currentCellarFlat.filter((wineFlat) => {
				return wineFlat.Producer?.toLowerCase().includes(searchToken.toLowerCase());
			});
		}
		//Variety
		if (this.currentSearchParams.Variety ? this.currentSearchParams.Variety["isActive"] : true) {
			currentCellarFlat = currentCellarFlat.filter((wineFlat) => {
				return wineFlat.Variety?.toLowerCase().includes(searchToken.toLowerCase());
			});
		}
		//Vineyard Location
		if (
			this.currentSearchParams['Vineyard Location']
				? this.currentSearchParams['Vineyard Location']["isActive"]
				: true
		) {
			currentCellarFlat = currentCellarFlat.filter((wineFlat) => {
				return wineFlat['Vineyard Location']?.toLowerCase().includes(searchToken.toLowerCase());
			});
		}
		this.filteredCellarFlat = currentCellarFlat;
		console.log('filtered cellar flat: ');
		console.log(this.filteredCellarFlat);
	}

	getFilteredCellarFlat(): WineFlat[] {
		return this.filteredCellarFlat;
	}

	/**
	 * Checks the wine cellar for a wine with the specified name and vintage.
	 * @param wineName - The name of the wine to search for.
	 * @param vintage - The vintage of the wine to search for.
	 * @returns The wine object if found, otherwise undefined.
	 */
	checkWineByNameVintage(wineName: string, vintage: number): Wine | undefined {
		/*return WineCellarFlat.convertWineFlatToWine(
			this.cellarFlat.find((wine) => {
				return (
					wine['Wine Name'] === wineName &&
					wine.Inventory.some((invItem) => {
						return invItem.Vintage === vintage;
					})
				);
			})
		);*/
		//todo
		let tempWine: any = {};
		return tempWine;
	}

	/**
	 *  Checks the wine cellar for a wine with the specified name, producer, vineyard, and variety.
	 * @param producer
	 * @param wineName
	 * @param vineyard
	 * @param variety
	 * @returns boolean
	 * @see WineFlat
	 * @see CellarFlat
	 * @see Wine
	 */
	public static chkFlatByPrdNmVyVar(
		cellarFlat: CellarFlat,
		producer: string,
		wineName: string,
		vineyard?: string | null,
		variety?: string | null
	): boolean {
		const cellFlat = cellarFlat;
		if (!cellFlat || cellFlat.length === 0) return false;
		for (const wine of cellFlat) {
			if (wine.Producer === producer && wine['Wine Name'] === wineName) {
				const vineyardMatch =
					vineyard === null
						? wine['Vineyard Location'] === undefined
						: wine['Vineyard Location'] === vineyard;
				const varietyMatch =
					variety === null ? wine.Variety === undefined : wine.Variety === variety;

				if (vineyardMatch && varietyMatch) {
					return true;
				}
			}
		}
		return false;
	}

	

	/**
	 * Updates this.cellar for a specified producer with a wine array provided as a parameter.
	 * @param producer - The name of the producer.
	 * @param wines - An array of wines.
	 * @returns Nothing.
	 * @see Wine
	 * @see Cellar
	 * @see WineCellar
	 * @example
	 * const myCellar = new WineCellar();
	 * myCellar.addWine("Chateau Margaux", {
	 * 	"Wine Name": "Margaux 2015",
	 * 	"Vineyard Location": "Bordeaux, France",
	 * 	Variety: "Cabernet Sauvignon",
	 * 	Vintage: 2015,
	 * 	Bin: "A1",
	 * 	Qty: 10,
	 * 	Purchased: "2020-01-01",
	 * 	Notes: "Excellent vintage"
	 * });
	 * const wines = myCellar.getWinesByProducer("Chateau Margaux");
	 * wines[0].Qty = 5;
	 * myCellar.updateCellar("Chateau Margaux", wines);
	 * console.log(myCellar.getWinesByProducer("Chateau Margaux"));
	 * // Output:
	 * // [
	 * // 	{
	 * // 		"Wine Name": "Margaux 2015",
	 * // 		"Vineyard Location": "Bordeaux, France",
	 * // 		Variety: "Cabernet Sauvignon",
	 * // 		Vintage: 2015,
	 * // 		Bin: "A1",
	 * // 		Qty: 5,
	 * // 		Purchased: "2020-01-01",
	 * // 		Notes: "Excellent vintage"
	 * // 	}
	 * // ]
	 */
	updateCellarByProducer(producer: string, wines: Wine[]): void {
		this.cellar[producer] = wines;
		this.cellarFlat = WineCellarFlat.convertToFlat(this.cellar);
	}

	/**
	 * Updates this.cellar with a provided cellar object.
	 * @param cellar - The cellar object.
	 * @returns Nothing.
	 * @see Wine
	 * @see Cellar
	 * @see WineCellar
	 * @example
	 * const myCellar = new WineCellar();
	 * myCellar.addWine("Chateau Margaux", {
	 * 	"Wine Name": "Margaux 2015",
	 * 	"Vineyard Location": "Bordeaux, France",
	 * 	Variety: "Cabernet Sauvignon",
	 * 	Vintage: 2015,
	 * 	Bin: "A1",
	 * 	Qty: 10,
	 * 	Purchased: "2020-01-01",
	 * 	Notes: "Excellent vintage"
	 * });
	 * const wines = myCellar.getWinesByProducer("Chateau Margaux");
	 * wines[0].Qty = 5;
	 * myCellar.updateCellar("Chateau Margaux", wines);
	 * console.log(myCellar.getWinesByProducer("Chateau Margaux"));
	 * // Output:
	 * // [
	 * // 	{
	 * // 		"Wine Name": "Margaux 2015",
	 * // 		"Vineyard Location": "Bordeaux, France",
	 * // 		Variety: "Cabernet Sauvignon",
	 * // 		Vintage: 2015,
	 * // 		Bin: "A1",
	 * // 		Qty: 5,
	 * // 		Purchased: "2020-01-01",
	 * // 		Notes: "Excellent vintage"
	 * // 	}
	 * // ]
	 */
	updateCellar(cellar: Cellar): void {
		this.cellar = cellar;
		this.cellarFlat = WineCellarFlat.convertToFlat(this.cellar);
		console.log(this.cellar);
	}

	updateCellarFlat(cellarFlat: CellarFlat): void {
		this.cellarFlat = cellarFlat;
		this.filteredCellarFlat = cellarFlat;
		this.cellar = WineCellarFlat.convertToCellar(this.cellarFlat);
	}

	/**
	 * Retrieves the number of producers in the cellar.
	 * @returns The number of producers in the cellar.
	 */
	getProducerCount(): number {
		return this.getProducerNames().length;
	}

	// Additional utility methods can be added as needed
}

export default WineCellarFlat;

// Example usage:
// const myCellarFlat = new WineCellarFlat();
// myCellarFlat.addWine("Chateau Margaux", {
// 	"Wine Name": "Margaux 2015",
// 	"Vineyard Location": "Bordeaux, France",
// 	Variety: "Cabernet Sauvignon",
// 	Vintage: 2015,
// 	Bin: "A1",
// 	Qty: 10,
// 	Purchased: "2020-01-01",
// 	Notes: "Excellent vintage"
// });
// console.log(myCellarFlat.getWinesByProducer("Chateau Margaux"));
// // Output:
// // [
// // 	{
// // 		"Wine Name": "Margaux 2015",
// // 		"Vineyard Location": "Bordeaux, France",
// // 		Variety: "Cabernet Sauvignon",
// // 		Vintage: 2015,
// // 		Bin: "A1",
// // 		Qty: 10,
// // 		Purchased: "2020-01-01",
// // 		Notes: "Excellent vintage"
// // 	}
// // ]

//console.log(myCellar.getWinesByProducer("Chateau Margaux"));
