import { Item } from './item';
import { Recipe } from './recipe';
import { RecipeToItem } from './recipeToItem';
import { User } from './user';
import { RecipeLike } from './recipeLike';
import { Friend } from './friend';

Recipe.belongsTo(User, { foreignKey: 'ownerId' });
User.hasMany(Recipe, { foreignKey: 'ownerId' });
Item.belongsToMany(Recipe, { through: RecipeToItem, as: 'included' });
Recipe.belongsToMany(Item, { through: RecipeToItem, as: 'item' });
Recipe.belongsToMany(User, { through: RecipeLike, as: 'liked' });
User.belongsToMany(Recipe, { through: RecipeLike, as: 'liked' });
User.hasMany(RecipeLike, { foreignKey: 'userId' });
RecipeLike.belongsTo(User, { foreignKey: 'userId' });
User.belongsToMany(User, { through: Friend, as: 'friends', foreignKey: 'user_id1', otherKey: 'user_id2' });
User.belongsToMany(User, { through: Friend, as: 'friendsReverse', foreignKey: 'user_id2', otherKey: 'user_id1' });
// In your Recipe model file
Recipe.hasMany(RecipeLike, { foreignKey: 'recipeId', as: 'recipeLikes' });

// In your RecipeLike model file
RecipeLike.belongsTo(Recipe, { foreignKey: 'recipeId' });

export { Item, Recipe, RecipeToItem, User, RecipeLike };