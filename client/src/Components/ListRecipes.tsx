import { useEffect, useState } from 'react';
import Recipe from './Recipe';
import axios from 'axios';
import { Heading, Divider, Select, Flex } from '@chakra-ui/react';
import DetailedRecipe from './DetailedRecipe';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useAxios, useWidth } from '../hooks';
import { DbRecipe } from '../types';
import { useDispatch, useSelector } from 'react-redux';
import { setRecipes, addRecipes } from '../redux/modules/recipes';

const ListRecipes = () => {
  const [fadeIn, setFadeIn] = useState(false);
  const [detailedRecipe, setDetailedRecipe] = useState<DbRecipe | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [recipeOrder, setRecipeOrder] = useState('shuffle');
  const [introducturyRecipeIds, setIntroducturyRecipeIds] = useState<number[]>([]);
  const [recipeErrorMessage, setRecipeErrorMessage] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);

  interface AppState {
    recipe: DbRecipe[];
  }

  interface RecipeData {
    recipes: DbRecipe[];
    recipeIds: number[];
    hasMore: boolean;
  }

  const isMobile = useWidth();
  const { get, post } = useAxios();
  const dispatch = useDispatch();
  const recipe = useSelector((state: AppState) => state.recipe);

  const getRecipes = async (newOrder: string) => {
    switch (newOrder) {
      case 'shuffle':
        setRecipeErrorMessage(null);
        try {
          if (recipe.length === 0 || recipeOrder !== "shuffle") {
            const recipeReponse = await post('/recipes/introductory', { recipeIds: introducturyRecipeIds });
            const recipeData: RecipeData = recipeReponse.data;
            dispatch(setRecipes(recipeData.recipes));
            setIntroducturyRecipeIds(recipeData?.recipeIds);
            setHasMore(recipeData.hasMore);
          } else {
            const recipeResponse = await post('/recipes/introductory', { recipeIds: introducturyRecipeIds });
            const recipeData = recipeResponse.data;
            dispatch(addRecipes(recipeData.recipes));
            setIntroducturyRecipeIds(recipeData?.recipeIds);
            setHasMore(recipeData.hasMore);
          }
        } catch (error) {
          console.log(error);
        }
        break;
      case 'mostLiked':
        setRecipeErrorMessage(null);
        try {
          if (recipeOrder !== "mostLiked") {
            const recipeResponse = await get('/recipes/mostliked?page=' + 1);
            const recipeData = recipeResponse.data;
            dispatch(setRecipes(recipeData.recipes));
            setCurrentPage(2);
            setHasMore(recipeData.hasMore);
          } else if (recipe) {
            const recipeResponse = await get('/recipes/mostLiked?page=' + currentPage);
            const recipeData = recipeResponse.data;
            dispatch(addRecipes(recipeData.recipes));
            setHasMore(recipeData.hasMore);
            setCurrentPage(currentPage + 1);
          }
        } catch (error) {
          console.log(error);
        }
        break;
      case 'owned':
        setRecipeErrorMessage(null);
        try {
          if (recipeOrder !== "owned") {
            const recipeResponse = await get('/recipes/user?page=' + 1);
            if (recipeResponse.status === 404) {
              setRecipeErrorMessage("You don't have any recipes yet");
              setCurrentPage(1);
              setHasMore(false);
              return;
            }
            const recipeData = recipeResponse.data;
            dispatch(setRecipes(recipeData.recipes));
            setCurrentPage(2);
          } else {
            const recipeResponse = await get('/recipes/user?page=' + currentPage);
            const recipeData = recipeResponse.data;
            dispatch(addRecipes(recipeData.recipes));
            setCurrentPage(currentPage + 1);
            setHasMore(recipeData.hasMore);
          }
        } catch (error) {
          if (axios.isAxiosError(error)) {
            if (error.response) {
              const status = error.response.status;
              if (status === 404 && currentPage === 1) {
                dispatch(setRecipes([]));
                setRecipeErrorMessage("You don't have any recipes yet");
              }
            }
          } else {
            console.log(error);
          }
          setCurrentPage(1);
        }
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    if (!recipe.length) {
      getRecipes("shuffle");
    } else {
      const introducturyRecipeIds = recipe.map((recipe) => recipe.id);
      setIntroducturyRecipeIds(introducturyRecipeIds);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (detailedRecipe) {
      setFadeIn(true);
    } else {
      setFadeIn(false);
    }
  }, [detailedRecipe]);

  const handleRecipeOrder = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCurrentPage(1);
    getRecipes(e.target.value);
    setRecipeOrder(e.target.value);
    setIntroducturyRecipeIds([]);
  };

  const getTitleAndOrder = () => {
    if (isMobile) {
      return (
        <>
          <Heading color='customeExit.custom' as='h2' size='2xl' textAlign="center" flex="1">
            Recipes
          </Heading>
          <Select width="auto" value={recipeOrder} onChange={handleRecipeOrder}>
            <option value='shuffle'>Shuffle</option>
            <option value='mostLiked'>Most Liked</option>
            <option value='owned'>My recipes</option>
          </Select></>
      );
    } else {
      return (
        <Flex justifyContent="space-between" alignItems="center">
          <Select width="auto" value={recipeOrder} onChange={handleRecipeOrder}>
            <option value='shuffle'>Shuffle</option>
            <option value='mostLiked'>Most Liked</option>
            <option value='owned'>My recipes</option>
          </Select>
          <Heading color='customeExit.custom' as='h2' size='2xl' textAlign="center" flex="1">
            Recipes
          </Heading>
        </Flex>
      );
    }
  };

  return (
    <div>
      {getTitleAndOrder()}
      <div className={fadeIn ? "fade-in-div" : "transparent-div"}>
        <DetailedRecipe
          detailedRecipe={detailedRecipe}
          setFadeIn={setFadeIn}
          setDetailedRecipe={setDetailedRecipe}
        />
      </div>
      <Divider style={{ marginTop: '10px', color: 'black' }} />
      {recipeErrorMessage && <Heading as='h2' size='2xl' textAlign="center" flex="1">
        {recipeErrorMessage}
      </Heading>}
      {recipe &&
        <InfiniteScroll
          dataLength={recipe.length}
          next={() => {
            getRecipes(recipeOrder);
          }}
          hasMore={hasMore}
          loader={<h4>Loading...</h4>}
          endMessage={
            <p style={{ textAlign: 'center' }}>
              <b>All recipes queried</b>
            </p>
          }
        >
          {recipe.length && recipe.map((recipe: DbRecipe) => (
            <Recipe key={recipe.id} recipe={recipe} setDetailedRecipe={setDetailedRecipe} />
          ))}
        </InfiniteScroll>}
    </div>
  );
};

export default ListRecipes;