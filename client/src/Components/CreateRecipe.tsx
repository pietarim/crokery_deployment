import {
  useRadioGroup, Wrap, Box, useRadio, Card, CardBody, Flex,
  FormControl, FormLabel, FormErrorMessage, Input, Textarea, Button,
  NumberInput, NumberInputField, NumberInputStepper, NumberIncrementStepper,
  NumberDecrementStepper, Text, List, ListItem, Image, useTheme, Heading,
  Divider
} from "@chakra-ui/react";
import { Field, Form, Formik } from 'formik';
import { useAxios } from "../hooks/useAxios";
import React, { useEffect, useState } from "react";
import {
  DbItem, WorkMemorySelection, SelectedItem, NewSelectedItem, OptionsForMenu,
  FormRecipe, WorkMemryItem, FormikProps, FormikPropsWithTextarea
} from "../types";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function RadioCard(props: any) {
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

const CreateRecipe = () => {
  const [options3, setOptions] = useState<OptionsForMenu[]>([]);
  const { get, post, deleteReq } = useAxios();
  const [visibleData, setVisibleData] = useState<WorkMemorySelection[]>([]);
  const [hiddenCategoryList, setHiddenCategoryList] = useState<string[]>([]);
  const [itemArray, setItemArray] = useState<SelectedItem[]>([]);
  const [itemAmount, setItemAmount] = useState<string>("");
  const [selected, setSelected] = useState<NewSelectedItem | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [imageToUpload, setImageToUpload] = useState<File | null>(null);

  const theme = useTheme();
  const bgColor = theme.colors.blue[300];
  const customYellow = theme.colors.yellow[300];

  const handleVisibleData = (hiddenCategoryList: string[], workMemoryList: WorkMemorySelection[]) => {
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
      try {
        const itemsQuery = await get('/items');
        const arr = itemsQuery.data;
        if (!arr.length) {
          return;
        } else if (arr.length) {
          const initialHiddenCategoryList = arr.map((item: DbItem) => item.category);
          setHiddenCategoryList(initialHiddenCategoryList);
          setOptions(arr);
          setVisibleData(arr);
          handleVisibleData(initialHiddenCategoryList, arr);
        }
      }
      catch (e) {
        console.log(e);
      }
    };
    getItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setSelectedItem = (id: string) => {
    const allItems = options3.map((item) => item.items).flat();
    const item = allItems.find((item) => item.id.toString() === id);
    if (!item) {
      return;
    }
    setSelected(item);
  };

  const { getRootProps, getRadioProps } = useRadioGroup({
    name: 'framework',
    defaultValue: 'react',
    onChange: setSelectedItem,
  });

  const addItemsToArr = (isFirst: boolean) => {
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
          <Button
            colorScheme='customeExit'
            variant='outline'
            isDisabled={(!selected || itemAmount === '0.00') ? true : false}
            onClick={() => addItemsToArr(true)}
          >
            Add item
          </Button>
        </>
      );
    } else {
      return (
        <>
          <List>
            {itemArray.length && itemArray.map((item, id) => {
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
          <Button
            colorScheme='customeExit'
            variant='outline'
            isDisabled={(!selected || itemAmount === '0.00') ? true : false}
            onClick={() => addItemsToArr(false)}
          >
            Add item
          </Button>
        </>
      );
    }
  };

  const group = getRootProps();

  function validateName(value: string) {
    let error;
    if (!value) {
      error = 'Name is required';
    }
    return error;
  }

  function validatePassword(value: string) {
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

  const handleRecipeSubmit = (recipe: FormRecipe) => {
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
          console.log(e);
        });
    }
  };

  return (
    <>
      <Heading color='customeExit.custom' as='h2' size='2xl' textAlign="center" flex="1">
        Create new recipe
      </Heading>
      <Divider mb='2' style={{ marginTop: '10px', color: 'black' }} />
      <Flex justify={'center'}>
        <Card mb='2' variant='filled'>
          <CardBody>
            <Formik
              initialValues={{ name: '', description: '', public: false }}
              onSubmit={(values, actions) => {
                const recipe = {
                  name: values.name,
                  description: values.description,
                  public: values.public,
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
                    {({ field, form }: FormikProps) => (
                      <FormControl isInvalid={!!form.errors.name && form.touched.name}>
                        <FormLabel>Recipe name</FormLabel>
                        <Input style={{ backgroundColor: "white" }} {...field} placeholder='name' />
                        <FormErrorMessage>{form.errors.name}</FormErrorMessage>
                      </FormControl>
                    )}
                  </Field>
                  <Field name='description' validate={validatePassword}>
                    {({ field, form }: FormikPropsWithTextarea) => (
                      <FormControl isInvalid={!!form.errors.description && form.touched.description}>
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
                    colorScheme='customYellow'
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
        {visibleData.length && visibleData.map((value, i) => {
          return (
            <Wrap key={i}>
              <Box
                cursor='pointer'
                borderRadius='md'
                boxShadow='md'
                onClick={() => hadleToggleHideList(value.category)}
                style={{
                  backgroundColor: hiddenCategoryList.includes(value.category) ? "#466C8F" : "#3283CF"
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

export default CreateRecipe;