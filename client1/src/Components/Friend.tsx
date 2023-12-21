import {
  useRadioGroup, Wrap, Box, useRadio, Card, CardBody, Flex,
  FormControl, FormLabel, FormErrorMessage, Input, Textarea, Button,
  NumberInput, NumberInputField, NumberInputStepper, NumberIncrementStepper,
  NumberDecrementStepper, Text, List, ListItem, Image, useTheme
} from "@chakra-ui/react";
import { Field, Form, Formik } from 'formik';
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
          bg: '#CF9332',
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

const Friend = () => {
  const [options3, setOptions3] = useState<any[]>([]);
  const { get, post, deleteReq } = useAxios();
  const [visibleData, setVisibleData] = useState<any[]>([]);
  const [hiddenCategoryList, setHiddenCategoryList] = useState<string[]>([]);
  const [itemArray, setItemArray] = useState<any[]>([]);
  const [itemAmount, setItemAmount] = useState<string>("");
  const [selected, setSelected] = useState<any>(null);
  const [previewImage, setPreviewImage] = useState<any>(null);
  const [imageToUpload, setImageToUpload] = useState<any>(null);

  const theme = useTheme();
  const bgColor = theme.colors.blue[300];
  const customYellow = theme.colors.yellow[300];

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

  const setSelectedItem = (id: string) => {
    const allItems = options3.map((item) => item.items).flat();
    const item = allItems.find((item) => item.id.toString() === id);
    setSelected(item);
  };

  const { getRootProps, getRadioProps } = useRadioGroup({
    name: 'framework',
    defaultValue: 'react',
    onChange: setSelectedItem,
  });

  const addItemsToArr = (isFirst: boolean) => {
    console.log(itemAmount);
    if (!selected || itemAmount === '0.00') {
      return;
    } else if (isFirst) {
      setItemArray([{ name: selected.name, amount: itemAmount, id: selected.id }]);
      setSelected(null);
      setItemAmount('0.00');
    } else {
      setItemArray([...itemArray, { name: selected.name, amount: itemAmount, id: selected.id }]);
      setSelected(null);
      setItemAmount('0.00');
    }
  };

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

  const returnItemArray = () => {
    console.log(itemArray);
    if (!itemArray.length) {
      return (
        <>
          <Text style={{
            backgroundColor: customYellow,
            margin: '3px',
            borderRadius: '20px',
            display: 'inline-block',
            padding: '4px'
          }}>{selected ? selected.name : 'pick item'}</Text>
          <Button colorScheme='customeExit' variant='outline' isDisabled={(!selected || itemAmount === '0.00') ? true : false} onClick={() => addItemsToArr(true)}>Add item</Button>
        </>
      );
    } else {
      return (
        <>
          <List>
            {itemArray.map((item, id) => {
              return <ListItem
                style={{ backgroundColor: bgColor, margin: '3px', borderRadius: '20px', display: 'inline-block', padding: '4px' }}
                key={id}>{item.name} {item.amount}
              </ListItem>;
            })}
          </List>
          <Text style={{
            backgroundColor: customYellow,
            margin: '3px',
            borderRadius: '20px',
            display: 'inline-block',
            padding: '4px'
          }}>{selected ? selected.name : "pick item"}</Text>
          <Button colorScheme='customeExit' variant='outline' isDisabled={(!selected || itemAmount === '0.00') ? true : false} onClick={() => addItemsToArr(false)}>Add item</Button>
        </>
      );
    }
  };

  interface Item {
    id: number;
    name: string;
    unitSize: number;
  }

  const group = getRootProps();

  function validateName(value) {
    let error;
    if (!value) {
      error = 'Name is required';
    }
    return error;
  }

  function validatePassword(value) {
    let error;
    if (!value) {
      error = 'Password is required';
    }
    return error;
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    setImageToUpload(file);

    if (file && file.type.match('image.*')) {
      const reader = new FileReader();
      reader.onload = (readEvent: ProgressEvent<FileReader>) => {
        if (readEvent.target && readEvent.target.result) {
          setPreviewImage(readEvent.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRecipeSubmit = (recipe: any) => {
    console.log('handleRecipeSubmit');
    if (imageToUpload) {
      const formData = new FormData();
      formData.append('image', imageToUpload);
      post('/images', formData)
        .then((imageQuery) => {
          console.log('mitä tapahtuu kun imageQuery on valmis');
          const imageUri = imageQuery.data.imageUri;
          post('/recipes', { ...recipe, imageUri })
            .then((response) => {
              console.log(response);
            })
            .catch((e) => {
              if (e.response.data.error === 'Image upload failed') {
                deleteReq(`/image${imageUri}`);
              } else {
                console.log(e.response.data.error);
              }
            });
        })
        .catch((e) => {
          console.log('epäonnistunut imageQuery');
          console.log(e);
        });
    }
  };

  return (
    <>
      <Flex>
        <Card mb='2' variant='filled'>
          <CardBody>
            <Formik
              initialValues={{ name: '', description: '', public: false }}
              onSubmit={(values, actions) => {
                console.log('submitting on käynnissä');
                const recipe = {
                  name: values.name,
                  description: values.description,
                  /* public: values.public, */
                  global: false,
                  incredients: itemArray,
                };
                handleRecipeSubmit(recipe);
                actions.setSubmitting(false);
              }}
            >
              {(props) => (
                <Form>
                  <Field name='name' validate={validateName}>
                    {({ field, form }) => (
                      <FormControl isInvalid={form.errors.name && form.touched.name}>
                        <FormLabel>Recipe name</FormLabel>
                        <Input style={{ backgroundColor: "white" }} {...field} placeholder='name' />
                        <FormErrorMessage>{form.errors.name}</FormErrorMessage>
                      </FormControl>
                    )}
                  </Field>
                  <Field name='description' validate={validatePassword}>
                    {({ field, form }) => (
                      <FormControl isInvalid={form.errors.description && form.touched.description}>
                        <FormLabel>Recipe description</FormLabel>
                        <Textarea
                          {...field}
                          placeholder='Here is a sample placeholder'
                          style={{ backgroundColor: "white" }}
                          size='sm'
                        />
                        <FormErrorMessage>{form.errors.description}</FormErrorMessage>
                      </FormControl>
                    )}
                  </Field>
                  <input type='file' accept='image/*' onChange={handleImageChange} />
                  {previewImage ? <Box boxSize='sm'><Image src={previewImage} alt='recipe' /></Box> : null}
                  <label>
                    <Field type='checkbox' name='public' />
                    Make public
                  </label>
                  <br />
                  {returnItemArray()}
                  <NumberInput
                    onChange={(valueString) => setItemAmount(valueString)}
                    value={itemAmount}
                    precision={2}
                    step={0.01}
                  >
                    <NumberInputField style={{ backgroundColor: "white" }} />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput> kg/l
                  <br />
                  <Button
                    mt={4}
                    colorScheme='itemColor'
                    isLoading={props.isSubmitting}
                    type='submit'
                  >
                    Submit
                  </Button>
                </Form>
              )}
            </Formik>
          </CardBody>
        </Card>
      </Flex >
      <Wrap {...group}>
        {visibleData.map((value, i) => {
          return (
            <Wrap key={i}>
              <Box
                cursor='pointer'
                borderRadius='md'
                boxShadow='md'
                onClick={() => hadleToggleHideList(value.category)}
                style={{ backgroundColor: hiddenCategoryList.includes(value.category) ? "#466C8F" : "#3283CF" }} px={[2, 3]} // less padding on smaller screens
                py={[2, 3]}
              >
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
    </>
  );
};

export default Friend;