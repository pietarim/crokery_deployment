import { useSelector } from "react-redux";
import {
  Heading, List, ListItem, Flex, Card, TableContainer, Table, Tr, Th, Td, Tbody, Text,
  Button, Drawer, DrawerBody, DrawerHeader, DrawerOverlay, DrawerContent, useDisclosure, DrawerCloseButton,
  Divider
} from "@chakra-ui/react";
import _ from "lodash";
import { addProductById, removeProductById } from "../redux/modules/shoppingCart";
import { useDispatch } from "react-redux";

interface RecipeToItem {
  amount: string;
}

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

type ItemAndTitle = RecipeItemCalc | string;
type ItemByType = Array<RecipeItemCalc | string>;

interface ShoppingListProps {
  isMobile: boolean;
}

const ShoppingList = ({ isMobile }: ShoppingListProps) => {
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

  const itemsAndTypes: ItemByType = sortItemsByType.reduce<ItemByType>((acc, cur) => {
    if (!acc.length) {
      return [cur.type, { ...cur, isTitle: cur.type }];
    } else {
      const lastItem = acc[acc.length - 1];
      if (typeof lastItem === 'string') {
        return [...acc, cur.type, { ...cur }];
      } else {
        if (lastItem.type === cur.type) {
          return [...acc, { ...cur }];
        } else {
          return [...acc, cur.type, { ...cur }];
        }
      }
    }
  }, []);


  const itemAmounts: { [key: string]: number; } = {};
  for (const item of itemsList) {
    if (itemAmounts[item.name]) {
      itemAmounts[item.name] += item.amount;
    } else {
      itemAmounts[item.name] = item.amount;
    }
  }

  const returnItemsAndTitles = () => {
    {
      return itemsAndTypes.map((i: ItemAndTitle) => {
        if (typeof i === 'string') {
          return (<Tr key={i}>
            <Th>{i || "tittle not found"}</Th>
          </Tr>);
        } else {
          if (!isMobile) {
            return (
              <Tr key={i.name}>
                <Td>{i.name || "name not found"}</Td>
                <Td>{i.amount.toFixed(2) || "amount not found"}</Td>
                <Td>amount: count {Math.ceil(i.amount / parseFloat(i.unitSize)) || "count not found"}</Td>
              </Tr>
            );
          }
          else {
            return (
              <Tbody key={i.name}>
                <Tr>
                  <Td>{i.name}</Td>
                  <Td>count {Math.ceil(i.amount / parseFloat(i.unitSize))}</Td>
                </Tr>
              </Tbody>
            );
          }
        }
      });
    }
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
          <TableContainer>
            <Table>
              <Tbody>
                {returnItemsAndTitles()}</Tbody>
            </Table>
          </TableContainer>
          <Card style={{ backgroundColor: '#e6f9ff' }} variant='elevated' minW='175px'>
            <List>
              {shoppingList.items.map((item) => (
                <ListItem key={item.id}>
                  <Text>{item.name} {item.count}</Text>
                  <Button
                    mr='2'
                    colorScheme="customYellow"
                    onClick={() => dispatch(addProductById(item.id))}>
                    +
                  </Button>
                  <Button
                    colorScheme="customGreen"
                    onClick={() => dispatch(removeProductById(item.id))}>
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
            <DrawerBody>
              <List>
                {shoppingList.items.map((item) => (
                  <ListItem key={item.id}>
                    <Text>{item.name}: {item.count}</Text>
                    <Button mr='1' colorScheme="customGreen" onClick={() => dispatch(addProductById(item.id))}>
                      +
                    </Button>
                    <Button colorScheme="customYellow" onClick={() => dispatch(removeProductById(item.id))}>
                      -
                    </Button>
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
            <Table>
              <Tbody>
                {returnItemsAndTitles()}</Tbody>
            </Table>
          </TableContainer>
        </Flex>
      </div>
    );
  }
};

export default ShoppingList;