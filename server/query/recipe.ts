import { Sequelize, Op } from 'sequelize';
import { sequelize } from '../config/db';
import { Recipe, Item, User, RecipeLike, RecipeToItem } from '../models';
import { NewRecipe } from '../types';

const recipesByIds = async (ids: number[]) => {
  return await Recipe.findAll({
    where: {
      id: ids
    },
    attributes: [
      'id',
      'name',
      'description',
      'imageUri',
      'ownerId',
      [Sequelize.fn('COUNT', Sequelize.col('liked.id')), 'like_count']
    ],
    include: [
      {
        model: Item,
        as: 'item',
        attributes: ['id', 'name', 'unitSize', 'type'],
        through: {
          attributes: ['amount']
        }
      },
      {
        model: User,
        as: 'liked',
        attributes: [],
        through: {
          attributes: [],
        }
      }
    ],
    group: ['recipe.id', 'item.id', 'item->recipeToItem.id']
  });
};

export const getRecipesImageUri = async (recipeId: number) => {
  const recipe = await Recipe.findByPk(recipeId);
  if (!recipe) {
    throw new Error('recipe not found');
  }
  return recipe.imageUri;
};

export const getRandomRecipes = async (oldIds: number[]) => {
  const randomIds = await Recipe.findAll({
    attributes: ['id'],
    order: sequelize.random(),
    limit: 5,
    where: { id: { [Op.notIn]: oldIds } }
  });
  const ids = randomIds.map((id: any) => id.id);
  const recipes = await recipesByIds(ids);
  return { recipes, recipeIds: [...oldIds, ...ids] };
};

export const getMostLikedRecipes = async (page: number) => {
  const offsetValue = (page - 1) * 5;

  const mostLikedRecipes = await Recipe.findAll({
    attributes: [
      'id',
      [Sequelize.literal(`(
        SELECT COUNT(*)
        FROM "recipeLikes" AS rl
        WHERE rl."recipeId" = recipe.id
      )`), 'like_count']
    ],
    order: [[Sequelize.literal('like_count'), 'DESC'], ['id', 'ASC']],
    limit: 5,
    offset: offsetValue
  });

  const ids = mostLikedRecipes.map(recipe => recipe.id);
  const mostLikedRecipesById = await recipesByIds(ids);
  const sortedRecipes = mostLikedRecipesById.sort((a: any, b: any) => b.dataValues.like_count - a.dataValues.like_count);
  return sortedRecipes;
};

export const getUsersRecipes = async (userId: number, page: number) => {
  const ownedRecipes = await Recipe.findAll({
    attributes: ['id'],
    where: {
      ownerId: userId
    },
    limit: 5,
    offset: (page - 1) * 5,
    order: [['id', 'ASC']]
  });
  const ids = ownedRecipes.map(recipe => recipe.id);
  return await recipesByIds(ids);
};

export const likeRecipe = async (recipeId: number, userId: number) => {
  const recipe = await Recipe.findByPk(recipeId);
  const user = await User.findByPk(userId);
  if (!recipe || !user) {
    throw new Error('recipe or user not found');
  }
  const recipeLike = await RecipeLike.findOne({
    where: {
      recipeId: recipeId,
      userId: userId
    }
  });

  if (recipeLike) {
    await recipeLike.destroy();
    return { liked: false };
  } else {
    await RecipeLike.create({
      recipeId: recipeId,
      userId: userId
    });
    return { liked: true };
  }
};

export const createRecipe = async (recipe: NewRecipe) => {
  return await Recipe.create(recipe);
};

export const removeOwnedRecipe = async (recipeId: number, userId: number) => {
  const transaction = await sequelize.transaction();
  try {
    const recipe = await Recipe.findByPk(recipeId);
    if (!recipe) {
      throw new Error('404');
    }
    if (recipe.ownerId !== userId) {
      throw new Error('401');
    }
    await RecipeToItem.destroy({ where: { recipeId: recipeId } });
    await RecipeLike.destroy({ where: { recipeId: recipeId } });
    await recipe.destroy();
    await transaction.commit();
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};