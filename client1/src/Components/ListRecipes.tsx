import { useEffect, useState } from 'react';
import Recipe from './Recipe';
import axios from 'axios';
import { Heading, Divider, Select, Flex } from '@chakra-ui/react';
import DetailedRecipe from './DetailedRecipe';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useAxios } from '../hooks/useAxios';
import { Recipe as RecipeType } from '../types';

interface ListRecipesProps {
  isMobile: boolean;
}

const ListRecipes = ({ isMobile }: ListRecipesProps) => {
  const [recipe, setRecipe] = useState<RecipeType[]>([]);
  const [fadeIn, setFadeIn] = useState(false);
  const [detailedRecipe, setDetailedRecipe] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [recipeOrder, setRecipeOrder] = useState('shuffle');
  const [introducturyRecipeIds, setIntroducturyRecipeIds] = useState([]);
  const [recipeErrorMessage, setRecipeErrorMessage] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    console.log('recipeError', recipeErrorMessage);
    console.log('recipeOrder', recipeOrder);
  }, [recipeErrorMessage]);

  const { get, post } = useAxios();
  const getRecipes = async (newOrder: any) => {
    console.log('GET RECIPES GET RECIPES');
    switch (newOrder) {
      case 'shuffle':
        setRecipeErrorMessage(null);
        try {
          if (recipe.length === 0 || recipeOrder !== "shuffle") {
            console.log('FIRST case shuffle case shuffle case shuffle case shuffle');
            const recipeReponse = await get('/recipes/introductory');
            const recipeData = recipeReponse.data;
            console.log(recipeData);
            setRecipe(recipeData.recipes);
            setIntroducturyRecipeIds(recipeData?.recipeIds);
            setHasMore(recipeData.hasMore);
          } else {
            console.log('SECOND case shuffle case shuffle case shuffle case shuffle');
            const recipeResponse = await post('/recipes/introductory', { recipeIds: introducturyRecipeIds });
            const recipeData = recipeResponse.data;
            setRecipe(recipe.concat(recipeData?.recipes));
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
            console.log('FIRST case mostLiked case mostLiked case mostLiked case mostLiked');
            const recipeResponse = await get('/recipes/mostliked?page=' + 1);
            const recipeData = recipeResponse.data;
            console.log(recipeData);
            setRecipe(recipeData.recipes);
            setCurrentPage(2);
            setHasMore(recipeData.hasMore);
          } else if (recipe) {
            console.log('SECOND case mostLiked case mostLiked case mostLiked case mostLiked');
            const recipeResponse = await get('/recipes/mostLiked?page=' + currentPage);
            const recipeData = recipeResponse.data;
            console.log(recipeData);
            setRecipe([...recipe, ...recipeData.recipes]);
            setHasMore(recipeData.hasMore);
            setCurrentPage(currentPage + 1);
          }
        } catch (error) {
          console.log(error);
        }
        break;
      case 'owned':
        console.log(recipe);
        setRecipeErrorMessage(null);
        try {
          if (recipeOrder !== "owned") {
            console.log('FIRST case owned case owned case owned case owned ');
            const recipeResponse = await get('/recipes/user?page=' + 1);
            if (recipeResponse.status === 404) {
              setRecipeErrorMessage("You don't have any recipes yet");
              setCurrentPage(1);
              setHasMore(false);
              return;
            }
            const recipeData = recipeResponse.data;
            setRecipe(recipeData.recipes);
            setCurrentPage(2);
          } else {
            console.log('SECOND case owned case owned case owned case owned ');
            const recipeResponse = await get('/recipes/user?page=' + currentPage);
            const recipeData = recipeResponse.data;
            setRecipe([...recipe, ...recipeData.recipes]);
            setCurrentPage(currentPage + 1);
            setHasMore(recipeData.hasMore);
          }
        } catch (error) {
          if (axios.isAxiosError(error)) {
            if (error.response) {
              const status = error.response.status;
              if (status === 404 && currentPage === 1) {
                console.log("404 error: No recipes found");
                setRecipe([]);
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
        console.log('default');
        break;
    }
  };

  useEffect(() => {
    console.log('reRender useEffect käynnistynyt');
    getRecipes("shuffle");
  }, []);

  /* useEffect(() => {
    console.log('recipeOrder', recipeOrder);
    setCurrentPage(1);
    getRecipes(recipeOrder);
  }, [recipeOrder]); */

  useEffect(() => {
    if (detailedRecipe) {
      setFadeIn(true);
    } else {
      setFadeIn(false);
    }
  }, [detailedRecipe]);

  useEffect(() => {
    console.log('LENGTH');
    console.log(recipe.length);
    console.log('LENGTH');
  }, [recipe]);

  const handleRecipeOrder = (e: any) => {
    console.log('handleRecipeOrder', e.target.value);
    setCurrentPage(1);
    getRecipes(e.target.value);
    setRecipeOrder(e.target.value);
  };

  return (
    <div>
      <Flex justifyContent="space-between" alignItems="center">
        <Select width="auto" value={recipeOrder} onChange={handleRecipeOrder}>
          <option value='shuffle'>Shuffle</option>
          <option value='mostLiked'>Most Liked</option>
          <option value='owned'>My recipes</option>
        </Select>
        <Heading color='customInfo.custom' as='h2' size='2xl' textAlign="center" flex="1">
          Recipes
        </Heading>
      </Flex>
      <div className={fadeIn ? "fade-in-div" : "transparent-div"}>
        <DetailedRecipe
          detailedRecipe={detailedRecipe}
          setFadeIn={setFadeIn}
          setDetailedRecipe={setDetailedRecipe}
          visible={false}
          isMobile={isMobile}
          recipe={recipe}
          setRecipe={setRecipe}
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
            console.log(recipe.length);
            getRecipes(recipeOrder);
          }}
          hasMore={hasMore}
          loader={<h4>Loading...</h4>}
          endMessage={
            <p style={{ textAlign: 'center' }}>
              <b>Yay! You have seen it all</b>
            </p>
          }
        >
          {recipe.map((recipe: any, i) => (
            <>
              <Recipe recipe={recipe} setDetailedRecipe={setDetailedRecipe} />
            </>
          ))}
        </InfiniteScroll>}
    </div>
  );
};

export default ListRecipes;