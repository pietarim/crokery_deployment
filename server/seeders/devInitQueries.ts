import { Sequelize } from 'sequelize';
import { Model, DataTypes } from "sequelize";
import { User, Recipe, RecipeToItem, Item, RecipeLike } from "../models/index";
import { Umzug, SequelizeStorage } from 'umzug';
import { users } from './users';
import { items } from './items';
import { descriptions } from './recipeDescriptions';
import { Friend } from '../models/friend';

const sequelize = new Sequelize('postgres://postgres:mysecretpassword@localhost:5432/postgres'); //5432

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
  console.log('connecting to the database connecting to the database');
  try {
    await sequelize.authenticate();
    await runMigrations();
    console.log('connected to the database connected to the database');
  } catch (err) {
    console.log('err err err err err err');
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

  const allUsers = await User.bulkCreate(users);

  await Friend.create({ user_id1: allUsers[0].id, user_id2: allUsers[1].id });
  await Friend.create({ user_id1: allUsers[0].id, user_id2: allUsers[2].id });
  await Friend.create({ user_id1: allUsers[0].id, user_id2: allUsers[3].id });
  await Friend.create({ user_id1: allUsers[2].id, user_id2: allUsers[4].id });

  const allItems = await Item.bulkCreate(items);

  const muikutRecipe = await Recipe.create({
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

  await RecipeToItem.create({
    recipeId: muikutRecipe.id,
    itemId: allItems[19 - 1].id,
    amount: "0.1",
  });

  await RecipeToItem.create({
    recipeId: muikutRecipe.id,
    itemId: allItems[20 - 1].id,
    amount: "0.1",
  });

  const poridgeRecipe = await Recipe.create({
    name: "puuro",
    description: descriptions.puuro,
    ownerId: allUsers[1].id,
    global: true,
    imageUri: "poridge_for_recipe"
  });

  await RecipeToItem.create({
    recipeId: poridgeRecipe.id,
    itemId: allItems[20 - 1].id,
    amount: "0.1",
  });

  await RecipeToItem.create({
    recipeId: poridgeRecipe.id,
    itemId: allItems[21 - 1].id,
    amount: "0.1",
  });

  await RecipeToItem.create({
    recipeId: poridgeRecipe.id,
    itemId: allItems[22 - 1].id,
    amount: "0.1",
  });

  const ribMeal = await Recipe.create({
    name: "ribs",
    description: descriptions.ribs,
    ownerId: allUsers[2].id,
    global: true,
    imageUri: "ribs"
  });

  console.log('ribMeal.id', ribMeal.id);

  await RecipeToItem.create({
    recipeId: ribMeal.id,
    itemId: allItems[16 - 1].id,
    amount: "0.3",
  });

  await RecipeToItem.create({
    recipeId: ribMeal.id,
    itemId: allItems[17 - 1].id,
    amount: "0.2",
  });

  await RecipeToItem.create({
    recipeId: ribMeal.id,
    itemId: allItems[3 - 1].id,
    amount: "0.1",
  });

  await RecipeToItem.create({
    recipeId: ribMeal.id,
    itemId: allItems[4 - 1].id,
    amount: "0.02",
  });

  await RecipeToItem.create({
    recipeId: ribMeal.id,
    itemId: allItems[5 - 1].id,
    amount: "0.3",
  });

  const preMadeLasagna = await Recipe.create({
    name: "Premade lasagna",
    description: descriptions.preMadeLasagna,
    ownerId: allUsers[3].id,
    global: false,
    imageUri: "lasagna"
  });

  console.log('preMadeLasagna.id', preMadeLasagna.id);

  await RecipeToItem.create({
    recipeId: preMadeLasagna.id,
    itemId: allItems[6 - 1].id,
    amount: "0.5",
  });

  const bread = await Recipe.create({
    name: "bread",
    description: descriptions.bread,
    ownerId: allUsers[4].id,
    global: true,
    imageUri: "bread"
  });

  console.log('bread.id', bread.id);
  console.log('allItems[23-1].id', allItems[23 - 1].id);

  await RecipeToItem.create({
    itemId: allItems[23 - 1].id,
    recipeId: bread.id,
    amount: "0.2",
  });

  await RecipeToItem.create({
    itemId: allItems[24 - 1].id,
    recipeId: bread.id,
    amount: "0.2",
  });

  await RecipeToItem.create({
    itemId: allItems[13 - 1].id,
    recipeId: bread.id,
    amount: "0.4",
  });


  const chocolateBar = await Recipe.create({
    name: "chocolateBar",
    description: descriptions.chocolateBar,
    ownerId: allUsers[1].id,
    global: true,
    imageUri: "chocolate_bar"
  });

  await RecipeToItem.create({
    itemId: allItems[8 - 1].id,
    recipeId: chocolateBar.id,
    amount: "0.4",
  });

  const salmon = await Recipe.create({
    name: "salmon",
    description: descriptions.salmon,
    ownerId: allUsers[2].id,
    global: true,
    imageUri: "salmon_with_rice"
  });

  await RecipeToItem.create({
    itemId: allItems[15 - 1].id,
    recipeId: salmon.id,
    amount: "1",
  });

  await RecipeToItem.create({
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

/* init(); */