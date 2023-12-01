import { Card, CardBody, CardFooter, Image, Heading, Text, Button, Flex, Divider } from '@chakra-ui/react';
import { useDispatch } from 'react-redux';

const Recipe = ({ recipe, setDetailedRecipe/* , handleOpenDetailedRecipe */ }: any) => {
  /* const [recipeImage, setRecipeImage] = useState<string | null>(null); */
  const dispatch = useDispatch();

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
            {/* <Divider orientation='vertical' /> */}
            {/* <div style={{ borderLeft: '1px solid #ccc' }}> */}
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
          <Button onClick={() => setDetailedRecipe(recipe)} variant='solid' colorScheme='blue'>
            View recipe
          </Button>
          <Button variant='outline' colorScheme='blue'>
            Add to cart
          </Button>
        </CardFooter>
      </Flex>
    </Card>
  );
};

export default Recipe;