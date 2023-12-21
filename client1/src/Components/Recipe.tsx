import { Card, CardBody, CardFooter, Image, Heading, Text, Button, Flex, Divider, Badge, Stack } from '@chakra-ui/react';
import { addProduct } from '../redux/modules/shoppingCart';
import { useDispatch } from 'react-redux';

const Recipe = ({ recipe, setDetailedRecipe }: any) => {
  const dispatch = useDispatch();

  const handleAddToCart = () => {
    dispatch(addProduct(recipe));
  };

  return (
    <Card
      direction={{ base: 'column', sm: 'row' }}
      overflow='hidden'
      variant='outline'
      style={{ marginTop: '1rem', marginBottom: '1rem' }}
    >
      <Flex direction="column" justify="space-between" flex="1">
        <CardBody>
          <Heading style={{ marginBottom: '6px' }} size='md'>{recipe.name}</Heading>
          <Divider />
          <Flex style={{ marginTop: '5px' }} direction="row" justify="space-between" flex="1">
            <Image
              objectFit='cover'
              maxW={{ base: '100%', sm: '200px' }}
              src={`http://localhost:3001/api/images/${recipe.imageUri}`}
              alt={recipe.name}
            />
            <Text style={{ margin: '12px' }} noOfLines={3}>
              {recipe.description}
            </Text>
            <Card style={{ backgroundColor: '#e6f9ff' }} variant='elevated' minW='175px'>
              <Text as='b' style={{ borderBottom: '1px solid #002633' }}>Incredients:</Text>
              {recipe.item.map((i, index) => (
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
          <Button colorScheme='customYellow' onClick={() => handleAddToCart()} mr='1'>
            Add to cart
          </Button>
          <Stack>
            <Badge colorScheme="customGreen" variant='subtle'>
              Likes: {recipe.like_count}
            </Badge></Stack>
        </CardFooter>
      </Flex>
    </Card>
  );
};

export default Recipe;