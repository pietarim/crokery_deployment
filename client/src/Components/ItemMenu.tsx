import { useRadioGroup, useRadio, Wrap, Box, useTheme } from "@chakra-ui/react";
import { WorkMemryItem, OptionsForMenu, WorkMemorySelection, NewSelectedItem } from "../types";
import { useSelector } from "react-redux";

interface ItemMenuProps {
  visibleItems: WorkMemorySelection[];
  hiddenCategoryList: string[];
  setSelectedItem: React.Dispatch<React.SetStateAction<NewSelectedItem | null>>;
  setHiddenCategoryList: React.Dispatch<React.SetStateAction<string[]>>;
  handleVisibleItems: (hiddenCategoryList: string[], workMemoryList: WorkMemorySelection[]) => void;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function RadioCard(props: any) {
  const { getInputProps, getRadioProps } = useRadio(props);

  const theme = useTheme();
  const customYellow = theme.colors.customYellow[500];

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
          bg: customYellow,
          color: 'white',
          borderColor: '#CF9332',
        }}
        _focus={{
          boxShadow: 'outline',
        }}
        py={[2, 3]}
      >
        {props.children}
      </Box>
    </Box>
  );
}

const ItemMenu = ({
  visibleItems,
  hiddenCategoryList,
  setSelectedItem,
  setHiddenCategoryList,
  handleVisibleItems }: ItemMenuProps) => {

  const theme = useTheme();
  const customBlue = theme.colors.customBlue['custom'];
  const brightBlue = theme.colors.brightBlue;

  interface AppState {
    itemOptions: OptionsForMenu[];
  }
  const itemOptions = useSelector((state: AppState) => state.itemOptions);

  const handleItemSelection = (id: string) => {
    const allItems = itemOptions.map((item) => item.items).flat();
    const item = allItems.find((item) => item.id.toString() === id);
    if (!item) {
      return;
    }
    setSelectedItem(item);
  };

  const hadleToggleHideList = (category: string) => {
    if (hiddenCategoryList.includes(category)) {
      const newHiddenCategoryList = hiddenCategoryList.filter((c) => c !== category);
      setHiddenCategoryList(newHiddenCategoryList);
      handleVisibleItems(newHiddenCategoryList, itemOptions);
    } else {
      const newHiddenCategoryList = [...hiddenCategoryList, category];
      setHiddenCategoryList(newHiddenCategoryList);
      handleVisibleItems(newHiddenCategoryList, itemOptions);
    }
  };

  const { getRootProps, getRadioProps } = useRadioGroup({
    name: 'framework',
    defaultValue: 'react',
    onChange: handleItemSelection,
  });

  const group = getRootProps();

  return (
    <>
      <Wrap {...group}>
        {visibleItems.length && visibleItems.map((value, i) => {
          return (
            <Wrap key={i}>
              <Box
                cursor='pointer'
                borderRadius='md'
                boxShadow='md'
                onClick={() => hadleToggleHideList(value.category)}
                style={{
                  backgroundColor: hiddenCategoryList.includes(value.category) ? customBlue : brightBlue
                }}
                px={[2, 3]}
                py={[2, 3]}
              >
                {value.category}
              </Box>
              {value.items.length ? value.items.map((item: WorkMemryItem) => {
                const radio = getRadioProps({ value: item.id.toString() });
                return (
                  <RadioCard key={item.id.toString()} {...radio}>
                    {item.name}
                  </RadioCard>
                );
              }) : null
              }
            </Wrap>
          );
        })}
      </Wrap>
    </>
  );
};

export default ItemMenu;