import { myWineCellarFlat } from '$lib/ClassStores';
import InventoryMgmt from '$lib/InventoryMgmt.svelte';
import WineCellarFlat from '$lib/WineCellarFlat';
import { testNewStore } from '$lib/store';
import type { WineFlat } from '$lib/types';
import { fireEvent, render } from '@testing-library/svelte';
import 'vitest-dom/extend-expect';
describe('WineCellar', () => {
	let index: number;
	let wineFlat: WineFlat;
	let wineFlat2: WineFlat;
	let currentWineCellarFlat: WineCellarFlat = new WineCellarFlat();
	let testWineFlat: WineFlat;
	let unsub: () => void;
	let unsubscribe: () => void;
	let itemIndex: number;

	beforeEach(() => {
		testWineFlat = {} as WineFlat;
		currentWineCellarFlat = new WineCellarFlat();

		wineFlat = {
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
		};

		wineFlat2 = {
			Producer: 'Becker Vineyards',
			'Wine Name': 'Claret',
			'Vineyard Location': 'Texas Hill Country',
			Variety: 'Merlot',
			Inventory: [
				{
					Vintage: 2017,
					Bin: 'A2',
					Qty: 5,
					Purchased: '2020-01-01'
				},
				{
					Vintage: 2018,
					Bin: 'A2',
					Qty: 5,
					Purchased: '2020-01-01'
				}
			],
			Notes: 'Good value'
		};
		index = 0;
		itemIndex = 0;
		myWineCellarFlat.set(new WineCellarFlat());
		myWineCellarFlat.update((value) => {
			value.updateWineFlat(0, wineFlat);
			value.updateWineFlat(0, wineFlat2);
			value.updateWineFlat(1, wineFlat2);
			return value;
		});
		testNewStore.set({
			'Wine Name': 'Default Wine Name',
			Producer: 'Default Producer',
			'Vineyard Location': 'Default Vineyard Location',
			Variety: 'Default Variety',
			Inventory: [
				{
					Vintage: 2020,
					Bin: 'Default Bin',
					Qty: 0,
					Purchased: '2020-01-01'
				}
			],
			Notes: 'Default Notes'
		});

		unsub = testNewStore.subscribe((value) => {
			testWineFlat = value;
		});
		unsubscribe = myWineCellarFlat.subscribe((value) => {
			currentWineCellarFlat = value;
		});
	});

	test('should increase quantity when + button is clicked', async () => {
		const { getByText } = render(InventoryMgmt, {
			props: {
				producer: wineFlat.Producer,
				wineFlat,
				wine: WineCellarFlat.convertWineFlatToWine(wineFlat),
				index
			}
		});
		expect(testWineFlat).toMatchInlineSnapshot(`
			{
			  "Inventory": [
			    {},
			  ],
			  "Notes": "Default Notes",
			  "Producer": "Default Producer",
			  "Variety": "Default Variety",
			  "Vineyard Location": "Default Vineyard Location",
			  "Wine Name": "Default Wine Name",
			}
		`);
		expect(currentWineCellarFlat).toMatchInlineSnapshot(`
			WineCellarFlat {
			  "cellar": {},
			  "cellarFlat": [
			    {
			      "Inventory": [
			        {},
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
			          "Bin": "A2",
			          "Purchased": "2020-01-01",
			          "Qty": 5,
			          "Vintage": 2017,
			        },
			        {
			          "Bin": "A2",
			          "Purchased": "2020-01-01",
			          "Qty": 5,
			          "Vintage": 2018,
			        },
			      ],
			      "Notes": "Good value",
			      "Producer": "Becker Vineyards",
			      "Variety": "Merlot",
			      "Vineyard Location": "Texas Hill Country",
			      "Wine Name": "Claret",
			    },
			  ],
			  "currentSearchParams": {
			    "Bin": {
			      "isActive": false,
			      "value": "",
			    },
			    "Notes": {
			      "isActive": false,
			      "value": "",
			    },
			    "Producer": {
			      "isActive": false,
			      "value": "",
			    },
			    "Purchased": {
			      "isActive": false,
			      "value": "",
			    },
			    "Qty": {
			      "isActive": false,
			      "value": "",
			    },
			    "SearchTerm": {
			      "isActive": false,
			      "value": "",
			    },
			    "Variety": {
			      "isActive": false,
			      "value": "",
			    },
			    "Vineyard Location": {
			      "isActive": false,
			      "value": "",
			    },
			    "Vintage": {
			      "isActive": false,
			      "value": "",
			    },
			  },
			  "defaultWineFlat": {
			    "Inventory": [
			      {
			        "Bin": "Default Bin",
			        "Purchased": "2020-01-01",
			        "Qty": 0,
			        "Vintage": 2020,
			      },
			    ],
			    "Notes": "Default Notes",
			    "Producer": "Default Producer",
			    "Variety": "Default Variety",
			    "Vineyard Location": "Default Vineyard Location",
			    "Wine Name": "Default Wine Name",
			  },
			  "filteredCellarFlat": [
			    {
			      "Inventory": [
			        {},
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
			          "Bin": "A2",
			          "Purchased": "2020-01-01",
			          "Qty": 5,
			          "Vintage": 2017,
			        },
			        {
			          "Bin": "A2",
			          "Purchased": "2020-01-01",
			          "Qty": 5,
			          "Vintage": 2018,
			        },
			      ],
			      "Notes": "Good value",
			      "Producer": "Becker Vineyards",
			      "Variety": "Merlot",
			      "Vineyard Location": "Texas Hill Country",
			      "Wine Name": "Claret",
			    },
			  ],
			  "testStoredWineFlat": {
			    "Inventory": [
			      {
			        "Bin": "A2",
			        "Purchased": "2020-01-01",
			        "Qty": 5,
			        "Vintage": 2017,
			      },
			      {
			        "Bin": "A2",
			        "Purchased": "2020-01-01",
			        "Qty": 5,
			        "Vintage": 2018,
			      },
			    ],
			    "Notes": "Good value",
			    "Producer": "Becker Vineyards",
			    "Variety": "Merlot",
			    "Vineyard Location": "Texas Hill Country",
			    "Wine Name": "Claret",
			  },
			  "unsubscribe": [Function],
			}
		`);

		expect(
			currentWineCellarFlat.checkWineByNameVintageFlat(
				wineFlat['Wine Name'],
				wineFlat.Inventory[index].Vintage
			)
		).toMatchInlineSnapshot(`
			{
			  "Inventory": [
			    {},
			  ],
			  "Notes": "Excellent vintage",
			  "Producer": "Chateau Margaux",
			  "Variety": "Cabernet Sauvignon",
			  "Vineyard Location": "Bordeaux, France",
			  "Wine Name": "Margaux 2015",
			}
		`);

		const plusButton = getByText('+');
		expect(wineFlat['Inventory'][index].Qty).toBe(10);

		await fireEvent.click(plusButton);

		// Insert this code where you want the delay
		await new Promise((r) => setTimeout(r, 2000)); // 2000 ms delay

		expect(wineFlat).toMatchInlineSnapshot(`
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
		// Check the updated quantity in the wineFlat object
		expect(wineFlat['Inventory'][index].Qty).toBe(11);

		// Check the displayed quantity
		// Replace '11' with the actual text that's displayed in your component
		const displayedQty = getByText('11');
		expect(displayedQty).toBeInTheDocument();
	});
});
