export enum ItemCategory {
  Meat = 'meat',
  Vegetable = 'vegetable',
  Fruit = 'fruit',
  Dairy = 'dairy',
  Grain = 'grain',
  Other = 'other',
  Spice = 'spice',
  Premade = 'premade',
  FrozenPremade = 'frozen_premade',
  Candy = 'candy',
  Sauce = 'sauce',
  Fish = 'fish',
  Seafood = 'seafood',
  Baking = 'baking',
  Ice_cream = 'ice cream',
  Frozen_prem = 'frozen_prem'
}

export interface NewRecipesItem {
  name: string;
  ammount: number;
  id: number;
}

export interface NewRecipeToItem {
  recipeId: number;
  itemId: number;
  ammount: number;
}

export interface NewItem {
  name: string;
  type: ItemCategory;
  unitSize: number;
  brand: string;
  price: number;
  pricePerUnit: number;
}

export interface NewRecipe {
  name: string;
  description: string;
  ownerId: number;
  global: boolean;
  imageUri?: string;
}