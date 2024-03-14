import {
  Box, Card, CardBody, Flex,
  FormControl, FormLabel, FormErrorMessage, Input, Textarea, Button, Image, Heading,
  Divider, Text
} from "@chakra-ui/react";
import { Field, Form, Formik } from 'formik';
import { useAxios } from "../hooks/useAxios";
import React, { useEffect, useState } from "react";
import {
  DbItem, WorkMemorySelection, SelectedItem, NewSelectedItem,
  FormRecipe, FormikProps, FormikPropsWithTextarea
} from "../types";
import ListSelectedItems from "./ListSelectedItems";
import ItemMenu from "./ItemMenu";
import { setItemOptions } from "../redux/modules/itemOptions";
import { useDispatch } from "react-redux";
import { useNotification } from "../hooks/useNotification";

const CreateRecipe = () => {
  const dispatch = useDispatch();
  const { get, post, deleteReq } = useAxios();
  const [visibleItems, setVisibleItems] = useState<WorkMemorySelection[]>([]);
  const [hiddenCategoryList, setHiddenCategoryList] = useState<string[]>([]);
  const [itemArray, setItemArray] = useState<SelectedItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<NewSelectedItem | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [imageToUpload, setImageToUpload] = useState<File | null>(null);

  const { showNotification } = useNotification();

  const handleVisibleItems = (hiddenCategoryList: string[], workMemoryList: WorkMemorySelection[]) => {
    const newVisibleData = workMemoryList.map((item) => {
      if (!hiddenCategoryList.includes(item.category)) {
        return item;
      } else {
        return { category: item.category, items: [] };
      }
    });
    setVisibleItems(newVisibleData);
  };

  useEffect(() => {
    const getItems = async () => {
      try {
        const itemsQuery = await get('/items');
        const itemList = itemsQuery.data;
        if (!itemList.length) {
          return;
        } else if (itemList.length) {
          const initialHiddenCategoryList = itemList.map((item: DbItem) => item.category);
          setHiddenCategoryList(initialHiddenCategoryList);
          dispatch(setItemOptions(itemList));
          setVisibleItems(itemList);
          handleVisibleItems(initialHiddenCategoryList, itemList);
        }
      }
      catch {
        showNotification('Failed to get items', 'error');
      }
    };
    getItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function validateName(value: string) {
    let error;
    if (!value) {
      error = 'Recipe name is required';
    }
    return error;
  }

  function validateDescription(value: string) {
    let error;
    if (!value) {
      error = 'Recipe description is required';
    }
    return error;
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;

    if (file && (file.type === "image/png" || file.type === "image/jpeg")) {
      setImageToUpload(file);
      const reader = new FileReader();
      reader.onload = (readEvent: ProgressEvent<FileReader>) => {
        if (readEvent.target && readEvent.target.result) {
          setPreviewImage(readEvent.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    } else {
      showNotification('Failed to add image', 'error');
    }
  };

  const handleRecipeSubmit = (recipe: FormRecipe) => {
    if (imageToUpload) {
      const formData = new FormData();
      formData.append('image', imageToUpload);
      post('/images', formData)
        .then((imageQuery) => {
          const imageUri = imageQuery.data.imageUri;
          post('/recipes', { ...recipe, imageUri })
            .then(() => {
              showNotification('Recipe added', 'success');
            })
            .catch(() => {
              showNotification('Adding recipe failed', 'error');
              deleteReq(`/image${imageUri}`);
            });
        })
        .catch(() => {
          showNotification('Adding recipe failed', 'error');
        });
    } else {
      post('/recipes', recipe)
        .then(() => {
          showNotification('Recipe added', 'success');
        })
        .catch(() => {
          showNotification('Adding recipe failed', 'error');
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
        <Card mb='2' variant='filled' style={{ backgroundColor: '#e2e6e9' }} width={{ base: "100%", md: "480px" }}>
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
                        <Input style={{ backgroundColor: "white" }} {...field} placeholder='Recipe name' />
                        <FormErrorMessage>{form.errors.name}</FormErrorMessage>
                      </FormControl>
                    )}
                  </Field>
                  <Field name='description' validate={validateDescription}>
                    {({ field, form }: FormikPropsWithTextarea) => (
                      <FormControl isInvalid={!!form.errors.description && form.touched.description}>
                        <FormLabel>Recipe description</FormLabel>
                        <Textarea
                          {...field}
                          placeholder='Description of the recipe...'
                          style={{ backgroundColor: "white" }}
                          size='sm'
                        />
                        <FormErrorMessage>{form.errors.description}</FormErrorMessage>
                      </FormControl>
                    )}
                  </Field>
                  <Text fontSize='xs' style={{ marginTop: '18px', marginBottom: '2px', width: '100%', textAlign: 'left' }}>
                    Upload image (use .png, .jpg or .jpeg)
                  </Text>
                  <input
                    style={{ marginBottom: '18px', width: '100%', textAlign: 'left' }}
                    type='file' accept='image/png, image/jpeg' onChange={handleImageChange}
                  />
                  <label>
                    <Field type='checkbox' name='public' />
                    Make public
                  </label>
                  {previewImage ? <Box boxSize='sm' overflow='hidden'><Image src={previewImage} alt='recipe' /></Box> : null}
                  <Heading as='h4' mt='2' mb='4' size='md'>Added incredients:</Heading>
                  <ListSelectedItems
                    itemArray={itemArray}
                    setItemArray={setItemArray}
                    selectedItem={selectedItem}
                    setSelectedItem={setSelectedItem}
                  />
                  <br />
                  <Button
                    mt={8}
                    mb={7}
                    colorScheme='customeExit'
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
      <ItemMenu
        visibleItems={visibleItems}
        hiddenCategoryList={hiddenCategoryList}
        setSelectedItem={setSelectedItem}
        setHiddenCategoryList={setHiddenCategoryList}
        handleVisibleItems={handleVisibleItems}
      />
    </>
  );
};

export default CreateRecipe;