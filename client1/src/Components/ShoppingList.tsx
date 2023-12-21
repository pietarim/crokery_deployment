import { useSelector } from "react-redux";
import {
  Heading, List, ListItem, Flex, Card, TableContainer, Table, Thead, Tr, Th, Td, Tbody, Text,
  Button, Drawer, DrawerBody, DrawerHeader, DrawerOverlay, DrawerContent, useDisclosure, DrawerCloseButton
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
  price: string;
  image: string;
  description: string;
  category: string;
  isTitle?: string;
  recipeToItem: RecipeToItem;
  unitSize: string;
  type: string;
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
  amount: string;
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

const ShoppingList = ({ isMobile }: any) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const dispatch = useDispatch();
  const shoppingList = useSelector((state: AppState) => state.shoppingCart);

  const itemsList: RecipesItem[] = shoppingList.items.reduce((acc: RecipesItem[], cur: Recipe) => {
    return [...acc, ...cur.item.map((item) => {
      return { name: item.name, amount: parseFloat(item.recipeToItem.amount) * cur.count, unitSize: item.unitSize, type: item.type };
    })];
  }, []);

  const ItemsWithSumAmount = itemsList.reduce((acc: RecipeItemCalc[], cur: RecipesItem) => {
    if (acc.some((item: RecipeItemCalc) => item.name === cur.name)) {
      acc[acc.findIndex((item: RecipeItemCalc) => item.name === cur.name)].amount += parseFloat(cur.amount);
    } else {
      acc.push({ ...cur, amount: parseFloat(cur.amount) });
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
      itemAmounts[item.name] += parseFloat(item.amount);
    } else {
      itemAmounts[item.name] = parseFloat(item.amount);
    }
  }

  const returnTitle = (title: string) => {
    return (
      <Thead key={title}>
        <Tr><Th style={{ backgroundColor: "lightBlue" }}>{title}</Th></Tr>
      </Thead>
    );
  };

  const returnItem = (item: RecipeItemCalc) => {
    if (!isMobile) {
      return (
        <Tbody key={item.name}>
          <Tr>
            <Td>{item.name}</Td>
            <Td>{item.amount.toFixed(2)}</Td>
            <Td>amount:  count {Math.ceil(item.amount / parseFloat(item.unitSize))}</Td> </Tr></Tbody>
      );
    }
    else {
      return (
        <Tbody key={item.name}>
          <Tr>
            <Td>{item.name}</Td>
            <Td>count {Math.ceil(item.amount / parseFloat(item.unitSize))}</Td>
          </Tr>
        </Tbody>
      );
    }
  };

  const returnItemsAndTitles = () => {
    {
      return itemsAndTypes.map((i: ItemAndTitle) => {
        if (typeof i === 'string') {
          return returnTitle(i);
        } else {
          return returnItem(i);
        }
      });
    }
  };

  if (!isMobile) {
    return (
      <div>
        <Heading as="h2" size="2xl" color='customeExit.custom'>
          Shopping list
        </Heading>
        <Flex justifyContent="space-between">
          <TableContainer>
            <Table>
              {returnItemsAndTitles()}</Table>
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
        <Button onClick={onOpen}>Open Drawer</Button>
        <Drawer placement='right' onClose={onClose} isOpen={isOpen}>
          <DrawerOverlay />
          <DrawerContent>
            <DrawerHeader borderBottomWidth='1px'>Basic Drawer<DrawerCloseButton /></DrawerHeader>
            <DrawerBody>
              <List>
                {shoppingList.items.map((item) => (
                  <ListItem key={item.id}>
                    <Text>{item.name}: {item.count}</Text>
                    <Button mr='1' colorScheme="customGreen" onClick={() => dispatch(addProductById(item.id))}>+</Button>
                    <Button colorScheme="customYellow" onClick={() => dispatch(removeProductById(item.id))}>-</Button>
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
              {returnItemsAndTitles()}
            </Table>
          </TableContainer>
        </Flex>
        {/* <Card style={{ backgroundColor: '#e6f9ff' }} variant='elevated' minW='175px'>
          <List>
            {shoppingList.items.map((item) => (
              <ListItem key={item.id}>
                <Text>{item.name}: {item.count}</Text>
                <Button mr='1' colorScheme="customGreen" onClick={() => dispatch(addProductById(item.id))}>+</Button>
                <Button colorScheme="customYellow" onClick={() => dispatch(removeProductById(item.id))}>-</Button>
              </ListItem>
            ))}
          </List></Card> */}
      </div>
    );
  }
};

export default ShoppingList;