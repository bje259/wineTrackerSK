import type { Cellar, CellarFlat, Wine, WineFlat } from './types';

/**
 * @description Checks if an object is iterable.
 * @param obj
 * @returns boolean
 */

//TODO
//@todo
// @TODO
/**
 * The WineCellar class represents a collection of wines.
 * @property {Cellar} cellar - The cellar object.
 * @see Wine
 * @see Cellar
 * @see WineCellar
 * @example
 * @todo convert to store data in new flat datatypes
 */
export default class WineCellar {
	cellar: Cellar;

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
	constructor(cell?: Cellar) {
		this.cellar = cell ? cell : {};
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
			const existingWine: Wine[] = this.cellar[producer] || [];
			if (arg2) {
				this.cellar[producer] = [...existingWine, arg2];
			}
		} else {
			const producer = arg1.Producer;
			for (const invItem of arg1.Inventory) {
				const wine = {
					'Wine Name': arg1['Wine Name'],
					'Vineyard Location': arg1['Vineyard Location'],
					Variety: arg1.Variety,
					Vintage: invItem.Vintage,
					Bin: invItem.Bin,
					Qty: invItem.Qty,
					Purchased: invItem.Purchased,
					Notes: arg1.Notes
				};
				const existingWine: Wine[] = this.cellar[producer] || [];
				this.cellar[producer] = [...existingWine, wine];
			}
		}
	}

	/**
	 * Adds a producer to the wine cellar.
	 * @param producer - The producer of the wine.
	 * @returns Nothing.
	 * @see Wine
	 * @see Cellar
	 * @see WineCellar
	 */
	addProducer(producer: string): void {
		this.cellar[producer] = [];
	}
	//todo add flatwine version
	/**
	 * Removes a wine from the wine cellar.
	 * @param producer - The producer of the wine.
	 * @param wineName - The name of the wine.
	 * @param wine - The wine to be removed (optional).
	 * @returns True if the wine was successfully removed, false otherwise.
	 */
	removeWine(producer: string, wineName: string, wine?: Wine): boolean {
		if (this.cellar[producer]) {
			if (wine) {
				const index = this.cellar[producer].indexOf(wine);
				if (index !== -1) {
					let tmp = this.cellar[producer];
					tmp.splice(index, 1);
					this.cellar[producer] = tmp;
					return true; // Wine removed successfully
				}
			} else {
				const index = this.cellar[producer].findIndex((wine) => wine['Wine Name'] === wineName);
				if (index !== -1) {
					let tmp = this.cellar[producer];
					tmp.splice(index, 1);
					this.cellar[producer] = tmp;
				}
			}
		}
		return false; // Wine not found
	}

	/**
	 * Remove a producer from a wine cellar.
	 */
	removeProducer(producer: string): boolean {
		let tempCellar: Cellar = {};
		if (!this.cellar[producer]) return false;
		Object.keys(this.cellar).forEach((key) => {
			if (key !== producer) {
				tempCellar[key] = this.cellar[key];
			}
		});
		this.cellar = tempCellar;
		return true;
	}
	//todo add flatwine version
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
		if (this.cellar[producer]) {
			if (i === -1) {
				const index = this.cellar[producer].findIndex((w) => w['Wine Name'] === wine['Wine Name']);
				if (index !== -1) {
					let tmp = this.cellar[producer];
					tmp[index] = wine;
					this.cellar[producer] = tmp;
					return true; // Wine updated successfully
				}
			} else {
				let tmp = this.cellar[producer];
				tmp[i] = wine;
				this.cellar[producer] = tmp;
				return true; // Wine updated successfully
			}
			console.log('producer found but wine not found');
		}
		return false; // Wine not found
	}

	//todo add flatwine version
	/**
	 * Retrieves an array of wines by the specified producer.
	 * @param producer - The name of the producer.
	 * @returns An array of wines produced by the specified producer, or undefined if no wines are found.
	 */
	getWinesByProducer(producer: string): Wine[] | undefined {
		return this.cellar[producer];
	}

	//todo add flatwine version
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
		return this.cellar;
	}

	//todo add flatwine version
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
		for (const producer in this.cellar) {
			for (const wine of this.cellar[producer]) {
				wines.push({ producer, ...wine });
			}
		}
		return wines;
	}

	//todo add flatwine version
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

		for (const producer in this.cellar) {
			producers.push({ name: producer, value: producer });
		}
		const uniqueProducers = producers.filter(
			(v, i, a) => a.findIndex((t) => t.name === v.name) === i
		);
		return uniqueProducers || [];
	}

	//todo add flatwine version
	/**
	 * Retrieve variety names formatted as {name: "variety", value: "variety"}.
	 * @returns An array of variety names.
	 */
	getVarietyNames(): { name: string; value: string }[] {
		const varieties = [];
		for (const producer in this.cellar) {
			for (const wine of this.cellar[producer]) {
				if (wine.Variety) {
					varieties.push({ name: wine.Variety, value: wine.Variety });
				}
			}
		}
		const uniqueVarieties = varieties.filter(
			(v, i, a) => a.findIndex((t) => t.name === v.name) === i
		);
		return uniqueVarieties || [];
	}

	//todo add flatwine version
	/**
	 * Retrieve vineyard names formatted as {name: "vineyard", value: "vineyard"}.
	 * @returns An array of vineyard names.
	 */
	getVineyardNames(): { name: string; value: string }[] {
		const vineyards = [];
		for (const producer in this.cellar) {
			for (const wine of this.cellar[producer]) {
				if (wine['Vineyard Location']) {
					vineyards.push({ name: wine['Vineyard Location'], value: wine['Vineyard Location'] });
				}
			}
		}
		const uniqueVineyards = vineyards.filter(
			(v, i, a) => a.findIndex((t) => t.name === v.name) === i
		);
		return uniqueVineyards || [];
	}

	//todo add flatwine version
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

	//todo add flatwine version
	/**
	 * Checks the wine cellar for a wine with the specified name and vintage.
	 * @param wineName - The name of the wine to search for.
	 * @param vintage - The vintage of the wine to search for.
	 * @returns The wine object if found, otherwise undefined.
	 */
	checkWineByNameVintage(wineName: string, vintage: number): Wine | undefined {
		for (const producer in this.cellar) {
			const wine = this.cellar[producer].find(
				(w) => w['Wine Name'] === wineName && w.Vintage === vintage
			);
			if (wine) return wine;
		}
		return undefined;
	}

	/**
	 * todo Check wine by producer, name, vineyard and variety
	 */

	//todo add flatwine version
	/**
	 * Checks the wine cellar for a wine with the specified name.
	 * @param wineName - The name of the wine to search for.
	 * @returns The wine object if found, otherwise undefined.
	 */
	checkWineByName(wineName: string): Wine | undefined {
		for (const producer in this.cellar) {
			const wine = this.cellar[producer].find((w) => w['Wine Name'] === wineName);
			if (wine) return wine;
		}
		return undefined;
	}

	//todo add flatwine version
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
	}

	//todo add flatwine version
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
		console.log(this.cellar);
	}

	//todo add flatwine version
	/**
	 * Retrieves the number of producers in the cellar.
	 * @returns The number of producers in the cellar.
	 */
	getProducerCount(): number {
		return Object.keys(this.cellar).length;
	}

	// Additional utility methods can be added as needed
}

// Example usage:
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

//console.log(myCellar.getWinesByProducer("Chateau Margaux"));
