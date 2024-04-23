import { useSelector, useDispatch } from "react-redux";
import {
  Heading, List, ListItem, Flex, Card, TableContainer, Table, Tr, Th, Td, Tbody, Text,
  Button, Drawer, DrawerBody, DrawerHeader, DrawerOverlay, DrawerContent, useDisclosure, DrawerCloseButton,
  Divider, Thead
} from "@chakra-ui/react";
import _ from "lodash";
import { addProductById, removeProductById } from "../redux/modules/shoppingCart";
import { useWidth } from "../hooks/useWidth";
import { RecipeToItem } from "../types";


interface RecipeItem {
  id: number;
  name: string;
  price?: string;
  image?: string;
  description?: string;
  category?: string;
  isTitle?: string;
  recipeToItem: RecipeToItem;
  unitSize: string;
  type: string;
  amount: number;
}

interface Recipe {
  id: number;
  name: string;
  imageUri: string;
  description: string;
  item: RecipeItem[];
  count: number;
}

interface ShoppingCartState {
  items: Recipe[];
}

interface AppState {
  shoppingCart: ShoppingCartState;
}

interface RecipesItem {
  name: string;
  amount: number;
  unitSize: string;
  type: string;
}

interface RecipeItemCalc {
  name: string;
  amount: number;
  unitSize: string;
  type: string;
}


const ShoppingList = () => {
  const isMobile = useWidth();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const dispatch = useDispatch();
  const shoppingList = useSelector((state: AppState) => state.shoppingCart);

  if (!shoppingList.items.length) {
    return (
      <div>
        <Heading as="h2" size="2xl" mb='3'>
          Shopping list
        </Heading>
        <Text>You have no items in your shopping list</Text>
      </div>
    );
  }

  const itemsList: RecipesItem[] = shoppingList.items.reduce((acc: RecipesItem[], cur: Recipe) => {
    return [...acc, ...cur.item.map((item) => {
      return {
        name: item.name,
        amount: parseFloat(item.recipeToItem.amount) * cur.count,
        unitSize: item.unitSize,
        type: item.type
      };
    })];
  }, []);

  const ItemsWithSumAmount = itemsList.reduce((acc: RecipesItem[], cur: RecipesItem) => {
    if (acc.some((item: RecipesItem) => item.name === cur.name)) {
      acc[acc.findIndex((item: RecipesItem) => item.name === cur.name)].amount += cur.amount;
    } else {
      acc.push(cur);
    }
    return acc;
  }, []);

  const sortItemsByType: RecipeItemCalc[] = _.sortBy(ItemsWithSumAmount, ['type']);

  const renderShoppingList = () => {
    const secondColor = '#80A1C0';
    const firstColor = 'white';
    let color = firstColor;
    return (<Card mt={26} variant="elevated"><TableContainer>
      <Table>
        <Thead>
          <Tr>
            <Th>Category</Th>
            <Th>Item</Th>
            <Th>Amount</Th>
            <Th>Count</Th>
          </Tr>
        </Thead>
        {sortItemsByType.map((item: RecipeItemCalc, i) => {
          color = color === firstColor ? secondColor : firstColor;
          if (i === 0) {
            return (
              <Tbody style={{ backgroundColor: color }} key={item.name}>
                <Tr>
                  <Td>{item.type}</Td>
                  <Td>{item.name}</Td>
                  <Td>{Math.ceil(item.amount)}</Td>
                  <Td>{Math.ceil(item.amount / parseFloat(item.unitSize))}</Td>
                </Tr>
              </Tbody>);
          }
          else if (item.type !== sortItemsByType[i - 1].type) {
            return (
              <Tbody style={{ backgroundColor: color }} key={item.name}>
                <Tr>
                  <Td>{item.type}</Td>
                  <Td>{item.name}</Td>
                  <Td>{Math.ceil(item.amount)}</Td>
                  <Td>{Math.ceil(item.amount / parseFloat(item.unitSize))}</Td>
                </Tr>
              </Tbody>);
          }
          return (
            <Tbody style={{ backgroundColor: color }} key={item.name}>
              <Tr>
                <Td></Td>
                <Td>{item.name}</Td>
                <Td>{Math.ceil(item.amount)}</Td>
                <Td>{Math.ceil(item.amount / parseFloat(item.unitSize))}</Td>
              </Tr>
            </Tbody>
          );
        }
        )}</Table>
    </TableContainer></Card>);
  };

  const renderMobileShoppingList = () => {
    return (
      <Table>
        <Thead>
          <Tr>
            <Th>Category</Th>
            <Th>Item</Th>
            <Th>Amount</Th>
          </Tr>
        </Thead>
        {sortItemsByType.map((item: RecipeItemCalc, i) => {
          if (i === 0) {
            return (
              <Tbody>
                <Tr>
                  <Td>{item.type}</Td>
                  <Td>{item.name}</Td>
                  <Td>{Math.ceil(item.amount)}</Td>
                </Tr>
              </Tbody>);
          } else if (item.type !== sortItemsByType[i - 1].type) {
            return (
              <Tbody>
                <Tr>
                  <Td>{item.type}</Td>
                  <Td>{item.name}</Td>
                  <Td>{Math.ceil(item.amount)}</Td>
                </Tr>
              </Tbody>);
          } return (
            <Tbody>
              <Tr>
                <Td></Td>
                <Td>{item.name}</Td>
                <Td>{Math.ceil(item.amount)}</Td>
              </Tr>
            </Tbody>
          );
        }
        )
        }
      </Table>
    );
  };

  if (!isMobile) {
    return (
      <div>
        <Heading mb='2' as="h2" size="2xl" color='customeExit.custom'>
          Shopping list
        </Heading>
        <Divider mb='2' style={{ marginTop: '10px', color: 'black' }} />
        <Flex justifyContent="space-between">
          <div></div>
          {renderShoppingList()}
          <Card pt={'11'} mt={'18'} style={{ backgroundColor: '#e2e6e9' }} variant='elevated' minW='175px'>
            <Heading pt={3} pb={3} fontSize={'h3'}>Recipes:</Heading>
            <List>
              {shoppingList.items.map((item) => (
                <ListItem style={{ backgroundColor: "white", margin: "4px 2px" }} pt={3} pb={6} key={item.id}>
                  <Text style={{ fontWeight: 'bold' }} mb={2}>{item.name}: {item.count}</Text>
                  <Button
                    mr='2'
                    colorScheme="anotherCustomYellow"
                    onClick={() => dispatch(addProductById(item.id))}
                    style={{ borderRadius: '20px', height: '40px', width: '40px', paddingBottom: '3px' }}>
                    +
                  </Button>
                  <Button
                    colorScheme="customBlue"
                    onClick={() => dispatch(removeProductById(item.id))}
                    style={{ borderRadius: '20px', height: '40px', width: '40px', paddingBottom: '3px' }}>
                    -
                  </Button>
                </ListItem>
              ))}
            </List></Card>
        </Flex>
      </div>
    );
  } else {
    return (
      <div>
        <Button onClick={onOpen}>show recipes</Button>
        <Drawer placement='right' onClose={onClose} isOpen={isOpen}>
          <DrawerOverlay />
          <DrawerContent>
            <DrawerHeader borderBottomWidth='1px'>Selected recipes<DrawerCloseButton /></DrawerHeader>
            <DrawerBody style={{ padding: '2px' }}>
              <List>
                {shoppingList.items.map((item) => (
                  <ListItem style={{
                    backgroundColor: "lightgray",
                    margin: "2px 1px",
                    padding: '8px',
                    display: 'flex',
                    justifyContent: 'space-between'
                  }} key={item.id}>
                    <Flex style={{ display: "inline-block" }}>
                      <Text style={{ top: '50%', position: 'relative', transform: "translateY(-50%)", fontWeight: 'bold' }}>
                        {item.name}: {item.count}
                      </Text>
                    </Flex>
                    <Flex style={{ display: "inline-block" }}>
                      <Button
                        mr='1'
                        ml='3'
                        colorScheme="customBlue"
                        onClick={() => dispatch(addProductById(item.id))}
                        style={{ borderRadius: '20px', height: '40px', width: '40px', display: "inline-block", padding: "0 1px 3px 0" }}
                      >
                        +
                      </Button>
                      <Button
                        colorScheme="customYellow"
                        onClick={() => dispatch(removeProductById(item.id))}
                        style={{ borderRadius: '20px', height: '40px', width: '40px', display: "inline-block", padding: "0 1px 3px 0" }}
                      >
                        -
                      </Button>
                    </Flex>
                  </ListItem>
                ))}
              </List>
            </DrawerBody>
          </DrawerContent>
        </Drawer>
        <Heading as="h2" size="2xl" mb='3'>
          Shopping list
        </Heading>
        <Flex justifyContent="space-between">
          <TableContainer>
            {renderMobileShoppingList()}
          </TableContainer>
        </Flex>
      </div>
    );
  }
};

export default ShoppingList;