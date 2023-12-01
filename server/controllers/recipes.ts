import { sequelize } from '../config/db';
import { Op } from 'sequelize';
import { Recipe } from '../models/recipe';
import { RecipeToItem } from '../models/recipeToItem';
import { Item } from '../models/';
import { ItemCategory, NewRecipesItem, NewRecipeToItem, NewRecipe } from '../types';
import { parseIncredient, parseString, parseDescription, parseNumber, parseBoolean } from '../config/utils';
import { getRecipeToItemById, createRecipeToItems, deleteRecipeToItems } from '../query/recipeToItem';
import { getRandomRecipes, getUsersRecipes, getMostLikedRecipes } from '../query/recipe';

export const getUsersOwnRecipes = async (req: any, res: any) => {
  const { userId } = req.body;
  const recipes = await getUsersRecipes(userId);
  res.send(recipes);
};

export const getIntroduceRecipes = async (req: any, res: any) => {
  const recipes = await getRandomRecipes();
  res.json(recipes);
};

export const returnMostLikedRecipes = async (req: any, res: any) => {
  const recipes = await getMostLikedRecipes();
  res.json(recipes);
};

export const createRecipe = async (req: any, res: any) => {
  const { name, description, global, incredients } = req.body;
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
      global: parsedGlobal
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
    res.status(500).send('Something went wrong');
  }
};

export const deleteRecipe = async (id: string, userId: number) => {

  const recipe = await Recipe.findOne({
    where: {
      id, ownerId: userId
    }
  });

  if (!recipe) {
    throw new Error('401');
  }

  await Recipe.destroy({
    where: {
      id
    }
  });
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