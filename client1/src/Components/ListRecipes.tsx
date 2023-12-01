import { useEffect, useState } from 'react';
import Recipe from './Recipe';
import { getRandomRecipes } from "../services/recipes";
import { Heading, Divider, Button, Select, Flex } from '@chakra-ui/react';
import DetailedRecipe from './DetailedRecipe';

interface ListRecipesProps {
  isMobile: boolean;
}

const ListRecipes = ({ isMobile }: ListRecipesProps) => {
  const [recipe, setRecipe] = useState([]);
  const [fadeIn, setFadeIn] = useState(false);
  const [detailedRecipe, setDetailedRecipe] = useState(null);

  useEffect(() => {
    const fetchRecipes = async () => {
      const recipes = await getRandomRecipes();
      console.log(recipes);
      setRecipe(recipes);
    };
    fetchRecipes();
  }, []);

  useEffect(() => {
    if (detailedRecipe) {
      setFadeIn(true);
    } else {
      setFadeIn(false);
    }
  }, [detailedRecipe]);

  return (
    <div>
      <Flex justifyContent="space-between" alignItems="center">
        <Select width="auto">
          <option value='option1'>Shuffle</option>
          <option value='option2'>Most Liked</option>
          <option value='option3'>My recipes</option>
        </Select>
        <Heading as='h2' size='2xl' textAlign="center" flex="1">
          Recipes
        </Heading>
        <div style={{ width: '100px' }} /> {/* Placeholder to balance Flex spacing */}
      </Flex>
      {/* <Heading as='h2' size='2xl'>Recipes</Heading>
      <Select>
        <option value='option1'>Suffle</option>
        <option value='option2'>Most Liked</option>
        <option value='option3'>My recipes</option>
      </Select> */}
      <div className={fadeIn ? "fade-in-div" : "transparent-div"}>
        <DetailedRecipe recipe={detailedRecipe} setFadeIn={setFadeIn} setDetailedRecipe={setDetailedRecipe} visible={false} isMobile={isMobile} />
        Content goes here<Button onClick={() => setFadeIn(!fadeIn)}>Click Me</Button>
      </div>
      <Divider style={{ marginTop: '10px', color: 'black' }} />
      {recipe.map((recipe: any) => (
        <Recipe recipe={recipe} setDetailedRecipe={setDetailedRecipe} />
      ))
      }
    </div>
  );
};

export default ListRecipes;