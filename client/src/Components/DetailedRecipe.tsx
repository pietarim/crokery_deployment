import { Card, CardBody, CardFooter, Image, CloseButton, Heading, Text, Button, Flex, Divider } from '@chakra-ui/react';
import { DeleteIcon } from '@chakra-ui/icons';
import { useAxios, useAuth, useWidth } from '../hooks';
import { addProduct } from '../redux/modules/shoppingCart';
import { DbRecipe } from '../types';
import { useDispatch } from 'react-redux';
import { deleteRecipe } from '../redux/modules/recipes';
import { base_url } from '../config';

interface DetailedRecipeProps {
  detailedRecipe: DbRecipe | null;
  setDetailedRecipe: (recipe: DbRecipe | null) => void | null;
  setFadeIn: (fadeIn: boolean) => void;
}

const DetailedRecipe = ({ detailedRecipe, setDetailedRecipe }: DetailedRecipeProps) => {

  console.log("Detailed recipe:", detailedRecipe);

  const isMobile = useWidth();
  const { put, deleteReq } = useAxios();
  const { token } = useAuth();
  const dispatch = useDispatch();

  if (!detailedRecipe) {
    return null;
  }

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
      dispatch(deleteRecipe(detailedRecipe.id));
      setDetailedRecipe(null);
    } catch (error) {
      console.log(error);
    }
  };

  const handleAddToCart = () => {
    dispatch(addProduct(detailedRecipe));
  };
  if (!isMobile) {
    return (
      <Card
        className="recipe-container"
        direction={{ base: 'column', sm: 'row' }}
        overflow='hidden'
        variant='elevated'
        style={{ marginTop: '4rem', marginBottom: '1rem' }}
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
                  src={`${base_url}/images/${detailedRecipe.imageUri}`}
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
                <Heading mb='3' size='xl' color='customCoyote.custom' textAlign="center" flex="1">
                  {detailedRecipe.name}
                </Heading>
                <Divider />
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
            <Button colorScheme='customBlue' variant='ghost' onClick={() => { handleLike(); }}>
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
        <Image src={`${base_url}/images/${detailedRecipe.imageUri}`} alt={detailedRecipe.name} />
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