import { useRadioGroup, Wrap, Box, useRadio, Heading } from "@chakra-ui/react";
import { useAxios } from "../hooks/useAxios";
import { useEffect, useState } from "react";

function RadioCard(props) {
  const { getInputProps, getRadioProps } = useRadio(props);

  const input = getInputProps();
  const checkbox = getRadioProps();

  return (
    <Box as='label'>
      <input {...input} />
      <Box
        {...checkbox}
        cursor='pointer'
        borderWidth='1px'
        borderRadius='md'
        boxShadow='md'
        _checked={{
          bg: 'teal.600',
          color: 'white',
          borderColor: 'teal.600',
        }}
        _focus={{
          boxShadow: 'outline',
        }}
        px={5}
        py={3}
      >
        {props.children}
      </Box>
    </Box>
  );
}

const Friend = () => {
  const [options3, setOptions3] = useState<any[]>([]);
  const { get } = useAxios();
  const [visibleData, setVisibleData] = useState<any[]>([]);
  const [hiddenCategoryList, setHiddenCategoryList] = useState<string[]>([]);

  const handleVisibleData = (hiddenCategoryList: string[], workMemoryList: any[]) => {
    const newVisibleData = workMemoryList.map((item) => {
      if (!hiddenCategoryList.includes(item.category)) {
        return item;
      } else {
        return { category: item.category, items: [] };
      }
    });
    setVisibleData(newVisibleData);
  };

  useEffect(() => {
    const getItems = async () => {
      const itemsQuery = await get('/items');
      const arr = itemsQuery.data;
      const initialHiddenCategoryList = arr.map((item) => item.category);
      setHiddenCategoryList(initialHiddenCategoryList);
      setOptions3(arr);
      setVisibleData(arr);
      handleVisibleData(initialHiddenCategoryList, arr);
    };
    getItems();
  }, []);

  const [theChoosenOne, setTheChoosenOne] = useState<any>(null);

  const setSelectedItem = (id: string) => {
    const allItems = options3.map((item) => item.items).flat();
    const item = allItems.find((item) => item.id.toString() === id);
    setTheChoosenOne(item);
  };

  const { getRootProps, getRadioProps } = useRadioGroup({
    name: 'framework',
    defaultValue: 'react',
    onChange: setSelectedItem,
  });

  const hadleToggleHideList = (category: string) => {
    if (hiddenCategoryList.includes(category)) {
      const newHiddenCategoryList = hiddenCategoryList.filter((c) => c !== category);
      setHiddenCategoryList(newHiddenCategoryList);
      handleVisibleData(newHiddenCategoryList, options3);
    } else {
      const newHiddenCategoryList = [...hiddenCategoryList, category];
      setHiddenCategoryList(newHiddenCategoryList);
      handleVisibleData(newHiddenCategoryList, options3);
    }
  };

  interface Item {
    id: number;
    name: string;
    unitSize: number;
  }

  const group = getRootProps();

  return (
    <>
      <Wrap {...group}>
        {visibleData.map((value, i) => {
          return (
            <Wrap key={i}>
              <Box
                cursor='pointer'
                borderRadius='md'
                boxShadow='md'
                px={5} py={3}
                onClick={() => hadleToggleHideList(value.category)}
                style={{ backgroundColor: hiddenCategoryList.includes(value.category) ? "grey" : "lightBlue" }}>
                {value.category}
              </Box>
              {value.items.map((item: Item) => {
                const radio = getRadioProps({ value: item.id.toString() });
                return (
                  <RadioCard key={item.id.toString()} {...radio}>
                    {item.name}
                  </RadioCard>
                );
              })
              }
            </Wrap>
          );
        })}
      </Wrap>
      <Heading>{theChoosenOne?.name}</Heading>
    </>
  );
};

export default Friend;