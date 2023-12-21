import { Card, CardBody, CardFooter, Image, CloseButton, Heading, Text, Button, Flex, Divider } from '@chakra-ui/react';
import { DeleteIcon } from '@chakra-ui/icons';
import { useDispatch } from 'react-redux';
import { useAxios } from '../hooks/useAxios';
import { useAuth } from '../hooks/useAuth';
import { addProduct } from '../redux/modules/shoppingCart';

const DetailedRecipe = ({ detailedRecipe, setDetailedRecipe, isMobile, recipe, setRecipe }: any) => {

  const { put, deleteReq } = useAxios();
  const { token } = useAuth();
  const dispatch = useDispatch();

  let isRecipeOwner = false;

  if (detailedRecipe) {
    isRecipeOwner = token?.id === detailedRecipe.ownerId;
  }

  const handleLike = async () => {
    try {
      await put(`/recipes/like/${detailedRecipe.id}`);
    } catch (error) {
      console.log(error);
    }
  };

  const handleRemove = async () => {
    try {
      await deleteReq(`/recipes/${detailedRecipe.id}`);
      const newRecipes = recipe.filter((r) => r.id !== detailedRecipe.id);
      setRecipe(newRecipes);
      setDetailedRecipe(null);
    } catch (error) {
      console.log(error);
    }
  };

  const handleAddToCart = () => {
    dispatch(addProduct(detailedRecipe));
  };

  if (!detailedRecipe) {
    return null;
  }
  if (!isMobile) {
    return (
      <Card
        className="recipe-container"
        direction={{ base: 'column', sm: 'row' }}
        overflow='hidden'
        variant='outline'
        style={{ marginTop: '1rem', marginBottom: '1rem' }}
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
                  src={`http://localhost:3001/api/images/${detailedRecipe.imageUri}`}
                  alt={detailedRecipe.name}
                />
                <Card minW='175px'>
                  {detailedRecipe.item.map((i, index) => (
                    <Text key={index}>
                      {i.name}: {i.recipeToItem.amount}
                    </Text>
                  ))}
                </Card>
              </Flex>
              <div>
                <Heading size='xl' color='customInfo.custom' textAlign="center" flex="1">{detailedRecipe.name}</Heading>
                <Text fontSize='lg' style={{ margin: '12px' }}>
                  {detailedRecipe.description}
                </Text>
              </div>
            </Flex>
          </CardBody>
          <CardFooter>
            <Button variant='outline' colorScheme='blue' onClick={() => handleAddToCart()}>
              Add to cart
            </Button>
            <Button colorScheme='customGreen' variant='ghost' onClick={() => { handleLike(); }} /* leftIcon={<BiLike />} */>
              Like
            </Button>
            {isRecipeOwner ? <Button leftIcon={<DeleteIcon />} onClick={() => handleRemove()}>
              Remove
            </Button> : null}
          </CardFooter>
        </Flex>
      </Card>
    );
  }
  return (
    <Card>
      <CardBody>
        <Image src={`http://localhost:3001/api/images/${detailedRecipe.imageUri}`} alt={detailedRecipe.name} />
        <Heading>{detailedRecipe.name}</Heading>
        <Text>{detailedRecipe.description}</Text>
        {detailedRecipe.item.map((i, index) => (
          <Text key={index}>
            {i.name}: {i.recipeToItem.amount}
          </Text>
        ))}
      </CardBody>
      <Divider />
      <CardFooter>
        <Button variant='outline' colorScheme='blue' onClick={() => handleAddToCart()}>
          Add to cart
        </Button>
        <Button variant='ghost'>
          Like
        </Button>
      </CardFooter>
    </Card>
  );
};

export default DetailedRecipe;