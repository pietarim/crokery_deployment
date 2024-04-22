import { useRadioGroup, useRadio, Wrap, Box, useTheme } from "@chakra-ui/react";
import { WorkMemryItem, OptionsForMenu, WorkMemorySelection, DbItem } from "../../types";
import { useSelector } from "react-redux";

interface ItemMenuProps {
  visibleItems: WorkMemorySelection[];
  selectedCategory: string | null;
  setSelectedItem: React.Dispatch<React.SetStateAction<DbItem | null>>;
  setSelectedCategory: React.Dispatch<React.SetStateAction<string | null>>;
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
  selectedCategory,
  setSelectedItem,
  setSelectedCategory
}: ItemMenuProps) => {

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

  const { getRootProps, getRadioProps } = useRadioGroup({
    name: 'framework',
    defaultValue: 'react',
    onChange: handleItemSelection,
  });

  const group = getRootProps();

  return (
    <div style={{ borderBottom: "black 1px solid", marginTop: "52px" }}>
      <Wrap mb={3} {...group}>
        {visibleItems.length && visibleItems.map((value, i) => {
          return (
            <Wrap key={i}>
              <Box
                cursor='pointer'
                borderRadius='md'
                boxShadow='md'
                onClick={() => setSelectedCategory(value.category)}
                style={{
                  backgroundColor: (selectedCategory == value.category) ? customBlue : brightBlue
                }}
                px={[2, 3]}
                py={[2, 3]}
              >
                {value.category}
              </Box>
              {(value.category == selectedCategory) ? value.items.map((item: WorkMemryItem) => {
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
    </div>
  );
};

export default ItemMenu;