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

  const isMobile = useWidth();
  const { put, deleteReq } = useAxios();
  const { token } = useAuth();
  const dispatch = useDispatch();

  if (!detailedRecipe) {
    return null;
  }

  const formatDescription = (descrition: string) => {
    return descrition.split('\n').map((line: string, i: number) => (
      <div key={i}>
        {line}
        <br />
      </div>)
    );
  };

  let isRecipeOwner = false;

  const yOffset = window.scrollY + 10;

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
        variant='elevated'
        maxW="container.xl"
        top={yOffset + 'px'}
      >
        <Flex className="recipe-content" direction="column" justify="space-between" w="100%">
          <CardBody>
            <Flex justifyContent="flex-end" alignItems="center" width="100%">
              <CloseButton onClick={() => setDetailedRecipe(null)} />
            </Flex>
            <Divider />
            <Flex className="image-and-description" direction="row" justify="space-between">
              <Flex className='first-row' direction="column" justify="space-between" maxW={'200px'}>
                <div>
                  <Image
                    objectFit='cover'
                    src={`${base_url}/images/${detailedRecipe.imageUri}`}
                    alt={detailedRecipe.name}
                    maxW={{ base: '100%', sm: '200px' }}
                  />
                  <Card w={'100%'}>
                    {detailedRecipe.item.map((i, index) => (
                      <Text key={index}>
                        {i.name}: {i.recipeToItem.amount}
                      </Text>
                    ))}
                  </Card></div>
              </Flex>
              <Flex direction="column" w={'100%'}>
                <Heading mb='3' size='xl' color='customCoyote.custom' textAlign="center">
                  {detailedRecipe.name}
                </Heading>
                <Divider />
                <Text fontSize='lg' style={{ margin: '12px' }}>
                  {formatDescription(detailedRecipe.description)}
                </Text>
              </Flex>
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
    <Card
      top={yOffset + 'px'}
      className="big-container" style={{ position: 'absolute', zIndex: '10' }}>
      <CardBody>
        <CloseButton onClick={() => setDetailedRecipe(null)} />
        <Image src={`${base_url}/images/${detailedRecipe.imageUri}`} alt={detailedRecipe.name} />
        <Heading>{detailedRecipe.name}</Heading>
        <Text>{detailedRecipe.description}</Text>
        <Heading size='lg'>Incredients:</Heading>
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