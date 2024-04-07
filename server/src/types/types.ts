import { ItemCategory } from "../models";
import { Request } from "express";

export { ItemCategory };

export interface TokenUser {
  id: number;
  username: string;
  email: string;
}

export interface RequestWithUser extends Request {
  user: TokenUser;
}

export interface NewRecipesItem {
  name: string;
  amount: string;
  id: number;
}

export interface NewRecipeToItem {
  recipeId: number;
  itemId: number;
  amount: string;
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

export interface UserType {
  username: string;
  email: string;
  passwordHash: string;
  isAdmin: boolean;
}

export interface NewUser {
  username: string;
  email: string;
  password: string;
  isAdmin: boolean;
}