import {
  Flex, Card, CardBody, FormControl, FormLabel, Input, FormErrorMessage, NumberInput,
  NumberInputStepper, NumberInputField, Button, NumberIncrementStepper,
  NumberDecrementStepper, Textarea, Image, Box
} from "@chakra-ui/react";
import { Formik, Form, Field } from 'formik';
import {
  FormRecipe, FormikProps, FormikPropsWithTextarea, SelectedItem
} from "../types";
import { useAxios } from "../hooks/useAxios";
import React, { useEffect, useState } from "react";

interface RecipeFormProps {
  itemArray: SelectedItem[];
}

const RecipeForm = ({ itemArray }: RecipeFormProps) => {
  const [imageToUpload, setImageToUpload] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const { post, deleteReq } = useAxios();

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
    } else {
      post('/recipes', recipe)
        .then((response) => {
          console.log(response);
        })
        .catch((e) => {
          console.log(e.response.data.error);
        });
    }
  };

  return (
    <>
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
    </>
  );
};

export default RecipeForm;