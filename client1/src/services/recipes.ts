import axios from 'axios';
import { Recipe, RecipeToSave } from '../types';
import { useAxios } from '../hooks/useAxios';

export const getRandomRecipes = async () => {
  const response = await axios.get('http://localhost:3001/api/recipes');
  return response.data;
};

export const createRecipe = async (recipe: RecipeToSave): Promise<Recipe> => {
  const { post } = useAxios();
  const response = await useAxios.post('http://localhost:3001/api/recipes', recipe);
  return response.data;
};