import {
  Text, Button, List, ListItem, useTheme, NumberInput, NumberInputField, NumberInputStepper, NumberIncrementStepper,
  NumberDecrementStepper, Flex, Heading
} from "@chakra-ui/react";
import { SmallCloseIcon } from '@chakra-ui/icons';
import { SelectedItem, DbItem, WorkMemorySelection } from '../../types';
import { useState, useContext } from 'react';
import { RecipeToggleContext } from "../../context/CreateRecipeToggleContext";
import ItemMenu from "./ItemMenu";
import TitleBox from "./TitleBox";
import FormSectionButton from "./FormSectionButton";

interface ListSelectedItemsProps {
  itemArray: SelectedItem[];
  setItemArray: React.Dispatch<React.SetStateAction<SelectedItem[]>>;
  selectedItem: DbItem | null;
  setSelectedItem: React.Dispatch<React.SetStateAction<DbItem | null>>;
  visibleItems: WorkMemorySelection[];
  selectedCategory: string | null;
  setSelectedCategory: React.Dispatch<React.SetStateAction<string | null>>;
}

const ListSelectedItems = ({
  itemArray,
  setItemArray,
  selectedItem,
  setSelectedItem,
  visibleItems,
  selectedCategory,
  setSelectedCategory
}: ListSelectedItemsProps) => {
  const [itemAmount, setItemAmount] = useState('0.00');
  const { itemVisible, toggleVisible } = useContext(RecipeToggleContext);

  const theme = useTheme();
  const bgColor = theme.colors.blue[300];
  const customBlue = theme.colors.customBlue[300];
  const customYellow = theme.colors.customYellow[500];

  const renderItemMenu = () => {
    return (
      <ItemMenu
        visibleItems={visibleItems}
        selectedCategory={selectedCategory}
        setSelectedItem={setSelectedItem}
        setSelectedCategory={setSelectedCategory}
      />
    );
  };

  const addItemsToArr = (isFirst: boolean) => {
    if (!selectedItem || itemAmount === '0.00') {
      return;
    } else if (isFirst) {
      setItemArray([{ name: selectedItem.name, amount: itemAmount, id: selectedItem.id }]);
      setSelectedItem(null);
      setItemAmount('0.00');
    } else {
      setItemArray([...itemArray, { name: selectedItem.name, amount: itemAmount, id: selectedItem.id }]);
      setSelectedItem(null);
      setItemAmount('0.00');
    }
  };

  const numberImput = () => {
    return (
      <>
        <NumberInput
          size='lg'
          maxW={32}
          onChange={(valueString) => setItemAmount(valueString)}
          value={itemAmount}
          precision={2}
          step={0.01}
          ml='6'
          mr='2'
        >
          <NumberInputField style={{ backgroundColor: "white" }} />
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        </NumberInput> kg/l
      </>
    );
  };

  if (!itemVisible) {
    return (
      <FormSectionButton title='Recipe incredients' toggleVisible={toggleVisible} toggleSelection="itemVisible" />
    );
  }

  else if (!itemArray.length) {
    return (
      <Flex direction='column'>
        <TitleBox title='Recipe incredients 3/3' />
        <Heading as='h3' mt='12' mb='10' size='md'>Added incredients:</Heading>
        <Flex direction='row' align='center' justify='center' mt='3'>
          <Text style={{
            backgroundColor: customBlue,
            margin: '3px',
            borderRadius: '20px',
            display: 'inline-block',
            padding: '4px'
          }}>
            {selectedItem ? selectedItem.name : 'pick item'}
          </Text>
          {numberImput()}
          {selectedItem && <Button
            ml='6'
            colorScheme='customeExit'
            variant='outline'
            isDisabled={(!selectedItem || itemAmount === '0.00') ? true : false}
            onClick={() => addItemsToArr(true)}
          >
            Add item
          </Button>}
        </Flex>
        {renderItemMenu()}
      </Flex>
    );
  } else {
    return (
      <>
        <TitleBox title='Recipe incredients 3/3' />
        <Heading as='h4' mt={8} mb={8} size='md'>Added incredients:</Heading>
        <List style={{ backgroundColor: "white", borderRadius: '6px', padding: "4px" }}>
          {itemArray.length && itemArray.map((item, id) => {
            return <ListItem
              style={{
                backgroundColor: bgColor,
                margin: '3px',
                borderRadius: '20px',
                display: 'inline-block',
                padding: '4px'
              }}
              key={id}>{item.name} {item.amount} <SmallCloseIcon
                _hover={{ cursor: 'pointer' }}
                onClick={() => {
                  const newArray = itemArray.filter((i) => i.id !== item.id);
                  setItemArray(newArray);
                }} />
            </ListItem>;
          })}
        </List>
        <Flex direction='row' align='center' justify='center' mt='3'>
          <Text
            m='3'
            style={{
              backgroundColor: customYellow,
              borderRadius: '20px',
              display: 'inline-block',
              padding: '4px'
            }}>{selectedItem ? selectedItem.name : "pick item"}</Text>
          {numberImput()}
          {selectedItem && <Button
            ml="1"
            colorScheme='customeExit'
            variant='outline'
            isDisabled={(!selectedItem || itemAmount === '0.00') ? true : false}
            onClick={() => addItemsToArr(false)}
          >
            Add item
          </Button>}
        </Flex>

        {renderItemMenu()}
      </>
    );
  }
};

export default ListSelectedItems;