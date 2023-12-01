import express from 'express';
import { getIntroduceRecipes, createRecipe, updateRecipe, deleteRecipe, getUsersOwnRecipes } from '../controllers/recipes';
import { parseString, parseNumber, parseIncredient, parseBoolean } from '../config/utils';
import { get } from 'http';
import { userExtractor } from '../middleware/userExtractor';

const router = express.Router();

/* router.get('/', async (req, res) => {
  const recipes = await getRandomRecipes(req, res);
  res.status(200).json(recipes);
}); */
router.get('/user', getUsersOwnRecipes);
router.get('/', getIntroduceRecipes);

/* router.post('/', userExtractor, async (req, res) => {
  await createRecipe(req, res);
}); */

router.post('/', userExtractor, createRecipe);

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { name, description, global, ingredients, ownerId } = req.body;
  const parsedOwnerId = parseNumber(ownerId);
  const parsedId = parseString(id);
  const parsedName = parseString(name);
  const parsedDescription = parseString(description);
  const parsedGlobal = parseBoolean(global);
  /* const parsedIncredients = parseIncredient(incredients); */

  const numberId = Number(parsedId);

  const recipe = {
    /* id: parsedId, */
    name: parsedName,
    description: parsedDescription,
    ownerId: parsedOwnerId,
    global: parsedGlobal
    /* incredients: parsedIncredients */
  };

  await updateRecipe(recipe, numberId, ingredients);
  res.status(200).json({ message: 'Recipe updated' });
});

router.delete('/:id', async (req, res, next) => {
  const { id } = req.params;
  const { userId } = req.body;
  const parsedId = parseString(id);
  const parsedUserId = parseNumber(userId);

  await deleteRecipe(parsedId, parsedUserId);
  res.status(200).json({ message: 'Recipe deleted' });
});

export default router;