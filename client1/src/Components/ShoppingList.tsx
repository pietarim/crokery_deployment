import { useSelector } from "react-redux";
import { Heading, List, ListItem, Flex, Card } from "@chakra-ui/react";
import _ from "lodash";

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
  const shoppingList = useSelector((state: AppState) => state.shoppingCart);

  const itemsList: RecipesItem[] = shoppingList.items.reduce((acc: RecipesItem[], cur: Recipe) => {
    return [...acc, ...cur.item.map((item) => {
      return { name: item.name, amount: item.recipeToItem.amount, unitSize: item.unitSize, type: item.type };
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

  console.log(itemsAndTypes);

  const itemAmounts: { [key: string]: number; } = {};
  for (const item of itemsList) {
    if (itemAmounts[item.name]) {
      itemAmounts[item.name] += parseFloat(item.amount);
    } else {
      itemAmounts[item.name] = parseFloat(item.amount);
    }
  }

  const itemsWithTitles = itemsList.reduce((acc: any, item: any) => {
    if (!acc.length) {
      return [{ ...item,/* : item.type, */ style: 'title', name: "", isTitle: item.type }, { ...item, style: 'item', isTitle: "" }];
    } else if (acc[acc.length - 1].type === item.type) {
      return [...acc, { ...item, style: 'item', isTitle: "" }];
    } else {
      return [...acc, { ...item, /* item: item.type, */ style: 'title', name: "", isTitle: item.type }, { ...item, style: 'item', isTitle: "" }];
    }
  }, []);

  console.log(itemsWithTitles);

  const returnTitle = (title: string) => {
    return (
      <ListItem key={title}>{title}</ListItem>
    );
  };

  const returnItem = (item: RecipeItemCalc) => {
    return (
      <ListItem key={item.name}>{item.name}: {item.amount} {/* {item.unitSize} */}</ListItem>
    );
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

  return (
    <div>
      <Heading as="h2" size="2xl">
        Shopping list
      </Heading>
      <Flex justifyContent="space-between">
        <List>
          {returnItemsAndTitles()}
        </List>
        <Card style={{ backgroundColor: '#e6f9ff' }} variant='elevated' minW='175px'>
          <List>
            {shoppingList.items.map((item) => (
              <ListItem key={item.id}>
                {item.name}
              </ListItem>
            ))}
          </List></Card>
      </Flex>
    </div>
  );
};

export default ShoppingList;