import { Item } from "../models";
import { NewItem, ItemCategory } from "../types";

export const items: NewItem[] = [
  {
    name: "muikut", /* 1 */
    type: ItemCategory.Fish,
    unitSize: 0.15,
    brand: "kotimaista",
    price: 1.99,
    pricePerUnit: 13.27,
  },
  {
    name: "beef steak", /* 2 */
    type: ItemCategory.Meat,
    unitSize: 0.5,
    brand: "farmfresh",
    price: 5.99,
    pricePerUnit: 11.98,
  },
  {
    name: "carrot", /* 3 */
    type: ItemCategory.Vegetable,
    unitSize: 0.2,
    brand: "greenValley",
    price: 0.99,
    pricePerUnit: 4.95,
  },
  {
    name: "black pepper", /* 4 */
    type: ItemCategory.Spice,
    unitSize: 0.05,
    brand: "spiceKing",
    price: 3.49,
    pricePerUnit: 69.8,
  },
  {
    name: "basmati rice", /* 5 */
    type: ItemCategory.Grain,
    unitSize: 1,
    brand: "eastAroma",
    price: 2.99,
    pricePerUnit: 2.99,
  },
  {
    name: "lasagna", /* 6 */
    type: ItemCategory.Premade,
    unitSize: 0.5,
    brand: "quickMeal",
    price: 4.99,
    pricePerUnit: 9.98,
  },
  {
    name: "frozen pizza", /* 7 */
    type: ItemCategory.FrozenPremade,
    unitSize: 0.4,
    brand: "frostyGood",
    price: 3.99,
    pricePerUnit: 9.975,
  },
  {
    name: "chocolate bar", /* 8 */
    type: ItemCategory.Candy,
    unitSize: 0.4,
    brand: "Fazer",
    price: 0.89,
    pricePerUnit: 12.9,
  },
  {
    name: "tomato sauce", /* 9 */
    type: ItemCategory.Sauce,
    unitSize: 0.3,
    brand: "italiano",
    price: 2.49,
    pricePerUnit: 8.3,
  },
  {
    name: "shrimp", /* 10 */
    type: ItemCategory.Seafood,
    unitSize: 0.2,
    brand: "oceanFresh",
    price: 6.99,
    pricePerUnit: 34.95,
  },
  {
    name: "cheddar cheese", /* 11 */
    type: ItemCategory.Dairy,
    unitSize: 0.25,
    brand: "dairyFarm",
    price: 3.99,
    pricePerUnit: 15.96,
  },
  {
    name: "apple", /* 12 */
    type: ItemCategory.Fruit,
    unitSize: 0.2,
    brand: "orchard",
    price: 0.69,
    pricePerUnit: 3.45,
  },
  {
    name: "flour", /* 13 */
    type: ItemCategory.Baking,
    unitSize: 1,
    brand: "bakeMaster",
    price: 1.99,
    pricePerUnit: 1.99,
  },
  {
    name: "pickles", /* 14 */
    type: ItemCategory.Other,
    unitSize: 0.3,
    brand: "crunchy",
    price: 2.99,
    pricePerUnit: 9.97,
  },
  {
    name: "salmon", /* 15 */
    type: ItemCategory.Fish,
    unitSize: 0.2,
    brand: "riverFresh",
    price: 4.99,
    pricePerUnit: 24.95,
  },
  {
    name: "pork ribs", /* 16 */
    type: ItemCategory.Meat,
    unitSize: 0.7,
    brand: "farmhouse",
    price: 7.49,
    pricePerUnit: 10.7,
  },
  {
    name: "broccoli", /* 17 */
    type: ItemCategory.Vegetable,
    unitSize: 0.25,
    brand: "greenHarvest",
    price: 1.29,
    pricePerUnit: 5.16,
  },
  {
    name: "cinnamon", /* 18 */
    type: ItemCategory.Spice,
    unitSize: 0.04,
    brand: "spiceWorld",
    price: 2.99,
    pricePerUnit: 74.75,
  },
  {
    name: "korppujauho", /* 19 */
    type: ItemCategory.Other,
    unitSize: 0.4,
    brand: "kotimaista",
    price: 1.99,
    pricePerUnit: 7.98,
  },
  /* 20 bellow */
  {
    name: "butter", /* 20 */
    type: ItemCategory.Dairy,
    unitSize: 0.25,
    brand: "kotimaista",
    price: 1.99,
    pricePerUnit: 7.96,
  },
  {
    name: "oat", /* 21 */
    type: ItemCategory.Other,
    unitSize: 1,
    brand: "kotimaista",
    price: 1.99,
    pricePerUnit: 1.99,
  },
  {
    name: "rice milk", /* 22 */
    type: ItemCategory.Other,
    unitSize: 1,
    brand: "kotimaista",
    price: 1.99,
    pricePerUnit: 1.99,
  },
  {
    name: "yeast", /* 23 */
    type: ItemCategory.Other,
    unitSize: 0.05,
    brand: "kotimaista",
    price: 0.4,
    pricePerUnit: 80,
  },
  {
    name: "salt", /* 24 */
    type: ItemCategory.Spice,
    unitSize: 0.50,
    brand: "kotimaista",
    price: 0.99,
    pricePerUnit: 1.98,
  },
  {
    name: "olive oil", /* 25 */
    type: ItemCategory.Other,
    unitSize: 0.5,
    brand: "kotimaista",
    price: 9.20,
    pricePerUnit: 18.40,
  },
  {
    name: "Greek yougurt", /* 26 */
    type: ItemCategory.Dairy,
    unitSize: 0.5,
    brand: "kotimaista",
    price: 1.32,
    pricePerUnit: 2.64,
  },
  {
    name: "almond", /* 27 */
    type: ItemCategory.Other,
    unitSize: 0.5,
    brand: "kotimaista",
    price: 2.99,
    pricePerUnit: 5.98,
  },
  {
    name: "quinoa", /* 28 */
    type: ItemCategory.Other,
    unitSize: 0.5,
    brand: "kotimaista",
    price: 3.99,
    pricePerUnit: 7.98,
  },
  {
    name: "spinach", /* 29 */
    type: ItemCategory.Vegetable,
    unitSize: 0.5,
    brand: "kotimaista",
    price: 1.99,
    pricePerUnit: 3.98,
  },
  {
    name: "fronzen blueberries", /* 30 */
    type: ItemCategory.Fruit,
    unitSize: 0.25,
    brand: "kotimaista",
    price: 2.99,
    pricePerUnit: 11.96,
  },
  {
    name: "sweet potato", /* 31 */
    type: ItemCategory.Vegetable,
    unitSize: 0.5,
    brand: "kotimaista",
    price: 1.99,
    pricePerUnit: 3.98,
  },
  {
    name: "avocado", /* 32 */
    type: ItemCategory.Fruit,
    unitSize: 0.5,
    brand: "kotimaista",
    price: 1.99,
    pricePerUnit: 3.98,
  },
  {
    name: "chia seeds", /* 33 */
    type: ItemCategory.Other,
    unitSize: 0.5,
    brand: "kotimaista",
    price: 2.99,
    pricePerUnit: 5.98,
  },
  {
    name: "tofu", /* 34 */
    type: ItemCategory.Other,
    unitSize: 0.5,
    brand: "kotimaista",
    price: 1.99,
    pricePerUnit: 3.98,
  },
  {
    name: "honey", /* 35 */
    type: ItemCategory.Other,
    unitSize: 0.5,
    brand: "kotimaista",
    price: 3.99,
    pricePerUnit: 7.98,
  },
  {
    name: "eggs", /* 36 */
    type: ItemCategory.Other,
    unitSize: 0.5,
    brand: "kotimaista",
    price: 1.99,
    pricePerUnit: 3.98,
  },
  {
    name: "spaghetti", /* 37 */
    type: ItemCategory.Other,
    unitSize: 0.5,
    brand: "barilla",
    price: 1.65,
    pricePerUnit: 3.3,
  },
  {
    name: "soy granules", /* 38 */
    type: ItemCategory.Other,
    unitSize: 0.5,
    brand: "vegesun",
    price: 2.99,
    pricePerUnit: 5.98,
  },
  {
    name: "eggplant", /* 39 */
    type: ItemCategory.Vegetable,
    unitSize: 0.5,
    brand: "kotimaista",
    price: 1.99,
    pricePerUnit: 3.98,
  },
  {
    name: "garlic", /* 40 */
    type: ItemCategory.Vegetable,
    unitSize: 0.25,
    brand: "kotimaista",
    price: 0.99,
    pricePerUnit: 3.96,
  },
  {
    name: "parmesan cheese", /* 41 */
    type: ItemCategory.Dairy,
    unitSize: 0.25,
    brand: "kotimaista",
    price: 4.99,
    pricePerUnit: 19.96,
  },
  {
    name: "mozzarella cheese", /* 42 */
    type: ItemCategory.Dairy,
    unitSize: 0.125,
    brand: "castelli",
    price: 3.25,
    pricePerUnit: 26,
  },
  {
    name: "ground beef", /* 43 */
    type: ItemCategory.Meat,
    unitSize: 0.4,
    brand: "atria",
    price: 3.99,
    pricePerUnit: 9.975,
  },
  {
    name: "sour cream", /* 44 */
    type: ItemCategory.Dairy,
    unitSize: 0.12,
    brand: "kotimaista",
    price: 1.15,
    pricePerUnit: 9.58,
  },
  {
    name: "beef strips", /* 45 */
    type: ItemCategory.Meat,
    unitSize: 0.4,
    brand: "farmhouse",
    price: 7.15,
    pricePerUnit: 17.88,
  },
  {
    name: "mushrooms", /* 46 */
    type: ItemCategory.Vegetable,
    unitSize: 0.35,
    brand: "champ",
    price: 4.59,
    pricePerUnit: 13.11,
  },
  {
    name: "onion", /* 47 */
    type: ItemCategory.Vegetable,
    unitSize: 1,
    brand: "kotimaista",
    price: 1.49,
    pricePerUnit: 1.49,
  }
];