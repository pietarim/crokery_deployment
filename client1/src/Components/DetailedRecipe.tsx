import { Card, CardBody, CardFooter, Image, CloseButton, Heading, Text, Button, Flex, Divider } from '@chakra-ui/react';
import { useDispatch } from 'react-redux';
import { addProduct } from '../redux/modules/shoppingCart';

const DetailedRecipe = ({ recipe, setDetailedRecipe, isMobile }: any) => {

  const dispatch = useDispatch();

  const handleAddToCart = () => {
    dispatch(addProduct(recipe));
  };

  if (!recipe) {
    return null;
  }
  if (!isMobile) {
    return (
      <Card
        className="recipe-container"
        direction={{ base: 'column', sm: 'row' }}
        overflow='hidden'
        variant='outline'
        style={{ marginTop: '1rem', marginBottom: '1rem'/* , backgroundColor: 'orange' */ }}
      >
        <Flex className="recipe-content" direction="column" justify="space-between" flex="1">
          <CardBody>
            <Flex justifyContent="flex-end" alignItems="center" width="100%">
              <CloseButton onClick={() => setDetailedRecipe(null)} />
            </Flex>
            <Divider />
            <Flex direction="row" justify="space-between" flex="1">
              <Flex direction="column" justify="space-between" flex="1">
                <Image
                  objectFit='cover'
                  maxW={{ base: '100%', sm: '200px' }}
                  src={`http://localhost:3001/api/images/${recipe.imageUri}`}
                  alt={recipe.name}
                />
                <Card minW='175px'>
                  {recipe.item.map((i, index) => (
                    <Text key={index}>
                      {i.name}: {i.recipeToItem.amount}
                    </Text>
                  ))}
                </Card>
              </Flex>
              <div>
                <Heading size='xl' textAlign="center" flex="1">{recipe.name}</Heading>
                <Text fontSize='lg' style={{ margin: '12px' }}>
                  {recipe.description}
                </Text>
              </div>
            </Flex>
          </CardBody>
          <CardFooter>
            <Button variant='outline' colorScheme='blue'>
              Add to cart
            </Button>
            <Button variant='ghost' onClick={() => handleAddToCart()} /* leftIcon={<BiLike />} */>
              Like
            </Button>
            <CloseButton onClick={() => setDetailedRecipe(null)} />
          </CardFooter>
        </Flex>
      </Card>
    );
  }
  return (
    <Card>
      <CardBody>
        <Image src={`http://localhost:3001/api/images/${recipe.imageUri}`} alt={recipe.name} />
        <Heading>{recipe.name}</Heading>
        <Text>{recipe.description}</Text>
        {recipe.item.map((i, index) => (
          <Text key={index}>
            {i.name}: {i.recipeToItem.amount}
          </Text>
        ))}
      </CardBody>
      <Divider />
      <CardFooter>
        <Button variant='outline' colorScheme='blue'>
          Add to cart
        </Button>
        <Button variant='ghost' onClick={() => handleAddToCart()} /* leftIcon={<BiLike />} */>
          Like
        </Button>
      </CardFooter>
    </Card>
  );
};

export default DetailedRecipe;