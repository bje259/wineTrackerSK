/**
 * The Wine interface represents a wine.
 * @property {string} "Wine Name" - The name of the wine.
 * @property {string} "Vineyard Location" (Optional) - The producer of the wine.
 * @property {string} Variety - (Optional) The variety of the wine.
 * @property {number} Vintage - (Optional) The vintage of the wine.
 * @property {string} Bin - (Optional) The bin where the wine is stored.
 * @property {number} Qty - The quantity of the wine.
 * @property {string} Purchased - (Optional) The date when the wine was purchased.
 * @property {string} Notes - (Optional) Any notes about the wine.
 * The Wine interface is used by the WineCellar class.
 * @see WineCellar
 * @example
 * const myWine: Wine = {
 * 	"Wine Name": "Margaux 2015",
 * 	"Vineyard Location": "Bordeaux, France",
 * 	Variety: "Cabernet Sauvignon",
 * 	Vintage: 2015,
 * 	Bin: "A1",
 * 	Qty: 10,
 * 	Purchased: "2020-01-01",
 * 	Notes: "Excellent vintage"
 * };
 * console.log(myWine);
 * // Output:
 * // {
 * // 	"Wine Name": "Margaux 2015",
 * // 	"Vineyard Location": "Bordeaux, France",
 * // 	Variety: "Cabernet Sauvignon",
 * // 	Vintage: 2015,
 * // 	Bin: "A1",
 * // 	Qty: 10,
 * // 	Purchased: "2020-01-01",
 * // 	Notes: "Excellent vintage"
 * // }
 */
export interface Wine {
	"Wine Name": string;
	"Vineyard Location"?: string;
	Variety?: string;
	Vintage: number;
	Bin?: string;
	Qty: number;
	Purchased?: string;
	Notes?: string;
}
/**
 * Cellar interface represents a wine cellar.
 * The key is the name of the producer and the value is an array of Wine objects.
 * @property {string} producer - The name of the producer.
 * @property {Wine[]} wines - An array of Wine objects.
 * Reminder: Wine has these properties:
 * @property {string} "Wine Name" - The name of the wine.
 * @property {string} "Vineyard Location" (Optional) - The producer of the wine.
 * @property {string} Variety - (Optional) The variety of the wine.
 * @property {number} Vintage - (Optional) The vintage of the wine.
 * @property {string} Bin - (Optional) The bin where the wine is stored.
 * @property {number} Qty - The quantity of the wine.
 * @property {string} Purchased - (Optional) The date when the wine was purchased.
 * @property {string} Notes - (Optional) Any notes about the wine.
 * This structure allows for efficient lookup and manipulation of wines in the cellar.
 * The Cellar interface is used by the WineCellar class.
 * @see WineCellar
 */
export interface Cellar {
	[Producer: string]: Wine[];
}

export type CellarFlat = WineFlat[];

export interface WineFlat {
	Producer: string;
	'Wine Name': string;
	'Vineyard Location'?: string;
	Variety?: string;
	Inventory: InvItem[];
	Notes?: string;
}

export interface InvItem {
	Vintage: number;
	Bin: string;
	Purchased?: string;
	Qty: number;
}