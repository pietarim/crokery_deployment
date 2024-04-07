import { Sequelize } from 'sequelize';
import { Model, DataTypes } from "sequelize";
import { User, Recipe, RecipeToItem, Item, RecipeLike } from "../src/models/index";
import { Umzug, SequelizeStorage } from 'umzug';
import { users } from './users';
import { items } from './items';
import { descriptions } from './recipeDescriptions';
import { Friend } from '../src/models/friend';
import { createUser } from '../src/controllers/user';
import { TokenUser } from '../src/types/types';

const sequelize = new Sequelize('postgres://postgres:mysecretpassword@localhost:5432/postgres');

const migrationConf = {
  migrations: {
    glob: 'migrations/*.ts',
  },
  storage: new SequelizeStorage({ sequelize, tableName: 'migrations' }),
  context: sequelize.getQueryInterface(),
  logger: console,
};

const runMigrations = async () => {
  const migrator = new Umzug(migrationConf);
  const migrations = await migrator.up();
  console.log('Migrations up to date', {
    files: migrations.map((mig) => mig.name),
  });
};

const connectToDatabase = async () => {
  console.log('connecting to the database');
  try {
    await sequelize.authenticate();
    console.log('connected to the database');
    await runMigrations();
  } catch (err) {
    console.log(err);
    return process.exit(1);
  }

  return null;
};

const main = async () => {
  try {
    await sequelize.authenticate();
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

main();

const init = async () => {
  await RecipeLike.destroy({
    where: {
    },
    truncate: true
  });
  await RecipeToItem.destroy({
    where: {
    },
    truncate: true
  });
  await Friend.destroy({
    where: {
    },
    truncate: true
  });
  await Recipe.destroy({
    where: {
    }
  });
  await Item.destroy({
    where: {
    }
  });
  await User.destroy({
    where: {
    }
  });

  const allUsersPromise: Promise<TokenUser[]> = Promise.all(users.map(async (user) => {
    return await createUser(user);
  }));

  const allUsers = await allUsersPromise;

  await Friend.create({ user_id1: allUsers[0].id, user_id2: allUsers[1].id });
  await Friend.create({ user_id1: allUsers[0].id, user_id2: allUsers[2].id });
  await Friend.create({ user_id1: allUsers[0].id, user_id2: allUsers[3].id });
  await Friend.create({ user_id1: allUsers[2].id, user_id2: allUsers[4].id });

  const allItems = await Item.bulkCreate(items);

  const muikutRecipe = await Recipe.create({ /* 1 */
    name: "muikut",
    description: descriptions.muikut,
    ownerId: allUsers[1].id,
    global: true,
    imageUri: "muikut_voissa_paistettuna"
  });

  await RecipeToItem.create({
    recipeId: muikutRecipe.id,
    itemId: allItems[1 - 1].id,
    amount: "1",
  });

  await RecipeToItem.create({ /* breadcrumbs */
    recipeId: muikutRecipe.id,
    itemId: allItems[19 - 1].id,
    amount: "0.1",
  });

  await RecipeToItem.create({ /* butter */
    recipeId: muikutRecipe.id,
    itemId: allItems[20 - 1].id,
    amount: "0.1",
  });

  const poridgeRecipe = await Recipe.create({ /* 2 */
    name: "puuro",
    description: descriptions.puuro,
    ownerId: allUsers[1].id,
    global: true,
    imageUri: "poridge_for_recipe"
  });

  await RecipeToItem.create({ /* butter */
    recipeId: poridgeRecipe.id,
    itemId: allItems[20 - 1].id,
    amount: "0.1",
  });

  await RecipeToItem.create({ /* oat */
    recipeId: poridgeRecipe.id,
    itemId: allItems[21 - 1].id,
    amount: "0.1",
  });

  await RecipeToItem.create({ /* rice milk */
    recipeId: poridgeRecipe.id,
    itemId: allItems[22 - 1].id,
    amount: "0.1",
  });

  const ribMeal = await Recipe.create({ /* 3 */
    name: "ribs",
    description: descriptions.ribs,
    ownerId: allUsers[2].id,
    global: true,
    imageUri: "ribs"
  });

  await RecipeToItem.create({ /* pork ribs */
    recipeId: ribMeal.id,
    itemId: allItems[16 - 1].id,
    amount: "0.3",
  });

  await RecipeToItem.create({ /* brocoli */
    recipeId: ribMeal.id,
    itemId: allItems[17 - 1].id,
    amount: "0.2",
  });

  await RecipeToItem.create({ /* carrot */
    recipeId: ribMeal.id,
    itemId: allItems[3 - 1].id,
    amount: "0.1",
  });

  await RecipeToItem.create({ /* black pepper */
    recipeId: ribMeal.id,
    itemId: allItems[4 - 1].id,
    amount: "0.02",
  });

  await RecipeToItem.create({ /* basmati rice */
    recipeId: ribMeal.id,
    itemId: allItems[5 - 1].id,
    amount: "0.3",
  });

  const preMadeLasagna = await Recipe.create({ /* 4 */
    name: "Premade lasagna",
    description: descriptions.preMadeLasagna,
    ownerId: allUsers[3].id,
    global: false,
    imageUri: "lasagna"
  });

  await RecipeToItem.create({
    recipeId: preMadeLasagna.id,
    itemId: allItems[6 - 1].id,
    amount: "0.5",
  });

  const bread = await Recipe.create({ /* 5 */
    name: "bread",
    description: descriptions.bread,
    ownerId: allUsers[4].id,
    global: true,
    imageUri: "bread"
  });

  await RecipeToItem.create({ /* yeast */
    itemId: allItems[23 - 1].id,
    recipeId: bread.id,
    amount: "0.2",
  });

  await RecipeToItem.create({ /* salt */
    itemId: allItems[24 - 1].id,
    recipeId: bread.id,
    amount: "0.2",
  });

  await RecipeToItem.create({ /* flour */
    itemId: allItems[13 - 1].id,
    recipeId: bread.id,
    amount: "0.4",
  });

  await RecipeToItem.create({ /* olive oil */
    itemId: allItems[25 - 1].id,
    recipeId: bread.id,
    amount: "0.1",
  });

  const chocolateBar = await Recipe.create({ /* 6 */
    name: "chocolateBar",
    description: descriptions.chocolateBar,
    ownerId: allUsers[1].id,
    global: true,
    imageUri: "chocolate_bar"
  });

  await RecipeToItem.create({ /* chocolate bar */
    itemId: allItems[8 - 1].id,
    recipeId: chocolateBar.id,
    amount: "0.4",
  });

  const salmon = await Recipe.create({ /* 7 */
    name: "salmon",
    description: descriptions.salmon,
    ownerId: allUsers[2].id,
    global: true,
    imageUri: "salmon_with_rice"
  });

  await RecipeToItem.create({ /* salmon */
    itemId: allItems[15 - 1].id,
    recipeId: salmon.id,
    amount: "1",
  });

  await RecipeToItem.create({ /* basmati rice */
    itemId: allItems[5 - 1].id,
    recipeId: salmon.id,
    amount: "0.1",
  });


  await RecipeLike.create({
    userId: allUsers[1].id,
    recipeId: muikutRecipe.id,
  });

  await RecipeLike.create({
    userId: allUsers[2].id,
    recipeId: muikutRecipe.id,
  });

  await RecipeLike.create({
    userId: allUsers[3].id,
    recipeId: muikutRecipe.id,
  });

  await RecipeLike.create({
    userId: allUsers[1].id,
    recipeId: bread.id,
  });

  await RecipeLike.create({
    userId: allUsers[2].id,
    recipeId: bread.id,
  });

  const vegeBolognese = await Recipe.create({ /* 8 */
    name: "Vegetable bolognese",
    description: descriptions.vegeBolognese,
    ownerId: allUsers[3].id,
    global: true,
    imageUri: "vegetable_bolognese"
  });

  await RecipeToItem.create({ /* soy granules */
    itemId: allItems[38 - 1].id,
    recipeId: vegeBolognese.id,
    amount: "0.2",
  });

  await RecipeToItem.create({ /* tomato sauce */
    itemId: allItems[9 - 1].id,
    recipeId: vegeBolognese.id,
    amount: "0.3"
  });

  await RecipeToItem.create({ /* spaghetti */
    itemId: allItems[37 - 1].id,
    recipeId: vegeBolognese.id,
    amount: "0.2"
  });

  await RecipeToItem.create({ /* garlic */
    itemId: allItems[40 - 1].id,
    recipeId: vegeBolognese.id,
    amount: "0.05"
  });

  const eggplantParmesan = await Recipe.create({ /* 9 */
    name: "Eggplant parmesan",
    description: descriptions.eggplant_parmesan,
    ownerId: allUsers[2].id,
    global: true,
    imageUri: "eggplant_parmesan"
  });

  await RecipeToItem.create({ /* eggplant */
    itemId: allItems[39 - 1].id,
    recipeId: eggplantParmesan.id,
    amount: "0.2",
  });

  await RecipeToItem.create({ /* parmesan_cheese */
    itemId: allItems[41 - 1].id,
    recipeId: eggplantParmesan.id,
    amount: "0.25",
  });

  await RecipeToItem.create({ /* flour */
    itemId: allItems[13 - 1].id,
    recipeId: eggplantParmesan.id,
    amount: "0.2",
  });

  await RecipeToItem.create({ /* mozzarella_cheese */
    itemId: allItems[42 - 1].id,
    recipeId: eggplantParmesan.id,
    amount: "0.125",
  });

  await RecipeToItem.create({ /* basmati rice */
    itemId: allItems[5 - 1].id,
    recipeId: eggplantParmesan.id,
    amount: "0.1",
  });

  const spaghettiBolognese = await Recipe.create({ /* 10 */
    name: "Spaghetti bolognese",
    description: descriptions.spaghetti_bolognese,
    ownerId: allUsers[1].id,
    global: true,
    imageUri: "spaghetti_bolognese"
  });

  await RecipeToItem.create({ /* tomato sauce */
    itemId: allItems[9 - 1].id,
    recipeId: spaghettiBolognese.id,
    amount: "0.3",
  });

  await RecipeToItem.create({ /* ground beef */
    itemId: allItems[43 - 1].id,
    recipeId: spaghettiBolognese.id,
    amount: "0.4",
  });

  await RecipeToItem.create({ /* spaghetti */
    itemId: allItems[37 - 1].id,
    recipeId: spaghettiBolognese.id,
    amount: "0.2",
  });

  await RecipeToItem.create({ /* garlic */
    itemId: allItems[40 - 1].id,
    recipeId: spaghettiBolognese.id,
    amount: "0.05",
  });

  const beefStroganoff = await Recipe.create({ /* 11 */
    name: "Beef stroganoff",
    description: descriptions.beef_stroganoff,
    ownerId: allUsers[3].id,
    global: true,
    imageUri: "beef_stroganoff"
  });

  await RecipeToItem.create({ /* beef strips */
    itemId: allItems[45 - 1].id,
    recipeId: beefStroganoff.id,
    amount: "0.4",
  });

  await RecipeToItem.create({ /* sour cream */
    itemId: allItems[44 - 1].id,
    recipeId: beefStroganoff.id,
    amount: "0.12",
  });

  await RecipeToItem.create({ /* basmati rice */
    itemId: allItems[5 - 1].id,
    recipeId: beefStroganoff.id,
    amount: "0.2",
  });

  await RecipeToItem.create({ /* mushrooms */
    itemId: allItems[46 - 1].id,
    recipeId: beefStroganoff.id,
    amount: "0.35",
  });

  await RecipeToItem.create({ /* garlic */
    itemId: allItems[40 - 1].id,
    recipeId: beefStroganoff.id,
    amount: "0.05",
  });

  await RecipeToItem.create({ /* onion */
    itemId: allItems[47 - 1].id,
    recipeId: beefStroganoff.id,
    amount: "0.25",
  });

};

const connectAndinit = async () => {
  try {
    await connectToDatabase();
    await init();
  } catch (error) {
    console.log(error);
  }
};
connectAndinit();