import {
  Card, CardBody, Flex, Button, Heading, Divider, Stack, Progress
} from "@chakra-ui/react";
import { Form, Formik } from 'formik';
import { useAxios } from "../../hooks/useAxios";
import React, { useEffect, useState, useContext } from "react";
import {
  DbItem, SelectedItem, FormRecipe, OptionsForMenu
} from "../../types";
import ListSelectedItems from "./ListSelectedItems";
import { setItemOptions } from "../../redux/modules/itemOptions";
import { useDispatch } from "react-redux";
import { useNotification } from "../../hooks/useNotification";
import RecipeTitleAndDescription from "./RecipeTitleAndDescription";
import CreateRecipeImage from "./CreateRecipeImage";
import { RecipeToggleContext } from "../../context/CreateRecipeToggleContext";

const CreateRecipe = () => {
  const dispatch = useDispatch();
  const { get, post, deleteReq } = useAxios();
  const [visibleItems, setVisibleItems] = useState<OptionsForMenu[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [itemArray, setItemArray] = useState<SelectedItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<DbItem | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [imageToUpload, setImageToUpload] = useState<File | null>(null);

  const { progress } = useContext(RecipeToggleContext);

  const { showNotification } = useNotification();

  useEffect(() => {
    const getItems = async () => {
      try {
        const itemsQuery = await get('/items');
        const itemList: OptionsForMenu[] = itemsQuery.data;
        if (!itemList.length) {
          return;
        } else if (itemList.length) {
          dispatch(setItemOptions(itemList));
          setVisibleItems(itemList);
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

    if (file && (file.type === "image/png" || file.type === "image/jpeg" || file.type === "image/webp")) {
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
          console.log('image uploaded');
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
        <Card mb='2' variant='filled' style={{ backgroundColor: '#e2e6e9' }} width={{ base: "100%", md: "480px", lg: "980px", xl: "1260px" }}>
          <Stack>
            <Progress value={progress} />
          </Stack>
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
                  <RecipeTitleAndDescription
                    validateName={validateName}
                    validateDescription={validateDescription}
                  />
                  <CreateRecipeImage
                    handleImageChange={handleImageChange}
                    previewImage={previewImage}
                  />
                  <ListSelectedItems
                    itemArray={itemArray}
                    setItemArray={setItemArray}
                    selectedItem={selectedItem}
                    setSelectedItem={setSelectedItem}
                    visibleItems={visibleItems}
                    selectedCategory={selectedCategory}
                    setSelectedCategory={setSelectedCategory}
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
    </>
  );
};

export default CreateRecipe;