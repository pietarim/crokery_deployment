import { Sequelize } from 'sequelize';
import { sequelize } from '../config/db';
import { Recipe, Item, User } from '../models';
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
    group: ['recipe.id', 'item.id', 'item->recipeToItem.id'],
  });
};

export const getRandomRecipes = async () => {
  const randomIds = await Recipe.findAll({
    attributes: ['id'],
    order: sequelize.random(),
    limit: 5
  });
  const ids = randomIds.map((id: any) => id.id);
  return await recipesByIds(ids);
  /* return await Recipe.findAll({
    where: {
      name: nameArr
    },
    attributes: [
      'id',
      'name',
      'description',
      'imageUri',
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
    group: ['recipe.id', 'item.id', 'item->recipeToItem.id'],
    order: sequelize.random()
  }); */
};

export const getMostLikedRecipes = async () => {
  const mostLikedRecipeIds = await Recipe.findAll({
    order: [['liked', 'DESC']],
    attributes: ['id'],
    limit: 5
  });
  const ids = mostLikedRecipeIds.map((id: any) => id.id);
  return await recipesByIds(ids);
  /* return await Recipe.findAll({
    where: {
      id: ids
    },
    attributes: [
      'id',
      'name',
      'description',
      'imageUri',
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
    group: ['recipe.id', 'item.id', 'item->recipeToItem.id'],
    order: sequelize.random()
  }); */
};


/* export const getMostLikedRecipes = async () => {
  const randomNames = await Recipe.findAll({
    order: [['liked', 'DESC']],
    attributes: ['name'],
    limit: 10
  });
  const nameArr = randomNames.map((name: any) => name.name);
  return await Recipe.findAll({
    where: {
      name: nameArr
    },
    attributes: [
      'id',
      'name',
      'description',
      'imageUri',
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
    group: ['recipe.id', 'item.id', 'item->recipeToItem.id'],
  });
}; */

export const getUsersRecipes = async (userId: number) => {
  return await Recipe.findAll({
    where: {
      ownerId: userId
    }
  });
};

export const createRecipe = async (recipe: NewRecipe) => {
  return await Recipe.create(recipe);
};