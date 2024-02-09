import express from 'express';
import { returnMostLikedRecipes, getIntroduceRecipes, createRecipe, updateRecipe, deleteRecipe, getUsersOwnRecipes, likeRecipeController } from '../controllers/recipes';
import { parseString, parseNumber, parseBoolean } from '../config/utils';
import { userExtractor } from '../middleware/userExtractor';

const router = express.Router();

router.get('/introductory', getIntroduceRecipes);
router.get('/mostliked', returnMostLikedRecipes);
router.get('/user', userExtractor, getUsersOwnRecipes);
router.post('/introductory', getIntroduceRecipes);

router.put('/like/:id', userExtractor, likeRecipeController);

router.post('/', userExtractor, createRecipe);

router.delete('/:id', userExtractor, deleteRecipe);

export default router;