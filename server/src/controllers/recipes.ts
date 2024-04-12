import { sequelize } from '../config/db';
import { Op } from 'sequelize';
import { Recipe } from '../models/recipe';
import { RecipeToItem } from '../models/recipeToItem';
import { NewRecipesItem, NewRecipeToItem, NewRecipe } from '../types/types';
import { parseIncredient, parseString, parseDescription, parseNumber, parseBoolean } from '../config/utils';
import { getRecipeToItemById, createRecipeToItems, deleteRecipeToItems } from '../query/recipeToItem';
import {
  getRandomRecipes, getUsersRecipes, getMostLikedRecipes, likeRecipe, removeOwnedRecipe,
  getRecipesImageUri
} from '../query/recipe';
import { removeImage } from './image';
import { Request, Response } from 'express';

export const getUsersOwnRecipes = async (req, res: Response) => {
  const userId = req.user.id;
  const { page } = req.query;
  let pageInt = parseInt(page as string);
  if (!pageInt) {
    pageInt = 0;
  }
  const recipes = await getUsersRecipes(userId, pageInt);
  const recipeCount = await Recipe.count();
  if (recipeCount > pageInt * 5) {
    res.json({ recipes, hasMore: true });
  } else {
    res.json({ recipes, hasMore: false });
  }
};

export const getIntroduceRecipes = async (req, res: Response) => {
  const { recipeIds } = req.body;
  const recipes = await getRandomRecipes(recipeIds);
  const recipeCount = await Recipe.count();
  const newRecipeIds = recipes.recipes.map((recipe) => recipe.id);
  const recipeIdsToReturn = [...recipeIds, ...newRecipeIds];
  if (recipeCount > recipeIdsToReturn.length) {
    res.json({ ...recipes, hasMore: true, recipeIds: recipeIdsToReturn });
  } else {
    res.json({ ...recipes, hasMore: false, recipeIds: recipeIdsToReturn });
  }
};

export const returnMostLikedRecipes = async (req, res: Response) => {
  const { page } = req.query;
  let pageInt = parseInt(page as string);
  if (!pageInt) {
    pageInt = 0;
  }
  const recipes = await getMostLikedRecipes(pageInt);
  const recipeCount = await Recipe.count();
  recipes.sort((a: any, b: any) => b.dataValues.like_count - a.dataValues.like_count);
  if (recipeCount > pageInt * 5) {
    res.json({ recipes, hasMore: true });
  } else {
    res.json({ recipes, hasMore: false });
  }
};

export const likeRecipeController = async (req, res: Response) => {
  const recipeId = parseInt(req.params.id);
  const userId = req.user.id;
  await likeRecipe(recipeId, userId);
  res.status(200).send('Recipe liked');
};

export const createRecipe = async (req, res: Response) => {
  const { name, description, global, incredients, imageUri } = req.body;
  const ownerId = req.user.id;
  const transaction = await sequelize.transaction();

  const parsedIncredients: NewRecipesItem[] = incredients.map((incredient: any) => {
    return parseIncredient(incredient);
  });

  const parsedName = parseString(name);
  const parsedDescription = parseDescription(description);
  const parsedOwnerId = parseNumber(ownerId);
  const parsedGlobal = parseBoolean(global);

  try {
    const recipe = await Recipe.create({
      name: parsedName,
      description: parsedDescription,
      ownerId: parsedOwnerId,
      global: parsedGlobal,
      imageUri: imageUri ? imageUri.split('.')[0] : null
    }, { transaction });

    const itemList: NewRecipeToItem[] = parsedIncredients.map(
      (item: NewRecipesItem) => {
        return {
          itemId: item.id, amount: item.amount, recipeId: recipe.id
        };
      });

    await RecipeToItem.bulkCreate(itemList, { transaction });

    await transaction.commit();
    res.status(201).send('Recipe created');

  } catch (error) {
    console.log(error);
    await transaction.rollback();
    throw new Error('Saving recipe failed');
  }
};

export const deleteRecipe = async (req, res: Response) => {
  const { id } = req.params;
  const recipeId = parseInt(id);
  const userId = req.user.id;
  if (!recipeId || !userId) {
    throw new Error('404');
  }
  const imageUri = await getRecipesImageUri(recipeId);
  if (!imageUri) {
    await removeOwnedRecipe(recipeId, userId);
  } else {
    await removeOwnedRecipe(recipeId, userId);
    await removeImage(imageUri);
  }
  res.status(204).send('Recipe deleted');
};

export const updateRecipe = async (recipe: NewRecipe, id: number, ingredients: any) => {
  const transaction = await sequelize.transaction();
  const parsedIngredients: NewRecipesItem[] = ingredients.map((incredient: any) => {
    return parseIncredient(incredient);
  });
  const recipesToItems = await getRecipeToItemById(id);
  const ingredientsToAdd = parsedIngredients.map((ingredient: NewRecipesItem) => {
    if (recipesToItems.some((item) => item.itemId !== ingredient.id)) {
      return ingredient;
    }
  });
  const ingredientsToRemove = recipesToItems.map((item: any) => {
    if (parsedIngredients.some((ingredient) => ingredient.id !== item.itemId)) {
      return item;
    }
  });
  try {
    await createRecipeToItems(ingredientsToAdd, transaction);
    await deleteRecipeToItems(ingredientsToRemove, transaction);

    await Recipe.update(recipe, {
      where: {
        id
      },
      transaction
    });
    await transaction.commit();
  } catch (error) {
    await transaction.rollback();
    throw new Error('Something went wrong');
  }
};