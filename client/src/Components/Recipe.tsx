import {
  Card, CardBody, CardFooter, Image, Heading, Text, Button, Flex, Divider, Badge, Stack, useTheme
} from '@chakra-ui/react';
import { addProduct } from '../redux/modules/shoppingCart';
import { useDispatch } from 'react-redux';
import { useNotification } from '../hooks/useNotification';
import { Item, DbRecipe } from '../types';
import { base_url } from '../config';

interface RecipeProps {
  recipe: DbRecipe;
  setDetailedRecipe: (recipe: DbRecipe | null) => void;
}

const Recipe = ({ recipe, setDetailedRecipe }: RecipeProps) => {
  const dispatch = useDispatch();
  const { showNotification } = useNotification();

  const theme = useTheme();
  const cardBackground = theme.colors.lightOrangeBackground;

  const handleAddToCart = () => {
    try {
      dispatch(addProduct(recipe));
      showNotification('Recipe added to cart', 'success');
    } catch (error) {
      console.log(error);
    }
  };

  const formatDescription = (descrition: string) => {
    return descrition.split('\n').map((line: string, i: number) => (
      <div key={i}>
        {line}
        <br />
      </div>)
    );
  };

  return (
    <Card
      key={recipe.id}
      direction={{ base: 'column', sm: 'row' }}
      overflow='hidden'
      variant='outline'
      style={{ marginTop: '1rem', marginBottom: '1rem' }}
    >
      <Flex direction="column" justify="space-between" flex="1">
        <CardBody>
          <Heading style={{ color: '#3A454F', marginBottom: '6px' }} size='md'>
            {recipe.name}
          </Heading>
          <Divider />
          <Flex style={{ marginTop: '5px' }} direction="row" justify="space-between" flex="1">
            <Image
              objectFit='cover'
              maxW={{ base: '100%', sm: '200px' }}
              src={`${base_url}/images/${recipe.imageUri}`}
              alt={recipe.name}
            />
            <Text overflow={'hidden'} maxH={'200px'} style={{ margin: '12px' }}>
              {formatDescription(recipe.description)}
            </Text>
            <Card style={{ backgroundColor: cardBackground }} variant='elevated' minW='175px'>
              <Text as='b' style={{ borderBottom: '1px solid #002633' }}>Incredients:</Text>
              {recipe.item.length && recipe.item.map((i: Item, index: number) => (
                <Text key={index} noOfLines={3}>
                  {i.name}
                </Text>
              ))}
            </Card>
          </Flex>
        </CardBody>

        <CardFooter>
          <Button onClick={() => setDetailedRecipe(recipe)} variant='outline' colorScheme='blue' mr='1'>
            View recipe
          </Button>
          <Button colorScheme='anotherCustomYellow' onClick={() => handleAddToCart()} mr='1'>
            Add to cart
          </Button>
          <Stack>
            <Badge colorScheme="customBlue" variant='subtle'>
              Likes: {recipe.like_count}
            </Badge></Stack>
        </CardFooter>
      </Flex>
    </Card>
  );
};

export default Recipe;