import {
  Text, Button, List, ListItem, useTheme, NumberInput, NumberInputField, NumberInputStepper, NumberIncrementStepper,
  NumberDecrementStepper, Flex
} from "@chakra-ui/react";
import { SelectedItem, NewSelectedItem } from '../types';
import { useState } from 'react';

interface ListSelectedItemsProps {
  itemArray: SelectedItem[];
  setItemArray: React.Dispatch<React.SetStateAction<SelectedItem[]>>;
  selectedItem: NewSelectedItem | null;
  setSelectedItem: React.Dispatch<React.SetStateAction<NewSelectedItem | null>>;
}

const ListSelectedItems = ({ itemArray, setItemArray, selectedItem, setSelectedItem }: ListSelectedItemsProps) => {
  const [itemAmount, setItemAmount] = useState('0.00');

  const theme = useTheme();
  const bgColor = theme.colors.blue[300];
  const customYellow = theme.colors.yellow[300];

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
          mt='2'
          mr='2'
          ml='2'
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

  if (!itemArray.length) {
    return (
      <Flex direction='column'>
        <Flex direction='row' align='center' justify='center' mt='3'>
          <Text style={{
            backgroundColor: customYellow,
            margin: '3px',
            borderRadius: '20px',
            display: 'inline-block',
            padding: '4px'
          }}>{selectedItem ? selectedItem.name : 'pick item'}</Text>
          {numberImput()}
        </Flex>
        <Button
          colorScheme='customeExit'
          variant='outline'
          isDisabled={(!selectedItem || itemAmount === '0.00') ? true : false}
          onClick={() => addItemsToArr(true)}
          mt='5'
        >
          Add item
        </Button>
      </Flex>
    );
  } else {
    return (
      <>
        <List style={{ backgroundColor: "white", borderRadius: '6px', padding: "4px" }}>
          {itemArray.length && itemArray.map((item, id) => {
            return <ListItem
              style={{ backgroundColor: bgColor, margin: '3px', borderRadius: '20px', display: 'inline-block', padding: '4px' }}
              key={id}>{item.name} {item.amount}
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
        </Flex>
        <Button
          mt='5'
          colorScheme='customeExit'
          variant='outline'
          isDisabled={(!selectedItem || itemAmount === '0.00') ? true : false}
          onClick={() => addItemsToArr(false)}
        >
          Add item
        </Button>
      </>
    );
  }
};

export default ListSelectedItems;