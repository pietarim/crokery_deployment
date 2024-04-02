import axios from 'axios';
import { Recipe } from '../types';

type RecipeToSave = Omit<Recipe, 'id' | 'ownerId'>;

export const getRandomRecipes = async () => {
  const response = await axios.get('http://localhost:3001/api/recipes');
  return response.data;
};

export const createRecipe = async (recipe: RecipeToSave): Promise<Recipe> => {
  const response = await axios.post('http://localhost:3001/api/recipes', recipe);
  return response.data;
};