import { RecipeToItem } from "../models";
import { Op } from 'sequelize';

export const getRecipeToItemById = async (id: number) => {
  const recipeToItem = await RecipeToItem.findAll({
    where: {
      recipeId: id
    }
  });
  return recipeToItem;
};

export const createRecipeToItem = async (recipeToItem: any) => {
  const savedRecipeToItem = await RecipeToItem.create(recipeToItem);
  return savedRecipeToItem;
};

export const createRecipeToItems = async (recipeToItems: any, transaction: any) => {
  const savedRecipeToItems = await RecipeToItem.bulkCreate(recipeToItems, { transaction });
  return savedRecipeToItems;
};

export const deleteRecipeToItems = async (ids: number[], transaction: any) => {
  await RecipeToItem.destroy({
    where: {
      id: {
        [Op.in]: ids
      }
    }, transaction
  }
  );
};