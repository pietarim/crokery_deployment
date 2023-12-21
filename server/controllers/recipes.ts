import { sequelize } from '../config/db';
import { Op } from 'sequelize';
import { Recipe } from '../models/recipe';
import { RecipeToItem } from '../models/recipeToItem';
import { NewRecipesItem, NewRecipeToItem, NewRecipe } from '../types';
import { parseIncredient, parseString, parseDescription, parseNumber, parseBoolean } from '../config/utils';
import { getRecipeToItemById, createRecipeToItems, deleteRecipeToItems } from '../query/recipeToItem';
import {
  getRandomRecipes, getUsersRecipes, getMostLikedRecipes, likeRecipe, removeOwnedRecipe,
  getRecipesImageUri
} from '../query/recipe';
import { removeImage } from './image';

export const getUsersOwnRecipes = async (req: any, res: any) => {
  console.log('getUsersOwnRecipes');
  const userId = req.user.id;
  const page = parseInt(req.query.page);
  const recipes = await getUsersRecipes(userId, page);
  const recipeCount = await Recipe.count();
  if (recipeCount > page * 5) {
    console.log('getUsersOwnRecipes hasMore true');
    res.json({ recipes, hasMore: true });
  } else {
    console.log('getUsersOwnRecipes hasMore false');
    res.json({ recipes, hasMore: false });
  }
};

export const getIntroduceRecipes = async (req: any, res: any) => {
  console.log('getIntroduceRecipes');
  const { recipeIds } = req.body;
  const idArray = recipeIds ? recipeIds : [];
  const recipes = await getRandomRecipes(idArray);
  const recipeCount = await Recipe.count();
  const newRecipeIds = recipes.recipes.map((recipe: any) => recipe.id);
  const recipeIdsToReturn = [...idArray, ...newRecipeIds];
  if (recipeCount > recipeIdsToReturn.length) {
    console.log('getIntroduceRecipes hasMore true');
    res.json({ ...recipes, hasMore: true, recipeIds: recipeIdsToReturn });
  } else {
    console.log('getIntroduceRecipes hasMore false');
    res.json({ ...recipes, hasMore: false, recipeIds: recipeIdsToReturn });
  }
};

export const returnMostLikedRecipes = async (req: any, res: any) => {
  const page = parseInt(req.query.page);
  const recipes = await getMostLikedRecipes(page);
  const recipeCount = await Recipe.count();
  recipes.sort((a: any, b: any) => b.dataValues.like_count - a.dataValues.like_count);
  if (recipeCount > page * 5) {
    console.log('returnMostLikedRecipes hasMore true');
    res.json({ recipes, hasMore: true });
  } else {
    console.log('returnMostLikedRecipes hasMore false');
    res.json({ recipes, hasMore: false });
  }
};

export const likeRecipeController = async (req: any, res: any) => {
  console.log('likeRecipeController');
  const recipeId = req.params.id;
  const userId = req.user.id;
  return await likeRecipe(recipeId, userId);
};

export const createRecipe = async (req: any, res: any) => {
  const { name, description, global, incredients, imageUri } = req.body;
  console.log(111111);
  console.log(req.body);
  console.log(111111);
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
      imageUri: imageUri.split('.')[0]
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
    /* res.status(500).send('Something went wrong'); */
  }
};

export const deleteRecipe = async (req: any, res: any) => {
  const { id } = req.params;
  const recipeId = parseInt(id);
  console.log(recipeId, " recipeId");
  const userId = req.user.id;
  if (!recipeId || !userId) {
    throw new Error('404');
  }
  const imageUri = await getRecipesImageUri(recipeId);
  if (!imageUri) {
    throw new Error('404');
  }
  await removeOwnedRecipe(recipeId, userId);
  await removeImage(imageUri);
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

    /* const recipeToItemToRemove = recipesToItems.filter((item: any) => item.itemId !== incredients.id);
    const recipeToItemToAdd = incredients.filter((item: any) => item.id !== ); */

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